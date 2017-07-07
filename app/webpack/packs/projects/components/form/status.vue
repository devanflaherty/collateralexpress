<template>
  <header class="row">
    <hr>
    <!-- Title & Flag -->
    <div class="small-12 columns">
      <label>Status: {{status}}</label>

      <select v-model="status" @change="setStatus()">
        <option disabled value="">Please select one</option>
        <option :selected="state == status" v-for="state in available_states" :value="state">{{ state }}</option>
      </select>
    </div>
    <div class="columns">
      <div id="flag">
        <icon name="flag"></icon>
        <input id="projectFlag" type="checkbox" v-model="flag" name="project[flag]">
        <label for="checkbox">{{ flag ? "Flagged" : "Not Flagged" }}</label>
      </div>
    </div>
    <div class="columns">
      <div id="archive">
        <icon name="check"></icon><input id="projectArchive" type="checkbox" v-model="archive">
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
        available_states: []
      }
    },
    computed: {
      archive() {
        return this.projectArchive
      },
      flag() {
        return this.projectFlag
      },
    },
    watch: {
      projectStatus() {
        this.setInitStatus()
      },
      archive(a) {
        bus.$emit('projectPropSet', 'archive', a)
      },
      flag(f) {
        bus.$emit('projectPropSet', 'flag', f)
      }
    },
    methods: {
      setInitStatus() {
        if(this.projectStatus) {
          this.status = this.projectStatus
        }
      },
      setStatus() {
        bus.$emit('projectPropSet', 'status', this.status)
      }
    },
    created(){
      var vm = this
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
