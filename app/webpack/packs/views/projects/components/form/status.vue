<template>
  <header class="row">
    <hr>
    <!-- Title & Flag -->
    <div class="small-12">
      <label>Status: {{status}}</label>

      <select v-model="status" @change="setStatus">
        <option disabled value="">Please select one</option>
        <option :selected="state == status" v-for="state in available_states" :value="state">{{ state }}</option>
      </select>
    </div>
    <div class="columns">
      <div class="check-input">
        <label for="projectFlag">
          <input style="display:none" id="projectFlag" type="checkbox" v-model="flag" @change="setFlag">
          <div v-if="flag" class="checked checked-true">
            <icon name="flag"></icon>
          </div>
          <div v-else class="checked">
            <icon name="circle-thin"></icon>
          </div>
          <span>{{ flag ? "Flagged" : "Not Flagged" }}</span>
        </label>
      </div>
    </div>
    <div class="columns">
      <div class="check-input">
        <label for="projectArchive">
          <input style="display:none" id="projectArchive" type="checkbox" v-model="archive" @change="setArchive">
          <div v-if="archive" class="checked checked-true">
            <icon name="check"></icon>
          </div>
          <div v-else class="checked">
            <icon name="circle-thin"></icon>
          </div>
          <span>{{ archive ? "Archived" : "Archive" }}</span>
        </label>
      </div>
    </div>
  </header>
</template>

<script>
  import Axios from "axios"
  import bus from "../../../../bus.js"

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

<style scoped lang="scss">
  .columns {
    padding-left: 0;
  }
  input[type='checkbox'] {
    margin-left: .5rem;
  }
</style>
