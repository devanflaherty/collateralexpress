<template>
  <header class="row">
    <hr>
    <!-- Title & Flag -->
    <div class="small-12 columns">
      <label>Status: {{project.status}}</label>

      <select v-model="project.status">
        <option disabled value="">Please select one</option>
        <option v-for="status in available_states">{{ status }}</option>
      </select>
    </div>
    <div class="columns">
      <div id="flag">
        <icon name="flag"></icon>
        <input id="projectFlag" type="checkbox" v-model="project.flag" name="project[flag]">
        <label for="checkbox">{{ project.flag ? "Flagged" : "Not Flagged" }}</label>
      </div>
    </div>
    <div class="columns">
      <div id="archive">
        <icon name="check"></icon><input id="projectArchive" type="checkbox" v-model="project.archive">
        <label for="checkbox">{{ project.archive ? "Archived" : "Archive" }}</label>
      </div>
    </div>
  </header>
</template>

<script>
  import Axios from "axios"

  export default {
    name: 'Status',
    props: ['project'],
    data() {
      return {
        available_states: []
      }
    },
    methods: {
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
    }
  }
</script>
