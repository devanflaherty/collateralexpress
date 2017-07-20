<template>
  <div id="projectForm">
    <hr class="no-margin">
    <LoadScreen v-if="loading"></LoadScreen>
    <form v-else v-on:submit.prevent="onSubmit" id="form">
      <div id="formContainer" class="row expand align-center">
        <div class="form-panel small-12 columns" :class="{'medium-9 large-6': project.id, 'medium-12 large-9': !project.id}">

          <header>
            <div class="row">
              <div class="columns">
                <h2>{{page_title}}</h2>
                <h5 v-if="project.id">{{project.title}}</h5>
                <hr class="no-margin">
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
              </div>
            </div>
          </div>

          <div class="row">
            <div class="column">

              <div class="fieldset">
                <h3>Project Details</h3>
                <hr class="no-margin">
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

                <h5 style="margin-top: 1rem">Tactics</h5>
                <div class="row small-up-2 medium-up-3">
                  <div class="column" v-for="tactic in available_tactics" v-bind:key="tactic" >
                    <input type="checkbox" :id="tactic" :value="tactic" v-model="project.tactic">
                    <label :for="tactic">
                      {{tactic}}
                    </label>
                  </div>
                </div>
                <span v-for="tactic in project.tactic">{{tactic}}</span>
                <!-- other field-->
                <div class="row" v-if="project.tactic.includes('Other')">
                  <div class="columns small-6">
                    <div class="float-input">
                      <FloatLabel label="Other" propKey="tactic_other" @updateOther="setTactics" validation=""></FloatLabel>
                    </div>
                  </div>
                </div>

                <div class="check-input">
                  <h5>Does this project already exist?</h5>
                  <label for="projectExists">
                    <input style="display:none" id="projectExists" type="checkbox" v-model="project.existing">
                    <icon v-if="project.existing" name="check-circle-o"></icon>
                    <icon v-else name="circle-o"></icon>
                    <span>{{ project.existing ? "Yes, this project exists." : "No, this is a new project." }}</span>
                  </label>
                </div>

                <div class="check-input">
                  <h5>Does this project need translation?</h5>
                  <label for="projectTranslation">
                    <input style="display:none" id="projectTranslation" type="checkbox" v-model="project.translation">
                    <icon v-if="project.translation" name="check-circle-o"></icon>
                    <icon v-else name="circle-o"></icon>
                    <span>{{ project.translation ? "Project Needs Translation" : "Project doesn't need translation" }}</span>
                  </label>
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
              </div>

            </div>
          </div>

          <div class="row">
            <div class="small-12 column">
              <div class="fieldset">
                <h3>Who is this for?</h3>

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
          <a
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
            <div class="small-12 large-9 column">
              <MediaUploader :project-id="project.id" :mediaFiles="project_media" :token="token"></MediaUploader>
            </div>
          </div>

          <div class="row align-center" id="contactForm">
            <div class="small-12 large-9 column">
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
            <div class="small-12 large-9 columns">
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
  </div><!-- close projectForm -->
</template>

<script>
import Axios from "axios"
import bus from '../bus'

// App Mixins
import { onValidation } from "../shared/validation"
import FormMethods from "./components/form/formMethods.js"
import ProgressMixin from "./components/form/progressMixin.js"
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
    }
  },
  methods: {
    fetchData() {
      this.loading = true
      this.getProject()
    },
    getProject() {
      var vm = this
      if (vm.$route.params.id) {
        // Project exists
        Axios.get('/api/v1/projects/' + vm.$route.params.id  + '.json')
          .then( response => {
            if(vm.auth == null && vm.contactSession != response.data.project.contact_id) {
              vm.$router.push({ name: 'list' })
              bus.$emit('showReveal', 'notice', "Not Authorized", "Sorry, you don't have access to that project.")
            } else {
              vm.page_title = response.data.project.id
              vm.loading = false
              vm.project = response.data.project
              vm.contactQuery = response.data.project.contact_id
              vm.project_media = response.data.project_media

              document.title = "Edit " + vm.project.title + " | Collateral Express"
            }
          }).catch(error => {
            // project does not exist
            // Create a new project or browse the project list
            console.log(error)
          })
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
    var vm = this
    this.getTactics()

    this.contactQuery = this.contactSession

    //Listen on the bus for changers to the child components error bag and merge in/remove errors
    bus.$on('projectEmit', (project) => {
      this.updateProject(project)
    })

    bus.$on('projectPropSet', (key, val) => {
      this.$set(vm.project, key, val)
      //this.$validator.validateAll();
    })

    bus.$on('readyDz', () => {
      this.dzUpload(true)
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
  //height: 100vh;
  // #infoPanel {
  //   background-image: linear-gradient(-180deg, #EB0183 0%, #FF3068 100%);
  // }
  .formPanel {
    //height: 100vh;
    overflow-y: scroll;
  }
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
