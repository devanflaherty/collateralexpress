<template>
  <div id="projectForm">
    <hr class="no-margin">
    <div id="formContainer" class="row expand">
      <LoadScreen v-if="loading"></LoadScreen>
      <div v-else id="formPanel" class="small-12 medium-9 columns">

        <div class="row">
          <div class="columns">
            <nav v-if="contactSession">
              <router-link class="button hollow" :to="{name: 'list'}">All Projects</router-link>
              <router-link class="button hollow" :to="{name: 'new'}">New</router-link>
            </nav>
            <h3>{{$route.meta.title}}</h3>
            <hr class="no-margin">
          </div>
        </div>

        <nav id="projectnav" v-if="project.id" class="flex" style="justify-content: space-between">
          <div class="navigation-actions">
            <router-link :to="{ name: 'show', params: { id: project.id} }">Show</router-link>
          </div>
          <a
            id="deleteProject"
            @click="deletePrompt">
            <icon name="trash"></icon>
            Delete
          </a>
        </nav>

        <form v-on:submit.prevent="onSubmit" id="form">
          <vue-progress-bar id="progressBar"></vue-progress-bar>

          <!-- only show if admin logged in -->
          <!-- <Status :projectStatus="project.status" :projectFlag="project.flag" :projectArchive="project.archive"></Status> -->
          <div class="row">
            <div class="columns float-input">
              <FloatLabel :attr="project.title" label="Project Title" propKey="title"></FloatLabel>
            </div>
          </div>

          <div class="row">
            <div class="column float-input">
              <FloatLabel :attr="project.description" label="Project Description" propKey="description" inputType='textarea'></FloatLabel>
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
              <!-- <br>
              <span>Selected Tactics: {{ project.tactic }}</span> -->
            </div>
          </div>

          <div class="row">
            <div class="small-12 column">
              <h3>Who is this for?</h3>
            </div>

            <div class="small-12 column float-input">
              <FloatLabel :attr="project.business_unit" label="Business Unit" propKey="business_unit"></FloatLabel>
            </div>

            <div class="small-12 column float-input">
              <FloatLabel :attr="project.target" label="Target Audience" propKey="target"></FloatLabel>
            </div>

            <div class="small-12 column">
              <label for="projectExists">
                <input style="display:none" id="projectExists" type="checkbox" v-model="project.existing">
                <icon v-if="project.existing" name="check-circle-o"></icon>
                <icon v-else name="circle-o"></icon>
                <span>{{ project.existing ? "Existing Project" : "New Project" }}</span>
              </label>
            </div>
          </div>

          <div class="row">
            <div class="small-12 column">
              <h3>Project Details</h3>
            </div>

            <div class="small-12 column float-input">
              <FloatLabel :attr="project.due_date" label="Due Date" propKey="due_date"></FloatLabel>
            </div>

            <div class="small-12 column">
              <label for="projectTranslation">
                <input style="display:none" id="projectTranslation" type="checkbox" v-model="project.translation">
                <icon v-if="project.translation" name="check-circle-o"></icon>
                <icon v-else name="circle-o"></icon>
                <span>{{ project.translation ? "Project Needs Translation" : "Project doesn't need translation" }}</span>
              </label>
            </div>

            <div class="small-12 column float-input">
              <FloatLabel :attr="project.deliverables" label="Deliverables" propKey="deliverables"></FloatLabel>
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
      </div><!-- close column-->

      <div id="infoPanel" class="columns"></div>

    </div><!--close form container-->
    <hr class="no-margin">
  </div><!-- close projectForm -->
</template>

<script>
import Axios from "axios"
import bus from '../bus'

// App Components
import FloatLabel from "./components/form/floatLabel.vue"
import Float from "./components/form/float.vue"
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
    FloatLabel,
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
        translation: false,
        business_unit: null,
        deliverables: null,
        target: null,
        flag: false,
        archive: false
      },
      tactic_other: '',
      available_tactics: [],
      dzUpload: false,
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
        deliverables: null,
        target: null,
        flag: false,
        archive: false
      };
      // If we find that there is a current ContactSession
      // Then we will change the empty project state to include
      // the contactSession id for contact_id
      if(this.contactSession != "") {
        console.log("empty")
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

            if(vm.contactSession && vm.project.contact_id == null) {
              vm.updateContact({id: vm.contactSession})
            }

            document.title = "Edit " + vm.project.title + " | Collateral Express"
          }).catch(error => {
            // project does not exist
            // Create a new project or browse the project list
            console.log(error)
          })
      } else {
        vm.loading = false
        bus.$emit('emptyFloats')
        bus.$emit('projectEmit', this.EmptyProject)
        if(vm.contactSession) {
          vm.updateContact({id: vm.contactSession})
        }
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
          vm.available_tactics = response.data.tactics
        }).catch(error => {
          console.log(error)
        })
    },
  },
  created() {
    this.fetchData()
  },
  mounted() {
    var vm = this
    //Listen on the bus for changers to the child components error bag and merge in/remove errors
    bus.$on('projectEmit', (project) => {
      this.updateProject(project)
    })
    bus.$on('projectPropSet', (key, val) => {
      this.$set(vm.project, key, val)
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
#formContainer {
  //height: 100vh;
  #infoPanel {
    background-image: linear-gradient(-180deg, #EB0183 0%, #FF3068 100%);
  }
  #formPanel {
    //height: 100vh;
    overflow-y: scroll;
  }
}

// TRANSITION ANIMATIONS
input {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
</style>
