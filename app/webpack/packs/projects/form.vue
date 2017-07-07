<template>
  <form v-on:submit.prevent="onSubmit" id="formGuts">
    <vue-progress-bar id="progressBar"></vue-progress-bar>

    <!-- <div id="formContainer" class="row expand"> -->
      <!-- <div id="infoPanel" class="columns"></div> -->
      <!-- <div id="formPanel" class="small-12 medium-12 columns"> -->

      <!-- </div> -->
    <!-- </div> -->
    <!-- Close Row -->
    <a class='button alert'
      id="deleteProject"
      @click="deletePrompt"
      v-if="project.id">
      Delete
    </a>

    <Status :projectStatus="project.status" :projectFlag="project.flag" :projectArchive="project.archive"></Status>

    <hr>

    <div class="row">
      <div class="columns">
        <label>Title: {{project.title}}</label>
        <input v-model.lazy="project.title" name="project[title]" type="text">
      </div>
    </div>

    <div class="row">
      <div class="column">
        <label>Description: {{project.description}}</label>
        <textarea v-model.lazy="project.description" name="project[description]"></textarea>
      </div>
    </div>

    <div class="row">
      <div class="column">
        <h3>Tactics</h3>
        <div class="row">
          <div class="small-4 column" v-for="tactic in available_tactics" v-bind:key="tactic" >
            <input type="checkbox" :id="tactic" :value="tactic" v-model="project.tactic">
            <label :for="tactic">
              {{tactic}}
            </label>
          </div>
        </div>

        <div class="row" v-if="project.tactic.includes('Other')">
          <div class="columns small-6">
            <h4>Other</h4>
            <input type="text" v-model.lazy="tactic_other" value="">
          </div>
        </div>
        <br>
        <span>Selected Tactics: {{ project.tactic }}</span>
      </div>
    </div>

    <div class="row">
      <div class="small-12 column">
        <h3>Who is this for?</h3>
      </div>

      <div class="small-12 column">
        <label>Business Unit: {{project.business_unit}}</label>
        <input v-model="project.business_unit" name="project[business_unit]" type="text">
      </div>

      <div class="small-12 column">
        <label>Target Audience: {{project.target}}</label>
        <input v-model="project.target" name="project[target]" type="text">
      </div>

      <div class="small-12 column">
        <input id="projectExists" type="checkbox" v-model="project.existing">
        <label for="checkbox">{{ project.existing ? "Existing Project" : "New Project" }}</label>
      </div>
    </div>

    <div class="row">
      <div class="small-12 column">
        <h3>Project Details</h3>
      </div>

      <div class="small-12 column">
        <label>Due Date: {{project.due_date}}</label>
        <input v-model="project.due_date" name="project[due_date]" type="text">
      </div>

      <div class="small-12 column">
        <input id="projectTranslation" type="checkbox" v-model="project.translation">
        <label for="checkbox">{{ project.translation ? "Project doesn't need translation" : "Project Needs Translation" }}</label>
      </div>

      <div class="small-12 column">
        <label>Deliverables: {{project.deliverables}}</label>
        <input v-model="project.deliverables" name="project[deliverables]" type="text">
      </div>

      <div class="small-12 column">
        <label>Asset Reference: {{project.asset_ref}}</label>
        <div class="input-group">
          <span class="input-group-label">http://</span>
          <input class="input-group-field" v-model="project.asset_ref" name="project[asset_refs]" type="text">
        </div>
      </div>
    </div>

    <MediaUploader :project-id="project.id" :mediaFiles="project.medias" :token="token"></MediaUploader>


    <hr>
    <div class="row">
      <div class="column">
        <div class="callout">
          <h3>Contact</h3>
          <contact
            :contact-id="project.contact_id"
            :project-id="project.id"
            :post-time="postTime"
            @contactEmit="updateContact"
          ></contact>
          <input type="hidden" v-model="project.contact_id" name="project[contact_id]">
        </div>
      </div>
    </div>

    <div class="row">
      <div class="column">
        <div class="callout">
          <h3>Assigned To</h3>
          <!-- TODO: editable if admin -->
          <!-- <UserFields :user="user"></UserFields> -->
          <input type="hidden" v-model="project.user_id" name="project[user_id]">
        </div>
      </div>
    </div>
    <span v-show="veeErrors.any()">Disable</span>
    <input type="submit" value="Submit" :disabled="veeErrors.any()" class="button expanded">

  </form>
</template>

<script>
import Axios from "axios"

// App Components
import bus from '../bus'
import FormMethods from "./components/form/formMethods.js"
import ProgressMixin from "./components/form/progressMixin.js"
import Status from "./components/form/status.vue"
import MediaUploader from "./components/form/mediaUploader.vue"
import Contact from "./components/form/contact.vue"
import UserFields from "./components/form/user.vue"

let token = document.getElementsByName('csrf-token')[0].getAttribute('content')
Axios.defaults.headers.common['X-CSRF-Token'] = token
Axios.defaults.headers.common['Accept'] = 'application/json'

export default {
  name: 'NewForm',
  props: ['message', 'reveal-type', 'flash', 'contact-session'],
  mixins: [FormMethods, ProgressMixin],
  components: {
    MediaUploader,
    Status,
    Contact,
    UserFields,
  },
  data() {
    return {
      loading: false,
      errors: [],
      formError: true,
      project: {
        id: null,
        title: null,
        slug: null,
        user_id: 1,
        contact_id: null,
        status: "",
        description: null,
        medias: [],
        tactic: [],
        due_date: null,
        existing: false,
        business_unit: null,
        target: null,
        flag: false,
        archive: false
      },
      tactic_other: '',
      available_tactics: [],
      postTime: '',
    }
  },
  computed: {
    token() {
      return document.getElementsByName('csrf-token')[0].getAttribute('content')
    },
    projectId() {
      // sets a projectId from the route params
      // This validates wether we need to get project data
      if (this.$route.params.id) {
        this.project.id = this.$route.params.id
        return this.$route.params.id
      } else {
        return null
      }
    },
    EmptyProject() {
      // we first want to create a object that is equal to our empty project
      var empty = {
        id: null,
        title: null,
        slug: null,
        user_id: 1,
        contact_id: null,
        status: "",
        description: null,
        medias: [],
        tactic: [],
        due_date: null,
        existing: false,
        business_unit: null,
        target: null,
        flag: false,
        archive: false
      };
      // If we find that there is a current ContactSession
      // Then we will change the empty project state to include
      // the contactSession id for contact_id
      if(this.contactSession != "") {
        empty.contact_id = this.contactSession
      }
      return empty
    },
  },
  watch: {
    '$route': 'fetchData',
    tactic_other(other) {
      this.setTactics(other)
    }
  },
  methods: {
    fetchData() {
      this.loading = true
      this.getProject()
    },
    getProject() {
      var vm = this
      if (this.$route.params.id) {
        Axios.get('/api/v1/projects/' + this.$route.params.id  + '.json')
          .then( response => {
            vm.loading = false
            vm.updateProject(response.data.project)
            vm.project.status = response.data.project.status
            console.log(vm.project.status)
            console.log(response.data.project.status)

            if(vm.contactSession && vm.project.contact_id == null) {
              vm.updateContact({id: vm.contactSession})
            }

            document.title = "Edit " + vm.project.title + " | Collateral Express"
          }).catch(error => {
            // project does not exist
            // Create a new project or browse the project list
            console.log(error)
          })
      }
      this.getTactics()
    },
    updateProject(project) {
      this.project = project
    },
    updateContact(contact) {
      this.project.contact_id = contact.id
    },

    setTactics(tactic) {
      var vm = this
      var tArray = this.project.tactic.filter(function(tactic) {
        //console.log(tactic)
        if (vm.available_tactics.includes(tactic)) return tactic
      })
      this.project.tactic = tArray
      this.project.tactic.push(tactic)
    },
    getTactics() {
      // Get Available tactics
      var vm = this
      Axios.get('/api/v1/projects/new.json')
        .then( response => {
          console.log(response.data.tactics)
          vm.available_tactics = response.data.tactics
        }).catch(error => {
          console.log(error)
        })
    }
  },
  created() {
    this.fetchData()
  },
  mounted() {
    //Listen on the bus for changers to the child components error bag and merge in/remove errors
    bus.$on('projectEmit', (project) => {
      this.updateProject(project)
    })
    bus.$on('projectPropSet', (key, val) => {
      this.$set(this.project, key, val)
    })

    bus.$on('mediaEmit', (media) => {
      console.log('media emit')
      this.project.medias = media
    })

    bus.$on('errors-changed', (errors) => {
      this.veeErrors.clear();
      this.$validator.validateAll();

      var errs = [...this.veeErrors.errors, ...errors.errors]
      var filtered = errs.filter((err, index, self) => self.findIndex((e) => {return e.field === err.field && e.msg === err.msg; }) === index)

      this.veeErrors.errors = filtered
    });
  },
  beforeRouteUpdate (to, from, next) {
    this.fetchData()
    next()
  },
  // beforeRouteEnter (to, from, next) {
  //     next(vm => {
  //       // before we get to the new route
  //       // lets see if there is a route param of :id
  //       if (!vm.$route.params.id) {
  //       //   console.log('param id present')
  //       //   // If it's there lets get that projects data
  //       //   vm.getProject()
  //       // } else {
  //       //   vm.getTactics()
  //         // If it's not then we are going to set the project data to an empty state
  //         bus.$emit('projectEmit');
  //       }
  //     })
  // },
  beforeRouteLeave (to, from, next) {
    // Before we leave the current view
    $('#reveal').foundation('close');
    bus.$emit('progressEmit', 0)
    next()
  }
}
</script>

<style scoped lang="scss">
#progressBar {
  position: fixed;
  top: 0;
}
</style>
