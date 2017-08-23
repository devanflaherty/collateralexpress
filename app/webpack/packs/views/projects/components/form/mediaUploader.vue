<template>
  <div>
    <h3 v-if="projectMedia && projectMedia.length > 0">Files</h3>
    <transition-group name="mediaList" tag="ul" id="fileList" class="row small-up-4" v-if="projectMedia && projectMedia.length > 0">
      <li class="column" v-for="media in projectMedia" v-bind:key="media">
        <div class="card">

          <div class="thumb-container" :style="{ 'background-image': 'url(' + media.file.url + ')' }">
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
      url="/api/v1/media"
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
        <input id="projectId" type="hidden" name="project_id" :value="project.id">
        <!--<input type="hidden" name="project[title]" :value="project.title"> -->
    </Dropzone>
    <a href="#saveFiles" @click.prevent="processDropzone" class="button" v-if="projectId">Save Files</a>
  </div>
</template>


<script>
  import { mapGetters } from 'vuex'

  import axios from "axios"
  import Dropzone from 'vue2-dropzone'

  // App Components
  import bus from '../../../../bus'

  export default {
    name: 'MediaUploader',
    props: ['project-id'],
    components: {
      Dropzone
    },
    computed: {
      ...mapGetters({
        project: 'project',
        projectMedia: 'projectMedia',
      }),
      token() {
        return document.getElementsByName('csrf-token')[0].getAttribute('content')
      }
    },
    methods: {
      processDropzone() {
        this.$refs.dropzoneUploader.processQueue()
        bus.$emit('process')
      },
      uploadSuccess() {
        //add transition to state
        this.$notify({title: 'File Succesfully added'})
        axios.get('/api/v1/projects/' + this.projectId  + '.json')
          .then( response => {
            console.log('media updated')
            this.$store.dispatch('setProjectMedia', response.data.project_media.medias)
        })

        this.$store.dispatch('closeReveal')
        this.$refs.dropzoneUploader.removeAllFiles()
      },
      readyMedia() {
        bus.$emit('readyDZ', true)
      },
      removeMedia(id) {
        var filteredMedia = this.projectMedia.filter(m => m.id !== id)

        axios.delete('/api/v1/media/' + id,{
          utf8 : "✓",
          authenticity_token: this.token,
          project : this.project.id
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
      if(this.projectMedia.length > 0) {
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
