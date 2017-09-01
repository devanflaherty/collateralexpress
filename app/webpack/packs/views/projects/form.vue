<template>
  <div>
    <hr class="no-margin">

    <div id="projectForm" v-if="$route.name == 'new' || $route.params.id != null && validUser">
      <LoadScreen v-if="loading"></LoadScreen>

      <projectSelector v-if="$route.name == 'new'" :projectType="projectType" :pageTitle="pageTitle" @typeEmit="setProjectType"></projectSelector>

      <!-- TEMPLATE FORM -->
      <form v-on:submit.prevent="onSubmit" id="form">
        <section id="formContainer" class="row expand align-center">
          <header v-if="project && project.id" class="form-panel small-12 medium-12 large-10 columns">
            <div class="fieldset" style="padding-bottom:0;">
              <h2 class="banner">{{project.title}}</h2>
            </div>
          </header>
<!-- EXISTING FORM -->
          <template v-if="$route.query.type == 'existing' || projectType == 'existing'">
            <div v-if="$route.name != 'edit'" class="form-panel small-12 medium-12 large-10 columns">
              <div class="fieldset" style="margin-top:2rem;">
                <h2>Modify an Existing Project</h2>
                <h5>For when you just need simple updates made to already existing material.</h5>
                <p>Simply share with us the file you need modified and tell us a bit about what you need done.</p>
                <p>We'll handle the rest!</p>
              </div>
            </div>

            <div class="form-panel small-12 columns" style="padding: 0;">
              <div id="fileUploader" class="row align-center">
                <div class="small-12 large-10 column">
                  <MediaUploader :project-id="project.id" :token="token"></MediaUploader>
                </div>
              </div>
            </div><!-- close form panel 2-->

            <div class="form-panel small-12 medium-12 large-10 columns">
              <div class="fieldset">
                <ProjectDetails></ProjectDetails>
                <ProjectTactics></ProjectTactics>
                <ProjectDemo></ProjectDemo>
              </div>
            </div><!-- form panel part 1 -->
          </template>
<!-- TEMPLATE FORM -->
          <template v-if="$route.query.type == 'template' || projectType == 'template'">
            <div v-if="$route.name != 'edit'" class="form-panel small-12 medium-12 large-10 columns">
              <div class="fieldset" style="margin-top:2rem;">
                <h2>Create From a Template</h2>
                <h5>For when you need new material created from a pre-made template.</h5>
                <p>Tell us about your project and we'll select the correct template to create your project from.</p>
              </div>
            </div>

            <div v-if="$route.name != 'edit'" class="columns small-12" style="padding: 0px">
              <hr class="no-margin"/>
            </div>

            <div class="form-panel small-12 medium-12 large-10 columns">

              <div class="fieldset">
                <ProjectDetails></ProjectDetails>
                <ProjectTactics></ProjectTactics>
                <ProjectDemo></ProjectDemo>
              </div>

            </div><!-- form panel part 1 -->

            <div class="form-panel small-12 columns" style="padding: 0;">
              <div id="fileUploader" class="row align-center">
                <div class="small-12 large-10 column">
                  <MediaUploader :project-id="project.id" :token="token"></MediaUploader>
                </div>
              </div>
            </div><!-- close form panel 2-->
          </template>

          <div class="form-panel small-12 columns" v-if="projectType">
            <div class="row align-center" id="contactForm">
              <div class="small-12 large-10 column">
                <div class="fieldset">
                  <contact @contactEmit="updateContact"></contact>
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
          </div><!-- close form panel 3 -->
        </section><!-- close formContainer-->
        <hr class="no-margin">
      </form>
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

// App Mixins
import ProjectSubmission from "./mixins/projectSubmission.js"
import DeleteProject from "./mixins/deleteProject.js"
import ProgressMixin from "./mixins/progressMixin.js"
import { onValidation } from "../shared/validation"

//Form Components
import ProjectSelector from "./components/projectSelector.vue"
import Login from "../shared/login/index.vue"
import MediaUploader from "./components/mediaUploader.vue"
import ProjectDetails from "./components/details.vue"
import ProjectTactics from "./components/tactics.vue"
import ProjectDemo from "./components/demo.vue"

import Contact from "./components/contact.vue"

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
    ProjectSelector,
    MediaUploader,
    ProjectDetails,
    ProjectTactics,
    ProjectDemo,
    Contact
  },
  data() {
    return {
      loading: false,
      pageTitle: '',
      projectType: null,
      formError: true,
      dzUpload: false,
    }
  },
  computed: {
    ...mapGetters({
      authUser: 'authUser',
      validUser: 'validUser',
      project: 'project',
      projectMedia: 'projectMedia',
    }),
    token() {
      return document.getElementsByName('csrf-token')[0].getAttribute('content')
    },
    formTouched() {
      return Object.keys(this.fields).filter(key => this.fields[key].touched);
    }
  },
  watch: {
    '$route': function(to, from) {
      // Watch if route changers
      // If it does we are going to re-fetch the data
      if(from.name != 'new') {
        this.fetchData()
      }

      if(this.$route.query.type) {
        this.projectType = this.$route.query.type
      } else {
        this.projectType = null
      }
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
          // If user is valid or is authorized
          this.$validator.clean();
          this.$store.dispatch('setProject', data.project)
          this.$store.dispatch('setProjectMedia', data.project_media.medias)
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
        this.loading = false

        this.$store.dispatch('setMessage','New Project')
        this.$store.dispatch('setProject', data.project)

        if(this.$route.query.type == "existing") {
          this.$store.dispatch({
            type: 'setProjectProperty',
            project: { existing: true }
          })
        }

        this.$store.dispatch('setProjectMedia', [])
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
    },

    setProjectType(type) {
      this.projectType = type
    }
  },
  created() {
    this.pageTitle = this.$route.meta.title
    this.fetchData()
    if(this.$route.name == 'new') {
      if(this.$route.query.type == null || this.$route.query.type == "") {
        this.projectType = null
      }
    }
  },
  mounted() {
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

.fade-enter-active, .fade-leave-active {
  transition: opacity 1s ease;
}
.fade-enter, .fade-leave-to
/* .component-fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

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
