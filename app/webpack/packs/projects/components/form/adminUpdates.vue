<template>
  <div>
    <form v-on:submit.prevent="onSubmit" id="formGuts">
      <Status :projectStatus="project.status" :projectFlag="project.flag" :projectArchive="project.archive"></Status>

      <a href="#addFiles" @click.prevent="addFileModal" class="button">Add Files</a>

      <!-- <img :src="project.asset" v-if="project.asset">
      <input type="file" @change="onAssetChange" name="project[asset]" accept="image/*"> -->

      <textarea v-model="project.legal_review"></textarea>

      <input type="submit" value="Submit" class="button expanded">
    </form>

  </div>
</template>

<script>
import Axios from "axios"
import bus from "../../../bus.js"
import Status from "./status.vue"
import ProjectSubmission from "../mixins/ProjectSubmission.js"

export default {
  name: 'AdminUpdates',
  mixins: [ProjectSubmission],
  props: ['project'],
  components: {
    Status
  },
  data() {
    return {
    }
  },
  methods: {
    addFileModal() {
      $('#uploader').foundation('open');
    },
  },
  created(){
  },
  mounted(){
  }
}
</script>
