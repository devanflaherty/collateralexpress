<template>
  <div>
    <hr class="no-margin">

    <div id="projectForm" v-if="$route.name == 'new' || $route.params.id != null && validUser">
      <LoadScreen v-if="loading"></LoadScreen>

      <section id="projectSelector" class="pad-small gradient-bg" :class="{'minimize' : projectType}">
        <div class="text-center">
          <h2>{{pageTitle}}</h2>
          <p v-if="!projectType" class="text-center">Select one of the options below to get started.</p>
        </div>

        <div v-if="$route.name == 'new'" class="select-cards row align-center align-middle" style="margin-bottom: 1rem;">
          <div class="select-col text-center">
            <a href="#" @click.prevent="showForm('existing')" class="card space-between" :class="{'active-project-type' : projectType == 'existing'}">
              <div class="select-image">
                <img src="/assets/icons/modify.png" >
              </div>
              <div v-if="!projectType">
                <h4>Modify Existing Asset</h4>
                <p>
                  Share with us the existing asset and we'll make your requested modifications.
                </p>
              </div>
            </a>
            <span v-if="projectType">Existing</span>
          </div>

          <div class="select-col text-center">
            <a href="#" @click.prevent="showForm('template')" class="card space-between" :class="{'active-project-type' : projectType == 'template'}">
              <div class="select-image">
                <img src="/assets/icons/template.png" >
              </div>
              <div v-if="!projectType">
                <h4>Create from Template</h4>
                <p>Fill us in on the details and choose from a template.</p>
              </div>
            </a>
            <span v-if="projectType">Template</span>
          </div>
        </div>
      </section>

      <!-- TEMPLATE FORM -->
      <section id="templateForm" v-if="projectType == 'template'">
        <form v-on:submit.prevent="onSubmit" id="form">
          <div id="formContainer" class="row expand align-center">
            <div class="form-panel small-12 columns" :class="{'medium-8 large-7': $route.name == 'edit', 'medium-10 large-10': $route.name == 'new' }">
              <header v-if="project && project.id" class="row">
                <div class="columns">
                  <h5>{{project.title}}</h5>
                </div>
              </header>

              <!-- <Status :projectStatus="project.status" :projectFlag="project.flag" :projectArchive="project.archive"></Status> -->
              <div class="row">
                <div class="columns">
                  <div class="fieldset">
                    <h3 style="margin-top:2rem;">Project Details</h3>

                    <div class="float-input">
                      <FloatLabel
                        v-model="project.title"
                        v-validate="'required'"
                        data-vv-name="Project Title"
                        :has-error="veeErrors.has('Project Title')"
                        :error-text="veeErrors.first('Project Title')"
                        label="*Project Title"></FloatLabel>
                    </div>

                    <div class="float-input">
                      <FloatLabel
                        v-model="project.description"
                        v-validate="'required'"
                        data-vv-name="Project Description"
                        :has-error="veeErrors.has('Project Description')"
                        :error-text="veeErrors.first('Project Description')"
                        label="*Project Description"
                        inputType='textarea'></FloatLabel>
                    </div>

                    <div class="row">
                      <div class="columns small-12 medium-9 large-6">
                        <div class="float-input">
                          <label>*Due Date</label>
                            <Datepicker
                              :calendar-button="true"
                              :calendar-button-icon="'fa fa-calendar'"
                              :monday-first="true"
                              placeholder="04 July, 2017"
                              v-model="project.due_date"
                              name="due_date"
                              v-validate="'required'"
                              data-vv-as="Due Date">
                            </Datepicker>
                            <span v-show="veeErrors.has('due_date') && this.fields.due_date.touched" class="error-message">{{veeErrors.first('due_date')}}</span>
                        </div>
                      </div>
                      <div class="columns">
                        <div class="float-input">
                          <label>Deliverables</label>
                          <select v-model="project.deliverables">
                            <option disabled value="0">Select the amount</option>
                            <option v-for="n in 10">{{n}}</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div class="tactics">
                      <h5 style="margin-top: 1rem">Tactics</h5>

                      <div class="row small-up-2 large-up-3">
                        <div class="column" v-for="tactic in availableTactics" v-bind:key="tactic" >
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
                            <FloatLabel
                              v-model="other"
                              data-vv-name="other"
                              label="Other"
                              @updateOther="setTactics"></FloatLabel>
                          </div>
                        </div>
                      </div>
                      <!-- close other field -->
                    </div>

                    <div class="toggle-inputs">
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
                        v-model="project.reference"
                        v-validate="'url'"
                        data-vv-name="Asset Reference"
                        :has-error="veeErrors.has('Asset Reference')"
                        :error-text="veeErrors.first('Asset Reference')"
                        label="Asset Reference"></FloatLabel>
                      <p class="hint">http://tmap.com/link/to/asset</p>
                    </div>

                    <h3 style="margin-top:2rem;">Who is this for?</h3>

                    <div class="float-input">
                      <FloatLabel
                        v-model="project.business_unit"
                        v-validate=""
                        data-vv-name="Business Unit"
                        :has-error="veeErrors.has('Business Unit')"
                        :error-text="veeErrors.first('Business Unit')"
                        label="Business Unit"></FloatLabel>
                    </div>

                    <div class="float-input">
                      <FloatLabel
                        v-model="project.target"
                        v-validate=""
                        data-vv-name="Target Audience"
                        :has-error="veeErrors.has('Target Audience')"
                        :error-text="veeErrors.first('Target Audience')"
                        label="Target Audience"></FloatLabel>
                    </div>
                  </div>

                </div>
              </div>
            </div><!-- form panel part 1 -->

            <div v-if="$route.params.id" id="infoPanel" class="small-12 medium-8 large-3 columns show-for-medium">
              <aside id="projectSidebar">
                <nav v-if="$auth.check()">
                  <router-link class="button expanded" :to="{ name: 'show', params: { id: $route.params.id} }">View Project</router-link>
                  <router-link class="button hollow expanded" :to="{name: 'list'}">All Projects</router-link>
                  <router-link class="button hollow secondary expanded" :to="{name: 'new'}">Add New Project</router-link>
                </nav>
              </aside>
              <a v-if="project && project.id"
                id="deleteProject"
                style="float: right"
                class="delete-project"
                @click="deletePrompt(project.id)">
                <icon name="trash"></icon>
                Delete
              </a>
            </div><!-- close sidebar -->

            <div class="form-panel small-12 columns" style="padding: 0;">
              <div id="fileUploader" class="row align-center">
                <div class="small-12 large-10 column">
                  <MediaUploader :project-id="project.id" :token="token"></MediaUploader>
                </div>
              </div>

              <div class="row align-center" id="contactForm">
                <div class="small-12 large-10 column">
                  <div class="fieldset">
                    <contact
                      :contact-query="contactQuery"
                      :project-id="project.id"
                      @contactEmit="updateContact"
                    ></contact>
                  </div>
                </div>
              </div>

              <div class="row align-center">
                <div class="small-12 large-10 columns">
                  <div class="fieldset">
                    <div class="callout" v-show="veeErrors.any()">
                      <p>Please make sure all 'required' fields have been filled out and there are no errors.</p>
                      <ul class="error-list">
                        <li v-for="err in veeErrors.errors">
                          <span class="error-message">{{veeErrors.first(err.field)}}</span>
                        </li>
                      </ul>

                    </div>
                    <input type="submit" value="Submit" :disabled="veeErrors.any()" class="button gradient expanded">
                  </div>
                </div>
              </div>

            </div><!-- close column-->
          </div><!--close form container-->
        </form>
        <hr class="no-margin">
      </section>
      <!-- CLOSE TEMPLATE FORM -->
    </div>
    <!-- CLOSE PROJET FORM -->

    <div id="login" v-if="!loading && !validUser && $route.name == 'edit'">
      <Login :project-user="project.contact_id"></Login>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import bus from '../../bus'

import Datepicker from 'vuejs-datepicker';

// App Mixins
import ProjectSubmission from "./mixins/projectSubmission.js"
import DeleteProject from "./mixins/deleteProject.js"
import ProgressMixin from "./mixins/progressMixin.js"
import { onValidation } from "../shared/validation"

//Form Components
import Login from "../shared/login/index.vue"
import FloatLabel from "../shared/floatLabel.vue"
import Status from "./components/form/status.vue"
import MediaUploader from "./components/form/mediaUploader.vue"
import Contact from "./components/form/contact.vue"
import UserFields from "./components/form/user.vue"

export default {
  name: 'NewForm',
  metaInfo() {
    return {
      title: this.pageTitle
    }
  },
  mixins: [ProjectSubmission, DeleteProject, ProgressMixin, onValidation],
  components: {
    Login,
    FloatLabel,
    Datepicker,
    MediaUploader,
    Status,
    Contact,
    UserFields,
  },
  data() {
    return {
      loading: false,
      pageTitle: '',
      projectType: null,
      formError: true,
      contactQuery: null,
      tactic_other: '',
      dzUpload: false,
    }
  },
  computed: {
    ...mapGetters({
      authUser: 'authUser',
      contactSession: 'contactSession',
      validUser: 'validUser',
      project: 'project',
      projectMedia: 'projectMedia',
      availableTactics: 'availableTactics',
    }),
    token() {
      return document.getElementsByName('csrf-token')[0].getAttribute('content')
    },
    formTouched() {
      return Object.keys(this.fields).filter(key => this.fields[key].touched);
    }
  },
  watch: {
    '$route': function() {
      // Watch if route changers
      // If it does we are going to re-fetch the data
      this.fetchData()
    },
    tactic_other(other) {
      // When the other_input field has been updated
      // Run the setTactics Method passing in the other_input's value
      this.setTactics(other)
    },
    'project.contact_id': function(id) {
      // When the project.contact_id is updated
      // (for example when we fetch data)
      // We will run the validateUser Method
      // checking the projects ID against the session ID
      // If validation fails we don't show them the page
      this.$store.dispatch('checkValidUser', id)
    },
    'authUser.id':function() {
      // If we get an authUser fetchData
      this.fetchData()
    },
    contactSession(id) {
      // Generally will only run on a few instances
      // First time vue instance is being loaded & First time a contactUser is logging in
      this.contactQuery = id
    }
  },
  methods: {
    isTouched(key) {
      return this.fields[key].touched ? true : false
    },
    fetchData() {
      this.loading = true
      this.$Progress.start()
      if(this.$route.name == "edit") {
        this.axios.get('/api/v1/projects/' + this.$route.params.id  + '.json').then( response => {
          this.$Progress.finish()
          this.setData(response.data)
        }).catch(error => {
          this.$Progress.fail()
          this.setData(response.data, error)
        })
      } else {
        this.axios.get('/api/v1/projects/new.json').then( response => {
          this.$Progress.finish()
          this.setNewData(response.data)
        }).catch(error => {
          this.$Progress.fail()
          this.setNewData(response.data, error)
        })
      }
    },

    showForm(type) {
      if(type == "existing") {
        this.projectType = "existing";
        this.$store.dispatch({
          type: 'setProjectProperty',
          project: { existing: 1 }
        })
      } else if(type == "template") {
        this.projectType = "template";
        this.$store.dispatch({
          type: 'setProjectProperty',
          project: { existing: 0 }
        })
      }
    },

    setData(data, err) {
      // if we have an ID param
      if(this.$auth.check() && !err) {
        // if there is an authUser
        // We make a request with the ID Param
        this.loading = false
        if(this.$auth.check('contact') && this.authUser.id != data.project.contact_id) {
          // If the contact id is not equal to what is returned
          this.$store.dispatch({
            type: 'setReveal',
            reveal_type: 'notice',
            title: "Not Authorized",
            msg: "Sorry, you don't have access to this project. Please try logging in again.",
          })
        } else {
          // If contactSession is valid or is authorized
          this.$validator.clean();
          this.$store.dispatch('setProject', data.project)
          this.$store.dispatch('setProjectMedia', data.project_media.medias)
          // This will update the contactQuery generally third overRiding the contactQuery saved in the mounted() hook
          // That way we are getting the project.contact rather than contactSession
          this.contactQuery = data.project.contact_id
          this.pageTitle = "Edit " + data.project.title
          this.projectType = data.project.existing ? "existing" : "template"
        }
      } else if (this.$auth.check() && err) {
        this.loading = false
        this.$router.push({ name: 'new' })
        console.log(err)
      } else if (!this.$auth.check() && !err) {
        this.loading = false
        this.pageTitle = data.project.title
      } else {
        this.loading = false
        this.$store.dispatch({
          type: 'setFlash',
          title: "We couldn/'t get your project.",
          group: 'app'
        })
        this.$router.push({ name: 'new' })
        console.log(err)
      }
    },

    setNewData(data, err) {
      if(!err) {
        bus.$emit('emptyFloats')
        this.pageTitle = "New Project"
        this.projectType = null
        this.loading = false

        this.$store.dispatch('setMessage','New Project')
        this.$store.dispatch('setProject', data.project)
        this.$store.dispatch('setProjectMedia', [])
        this.$validator.clean();
      } else {
        this.$router.push({ name: '404' })
        console.log(err)
      }
    },

    updateContact(contact) {
      // Called from contactEmit
      // When the contact component finds an existing contact, or
      // There is a new contact we will update the project with that contact
      // Will either be null or the contacts ID
      this.$store.dispatch({
        type: 'setProjectProperty',
        set: ['contact_id', contact.id]
      })
      // This would be the last time(s) the contactQuery is set in it's life span
      // It inherits the ID found in the contact Component
      this.contactQuery = contact.id
    },
    setTactics(tactic) {
      this.$store.dispatch('pushTactic', tactic)
    }
  },
  created() {
    this.pageTitle = this.$route.meta.title
    this.fetchData()
  },
  mounted() {
    // We set contactQuery to contactSession
    // This will set contactQuery first before any other method
    // Allowing our contact component to default load the contactSession
    if(this.contactSession) {
      this.contactQuery = this.contactSession
    }
    // We grab the tactics
    this.$store.dispatch('setAvailableTactics')

    bus.$on('readyDZ', (bool) => {
      // Sets wether Dropzone should upload files or not
      this.dzUpload = bool
    })
  },
  beforeRouteLeave (to, from, next) {
    // Before we leave the current page
    bus.$emit('progressEmit', 0)
    next()
  },
}
</script>

<style lang="scss">
@import '../../../../assets/stylesheets/util/colors';

.vdp-datepicker {
  .vdp-datepicker__calendar {
    min-width: 300px;
    width: 100%!important;
    border: none;
    box-shadow: 0 3px 6px rgba(0,0,0,0.06), 0 3px 6px rgba(0,0,0,0.1);
    padding: 1rem 1rem 1rem;
  }
  .vdp-datepicker__calendar-button {
    position: absolute;
    right: 0;
    bottom: .5rem;
  }
  header {
    .up, .prev, .next {
      border-radius: 3px;
      transition: all 0.25s ease;
    }
  }
  .cell {
    border-radius: 3px;
    transition: all 0.25s ease;
    &:hover {
      border-color: $primaryColor!important;
    }
    &.selected {
      background: $primaryColor;
      color: #fff;
      font-family: Tele-Ult;
    }
  }
}
#formContainer {
  #projectSidebar {
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

  .error-list {
    list-style-type: none;
    margin: 0;
    padding: 0;
    .error-message {
      border-radius: 3px;
      margin-bottom: .25rem;
    }
  }
}

// TRANSITION ANIMATIONS
input {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
</style>
