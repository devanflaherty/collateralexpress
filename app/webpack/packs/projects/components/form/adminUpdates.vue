<template>
  <div>
    <form v-on:submit.prevent="onSubmit" id="formGuts">
      <Status :projectStatus="project.status" :projectFlag="project.flag" :projectArchive="project.archive"></Status>

      <a href="#addFiles" @click.prevent="addFileModal" class="button">Add Files</a>

      <img :src="project.asset" v-if="project.asset">
      <input type="file" @change="onAssetChange" name="project[asset]" accept="image/*">

      <textarea v-model="project.legal_review"></textarea>

      <input type="submit" value="Submit" class="button expanded">
    </form>

  </div>
</template>

<script>
import Axios from "axios"
import bus from "../../../bus.js"
import Status from "./status.vue"
import FormMethods from "./formMethods.js"

export default {
  name: 'AdminUpdates',
  mixins: [FormMethods],
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
    onAssetChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length)
        return;
      this.createImage(files[0]);
    },
    createImage(file) {
      var image = new Image();
      var reader = new FileReader();
      var vm = this;

      reader.onload = (e) => {
        vm.project.asset = e.target.result;
      };
      reader.readAsDataURL(file);
    },
  },
  created(){
  },
  mounted(){
  }
}
</script>
