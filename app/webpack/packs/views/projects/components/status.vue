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
  export default {
    name: 'Status',
    props: ['projectStatus', 'projectArchive', 'projectFlag'],
    data() {
      return {
        status: this.projectStatus,
        archive: this.projectArchive,
        flag: this.projectFlag,
        available_states: []
      }
    },
    watch: {
    },
    methods: {
      setStatus() {
        this.$store.dispatch({
          type: 'setProjectProperty',
          project: { status: this.status }
        })
      },
      setArchive() {
        this.$store.dispatch({
          type: 'setProjectProperty',
          project: { archive: this.archive}
        })
      },
      setFlag() {
        this.$store.dispatch({
          type: 'setProjectProperty',
          project: { flag: this.flag}
        })
      }
    },
    created(){
      // Get Available tactics
      this.axios.get('/api/v1/projects/new.json')
        .then( response => {
          this.available_states = response.data.states
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
