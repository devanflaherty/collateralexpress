<template>
  <div>
    <section id="projectForm" v-if="$route.name == 'new' || $route.params.id != null && validUser == true">
      <hr class="no-margin">
      <LoadScreen v-if="loading"></LoadScreen>
      <form v-else v-on:submit.prevent="onSubmit" id="form">
        <div id="formContainer" class="row expand align-center">
          <div class="form-panel small-12 columns" :class="{'medium-10 large-7': project.id, 'medium-12 large-10': !validUser, 'medium-10 large-7': validUser }">

            <header>
              <div class="row">
                <div class="columns">
                  <h2>{{page_title}}</h2>
                  <h5 v-if="project.id">{{project.title}}</h5>
                </div>
              </div>
            </header>

            <vue-progress-bar id="progressBar"></vue-progress-bar>

            <!-- <Status :projectStatus="project.status" :projectFlag="project.flag" :projectArchive="project.archive"></Status> -->
            <div class="row">
              <div class="columns">
                <div class="fieldset">
                  <div class="float-input">
                    <FloatLabel
                      v-validate="'required'"
                      data-vv-value-path="model"
                      data-vv-name="Project Title"
                      :has-error="veeErrors.has('Project Title')"
                      :error-text="veeErrors.first('Project Title')"
                      :attr="project.title"
                      label="Project Title"
                      propKey="title"></FloatLabel>
                  </div>

                  <div class="float-input">
                    <FloatLabel
                      v-validate="'required'"
                      data-vv-value-path="model"
                      data-vv-name="Project Description"
                      :has-error="veeErrors.has('Project Description')"
                      :error-text="veeErrors.first('Project Description')"
                      :attr="project.description"
                      label="Project Description"
                      propKey="description"
                      inputType='textarea'></FloatLabel>
                  </div>

                  <h3 style="margin-top:2rem;">Project Details</h3>
                  <div class="float-input">
                    <FloatLabel
                      v-validate="'required'"
                      data-vv-value-path="model"
                      data-vv-name="Due Date"
                      :has-error="veeErrors.has('Due Date')"
                      :error-text="veeErrors.first('Due Date')"
                      :attr="project.due_date"
                      label="Due Date"
                      propKey="due_date"></FloatLabel>
                  </div>

                  <div class="tactics">
                    <h5 style="margin-top: 1rem">Tactics</h5>

                    <div class="row small-up-2 medium-up-3">
                      <div class="column" v-for="tactic in available_tactics" v-bind:key="tactic" >
                        <input type="checkbox" :id="tactic" :value="tactic" v-model="project.tactic">
                        <label :for="tactic">
                          {{tactic}}
                        </label>
                      </div>
                    </div>

                    <!-- other field-->
                    <div class="row" v-if="project.tactic.includes('Other')">
                      <div class="columns small-6">
                        <div class="float-input">
                          <FloatLabel label="Other" propKey="tactic_other" @updateOther="setTactics" validation=""></FloatLabel>
                        </div>
                      </div>
                    </div>
                    <!-- close other field -->
                  </div>

                  <div class="toggle-inputs">
                    <div class="check-input">
                      <h5>Does this project already exist?</h5>
                      <label for="projectExists">
                        <input style="display:none" id="projectExists" type="checkbox" v-model="project.existing">
                        <div v-if="project.existing" class="checked checked-true">
                          <icon name="check"></icon>
                        </div>
                        <div v-else class="checked">
                          <icon name="circle-thin"></icon>
                        </div>
                        <span>{{ project.existing ? "Yes, this project exists." : "No, this is a new project." }}</span>
                      </label>
                    </div>
                    <div class="check-input">
                      <h5>Does this project need translation?</h5>
                      <label for="projectTranslation">
                        <input style="display:none" id="projectTranslation" type="checkbox" v-model="project.translation">
                        <div v-if="project.translation" class="checked checked-true">
                          <icon name="check"></icon>
                        </div>
                        <div v-else class="checked">
                          <icon name="circle-thin"></icon>
                        </div>
                        <span>{{ project.translation ? "Project Needs Translation" : "Project doesn't need translation" }}</span>
                      </label>
                    </div>
                  </div>

                  <div class="float-input">
                    <FloatLabel
                      v-validate="'numeric'"
                      data-vv-value-path="model"
                      data-vv-name="Deliverables"
                      :has-error="veeErrors.has('Deliverables')"
                      :error-text="veeErrors.first('Deliverables')"
                      :attr="project.deliverables"
                      label="Deliverables"
                      propKey="deliverables"></FloatLabel>
                  </div>

                  <div class="float-input">
                    <FloatLabel
                      v-validate="'url'"
                      data-vv-value-path="model"
                      data-vv-name="Asset Reference"
                      :has-error="veeErrors.has('Asset Reference')"
                      :error-text="veeErrors.first('Asset Reference')"
                      :attr="project.reference"
                      label="Asset Reference"
                      propKey="reference"></FloatLabel>
                    <p class="hint">http://tmap.com/link/to/asset</p>
                  </div>

                  <h3 style="margin-top:2rem;">Who is this for?</h3>

                  <div class="float-input">
                    <FloatLabel
                      v-validate=""
                      data-vv-value-path="model"
                      data-vv-name="Business Unit"
                      :has-error="veeErrors.has('Business Unit')"
                      :error-text="veeErrors.first('Business Unit')"
                      :attr="project.business_unit"
                      label="Business Unit"
                      propKey="business_unit"></FloatLabel>
                  </div>

                  <div class="float-input">
                    <FloatLabel
                      v-validate=""
                      data-vv-value-path="model"
                      data-vv-name="Target Audience"
                      :has-error="veeErrors.has('Target Audience')"
                      :error-text="veeErrors.first('Target Audience')"
                      :attr="project.target"
                      label="Target Audience"
                      propKey="target"></FloatLabel>
                  </div>
                </div>

              </div>
            </div>
          </div><!-- form panel part 1 -->

          <div v-if="project.id || contactSession || auth" id="infoPanel" class="small-12 medium-3 columns">
            <aside>
              <nav id="projectnav" v-if="project.id" class="flex" style="justify-content: space-between">
                <router-link class="button expanded" :to="{ name: 'show', params: { id: project.id} }">View Project</router-link>
              </nav>
              <nav v-if="contactSession || auth">
                <router-link class="button hollow expanded" :to="{name: 'list'}">All Projects</router-link>
                <router-link v-if="project.id" class="button hollow secondary expanded" :to="{name: 'new'}">Add New Project</router-link>
                <a v-if="auth" href="/account/edit">Edit User Profile</a>
                <a v-else="!auth && contactSession" :href="'/contacts/' + contactSession + '/edit'">Edit Contact Profile</a>
              </nav>
            </aside>
            <a v-if="project.id"
              id="deleteProject"
              style="float: right"
              class="delete-project"
              @click="deletePrompt">
              <icon name="trash"></icon>
              Delete
            </a>
          </div><!-- close sidebar -->

          <div class="form-panel small-12 columns">
            <div id="fileUploader" class="row align-center">
              <div class="small-12 large-10 column">
                <MediaUploader :project-id="project.id" :mediaFiles="project_media" :token="token"></MediaUploader>
              </div>
            </div>

            <div class="row align-center" id="contactForm">
              <div class="small-12 large-10 column">
                <div class="fieldset">
                  <contact
                    :contact-query="contactQuery"
                    :project-id="project.id"
                    :contact-session="contactSession"
                    @contactEmit="updateContact"
                  ></contact>
                </div>
              </div>
            </div>

            <div class="row align-center">
              <div class="small-12 large-10 columns">
                <div class="fieldset">
                  <span v-show="veeErrors.any()">Make sure all required fields have filled out.</span>
                  <input type="submit" value="Submit" :disabled="veeErrors.any()" class="button gradient expanded">
                </div>
              </div>
            </div>

          </div><!-- close column-->
        </div><!--close form container-->
      </form>
      <hr class="no-margin">
    </section><!-- close projectForm -->

    <div id="login" v-if="!loading && validUser == false">
      <ContactLogin :project-user="project.contact_id"></ContactLogin>
    </div>
  </div>
</template>

<script>
import Axios from "axios"
import bus from '../bus'

// App Mixins
import { onValidation } from "../shared/validation"
import FormMethods from "./components/form/formMethods.js"
import ProgressMixin from "./components/form/progressMixin.js"
import ContactLogin from "../shared/contactLogin.vue"
//Form Components
import FloatLabel from "../shared/floatLabel.vue"
import Status from "./components/form/status.vue"
import MediaUploader from "./components/form/mediaUploader.vue"
import Contact from "./components/form/contact.vue"
import UserFields from "./components/form/user.vue"

let token = document.getElementsByName('csrf-token')[0].getAttribute('content')
Axios.defaults.headers.common['X-CSRF-Token'] = token
Axios.defaults.headers.common['Accept'] = 'application/json'

export default {
  name: 'NewForm',
  props: ['message', 'reveal-type', 'flash', 'contact-session', 'auth'],
  mixins: [FormMethods, ProgressMixin, onValidation],
  components: {
    ContactLogin,
    FloatLabel,
    MediaUploader,
    Status,
    Contact,
    UserFields,
  },
  data() {
    return {
      loading: false,
      validUser: false,
      formError: true,
      project: {
        id: null,
        title: null,
        slug: null,
        user_id: 1,
        contact_id: null,
        status: "",
        description: null,
        reference: null,
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
      project_media: [],
      contactQuery: null,
      tactic_other: '',
      available_tactics: [],
      dzUpload: false,
    }
  },
  computed: {
    token() {
      return document.getElementsByName('csrf-token')[0].getAttribute('content')
    },
    page_title() {
      return this.$route.meta.title
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
        reference: null,
        tactic: [],
        due_date: null,
        existing: false,
        translation: false,
        business_unit: null,
        deliverables: null,
        target: null,
        flag: false,
        archive: false
      };
      return empty
    },
  },
  watch: {
    '$route': function() {
      this.fetchData
      this.page_title = this.$route.meta.title
    },
    tactic_other(other) {
      this.setTactics(other)
    },
    'project.contact_id': function(id) {
      this.validateUser(this.contactSession)
    },
    contactSession(id) {
      this.validateUser(id)
      this.contactQuery = id
    },
    validUser(status) {
      if(this.validUser == true) {
        this.fetchData()
      }
    }
  },
  methods: {
    validateUser(id) {
      if(id == this.project.contact_id && id != null) {
        this.validUser = true
      }
    },
    fetchData() {
      this.loading = true
      this.getProject()
    },
    getProject() {
      var vm = this
      if (vm.$route.params.id) {
        // Project exists
        if(this.auth || this.contactSession) {
          // if there is an admin user authorized or if we find a contact Session
          // Let's make a request
          Axios.get('/api/v1/projects/' + vm.$route.params.id  + '.json').then( response => {
            if(vm.contactSession != response.data.project.contact_id && vm.auth == null) {
              bus.$emit('showReveal', 'notice', "Not Authorized", "Sorry, you don't have access to this project. Please try logging in again.")
            } else {
              vm.loading = false
              vm.validUser = true
              vm.project = response.data.project
              vm.contactQuery = response.data.project.contact_id
              vm.project_media = response.data.project_media.medias

              document.title = "Edit " + vm.project.title + " | Collateral Express"
            }
          }).catch(error => {
            // project does not exist
            // Create a new project or browse the project list
            vm.$router.push({ name: 'new' })
            console.log(error)
          })
        } else {
          // if no valid session is found
          // We will just grab some Ids so we can validate
          Axios.get('/api/v1/projects/' + vm.$route.params.id + '.json').then( response => {
            vm.loading = false
            vm.$set(vm.project, 'id', response.data.project.id)
            vm.$set(vm.project, 'title', response.data.project.title)
            vm.$set(vm.project, 'contact_id', response.data.project.contact_id)

            document.title = vm.project.title + " | Collateral Express"
          }).catch(error => {
            // Push to 404
            vm.$router.push({ name: 'new' })
            console.log(error)
          })
        } // close statement that check if authorized to any degree
      } else {
        //new project
        vm.loading = false
        bus.$emit('updateMessage', 'New Project')
        bus.$emit('emptyFloats')
        bus.$emit('projectEmit', vm.EmptyProject)
      }
    },
    updateProject(project) {
      this.project = project
    },
    updateContact(contact) {
      this.project.contact_id = contact.id
      this.contactQuery = contact.id
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
      console.log('get')
      Axios.get('/api/v1/projects/new.json')
        .then( response => {
          vm.available_tactics = response.data.tactics
        }).catch(error => {
          console.log(error)
        })
    }
  },
  mounted() {
    // When we first mount lets see if there is an admin
    // If so the user is valid and everything is great
    if(this.auth != null) {
      this.validUser = true
    }
    this.validateUser(this.contactSession)
    this.contactQuery = this.contactSession

    this.getTactics()

    //Listen on the bus for changers to the child components error bag and merge in/remove errors
    bus.$on('projectEmit', (project) => {
      this.updateProject(project)
    })

    bus.$on('projectPropSet', (key, val) => {
      this.$set(this.project, key, val)
      //this.$validator.validateAll();
    })

    bus.$on('readyDZ', (bool) => {
      console.log('ready')
      this.dzUpload = bool
    })

    bus.$on('mediaEmit', (media) => {
      console.log('media emit')
      this.project_media = media
    })
  },
  beforeRouteEnter (to,from,next) {
    next(vm => {
      vm.fetchData()
    })
  },
  beforeRouteUpdate (to, from, next) {
    this.fetchData()
    next()
  },
  beforeRouteLeave (to, from, next) {
    // Before we leave the current view
    bus.$emit('closeReveal')
    bus.$emit('progressEmit', 0)
    next()
  }
}
</script>

<style scoped lang="scss">
@import '../../../assets/stylesheets/util/colors';
#progressBar {
  position: fixed;
  top: 0;
}
#formContainer {
  aside {
    margin-top: 2rem;
    padding: 2rem;
    background: white;
    border-radius: 3px;
  }
  .delete-project {
    padding: 1rem;
    color: $alert;
    svg {
      padding-top: .25rem;
    }
  }
}

// TRANSITION ANIMATIONS
input {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
</style>
