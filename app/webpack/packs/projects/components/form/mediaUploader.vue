<template>
  <div class="row" id="fileUploader">
    <div class="small-12 column">
      <div class="fieldset">
        <h3 v-if="mediaFiles && mediaFiles.length > 0">Files</h3>
        <transition-group name="mediaList" tag="ul" id="fileList" class="row small-up-4" v-if="mediaFiles && mediaFiles.length > 0">
          <li class="column" v-for="media in mediaFiles" v-bind:key="media">
            <div class="card">

              <div class="thumb-container" :style="{ 'background-image': 'url(' + media.file.thumb.url + ')' }">
                <button @click.prevent="removeMedia(media.id)">
                  <icon name="close"></icon><br>
                  <span>Remove File</span>
                </button>
              </div>

            </div>
          </li>
        </transition-group>

        <h3>Add Files</h3>
        <Dropzone
          enctype="multipart/form-data"
          ref="dropzoneUploader"
          id="dropzoneUploader"
          url="/media"
          :auto-process-queue="false"
          :showRemoveLink="true"
          :upload-multiple="true"
          :max-number-of-files="6"
          param-name="file"
          v-on:vdropzone-success="uploadSuccess"
          v-on:vdropzone-file-added="readyMedia"
          useFontAwesome>
            <!-- Optional parameters if any! -->
            <input type="hidden" name="utf8" value="✓">
            <input type="hidden" name="authenticity_token" :value="token">
            <input id="projectId" type="hidden" name="project_id" :value="projectId ? projectId : projectParam">
            <!--<input type="hidden" name="project[title]" :value="project.title"> -->
        </Dropzone>
        <a href="#saveFiles" @click.prevent="processDropzone" class="button" v-if="projectId">Save Files</a>
      </div>

    </div>
  </div>
</template>


<script>
  import Axios from "axios"
  import Dropzone from 'vue2-dropzone'

  // App Components
  import bus from '../../../bus'

  export default {
    name: 'MediaUploader',
    props: ['mediaFiles','token', 'project-id', 'flash'],
    components: {
      Dropzone
    },
    data() {
      return {
        styles: {
        }
      }
    },
    computed: {
      projectParam() {
        var proj = this.projectId
        if(this.projectId) {
          proj = this.projectId
        }
        return proj
      }
    },
    methods: {
      processDropzone() {
        this.$refs.dropzoneUploader.processQueue()
        bus.$emit('process')
      },
      uploadSuccess() {
        //add transition to state
        var vm = this
        this.$notify({title: 'File Succesfully added'})
        Axios.get('/api/v1/projects/' + this.projectId  + '.json')
          .then( response => {
            console.log('media updated')
            console.log(response.data.project.medias)
            bus.$emit("mediaEmit", response.data.project.medias)
        })

        // $('#uploader').foundation('close');
        this.$refs.dropzoneUploader.removeAllFiles()
      },
      readyMedia() {
        this.dzUpload = true
      },
      removeMedia(id) {
        var vm = this
        var filteredMedia = vm.mediaFiles.filter(m => m.id !== id)

        Axios.delete('/media/' + id,{
          utf8 : "✓",
          authenticity_token: vm.token,
          project : vm.project_id
        })
        .then( response => {
          console.log('did it')
          bus.$emit("mediaEmit", filteredMedia)
        })
      },
    },
    mounted() {
      bus.$on('uploadMedia', (pid) => {
        console.log('uploadMedia Emission')
        var projInput = document.getElementById('projectId')
        projInput.value = pid
        this.processDropzone()
      })
      if(this.mediaFiles.length > 0) {
        this.uploader = false
      }
    }
  }

</script>

<style scoped lang="scss">
.mediaList-enter-active, .mediaList-leave-active {
  transition: all 1s;
}
.mediaList-enter, .mediaList-leave-to /* .list-leave-active for <2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
</style>s
