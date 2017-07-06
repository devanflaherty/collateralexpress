<template>
  <div class="row">
    <div class="small-12 column">
      <h3>Files</h3>
      <transition-group name="mediaList" tag="ul" class="row small-up-4">
        <li class="column" v-for="media in mediaFiles" v-bind:key="media">
          <img :src="media.file.thumb.url" @click="removeMedia(media.id)">
        </li>
      </transition-group>

      <h3>Add Files</h3>
      <Dropzone
        ref="mediaFiles"
        id="mediaFiles"
        url="/media"
        :upload-multiple="true"
        parallel-uploads="10"
        param-name="file"
        v-on:vdropzone-success="uploadSuccess()"
        v-on:vdropzone-mounted="$notify({title: 'success'})"
        useFontAwesome>
          <!-- Optional parameters if any! -->
          <input type="hidden" name="utf8" value="✓">
          <input type="hidden" name="authenticity_token" :value="token">
          <input type="hidden" name="project_id" :value="projectId">
          <!--<input type="hidden" name="project[title]" :value="project.title"> -->
      </Dropzone>
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
      return {}
    },
    methods: {
      uploadSuccess() {
        //add transition to state
        var vm = this
        this.$notify({title: 'File Succesfully added'})
        Axios.get('/api/v1/projects/' + this.projectId  + '.json')
          .then( response => {
            bus.$emit("mediaEmit", response.data.medias)
          })
        this.$refs.mediaFiles.removeAllFiles()
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
