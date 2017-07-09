<template>
  <header class="row">
    <hr>
    <!-- Title & Flag -->
    <div class="small-12 columns">
      <label>Status: {{status}}</label>

      <select v-model="status" @change="setStatus">
        <option disabled value="">Please select one</option>
        <option :selected="state == status" v-for="state in available_states" :value="state">{{ state }}</option>
      </select>
    </div>
    <div class="columns">
      <div id="flag">
        <icon name="flag"></icon>
        <input id="projectFlag" type="checkbox" v-model="flag" name="project[flag]" @change="setFlag">
        <label for="checkbox">{{ flag ? "Flagged" : "Not Flagged" }}</label>
      </div>
    </div>
    <div class="columns">
      <div id="archive">
        <icon name="check"></icon><input id="projectArchive" type="checkbox" v-model="archive" @change="setArchive">
        <label for="checkbox">{{ archive ? "Archived" : "Archive" }}</label>
      </div>
    </div>
  </header>
</template>

<script>
  import Axios from "axios"
  import bus from "../../../bus.js"

  export default {
    name: 'Status',
    props: ['projectStatus', 'projectArchive', 'projectFlag'],
    data() {
      return {
        status: '',
        archive: '',
        flag: '',
        available_states: []
      }
    },
    watch: {
      projectStatus() {
        this.setInitProject()
      }
    },
    methods: {
      setInitProject() {
        if(this.projectStatus) {
          this.status = this.projectStatus
        }
        if(this.projectArchive) {
          this.archive = this.projectArchive
        }
        if(this.projectFlag) {
          this.flag = this.projectFlag
        }
      },
      setStatus() {
        bus.$emit('projectPropSet', 'status', this.status)
      },
      setArchive() {
        bus.$emit('projectPropSet', 'archive', this.archive)
      },
      setFlag() {
        bus.$emit('projectPropSet', 'flag', this.flag)
      }
    },
    created(){
      var vm = this
      this.setInitProject()
      // Get Available tactics
      Axios.get('/api/v1/projects/new.json')
        .then( response => {
          vm.available_states = response.data.states
        }).catch(error => {
          console.log(error)
        })
    },
  }
</script>
