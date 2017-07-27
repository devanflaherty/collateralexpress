<template>
  <div>
    <hr class="no-margin">
    <section id="projectShow" v-if="validUser == true">
      <LoadScreen v-if="loading"></LoadScreen>
      <div class="row expanded small-collapse" v-else>
        <!-- Project Info -->
        <div class="columns small-12 medium-8 large-9 pad-small">
          <div class="pad-in-small">
            <router-link v-if="project.id" class="" :to="{name: 'new'}">Add New Project</router-link>
          </div>

          <hr class="no-margin">

          <AdminUpdates v-if="auth" :project="project"></AdminUpdates>

          <div id="projectInfo" class="pad-small pad-in-small">
            <h2 class="banner" :class="{'black-banner':project.archive}">{{project.title}}</h2><br>
            <span class="tag flagged" v-if="project.flagged">Flagged</span>
            <span class="tag" :class="{open: project.status == 'open', complete: project.status == 'complete',alert: project.status == 'need info'}" v-if="project.status">{{project.status}}</span>
            <span v-if="project.existing" class="tag exists-tag-true">
              Existing Project
            </span>
            <span v-else class="exists-tag-false">
              new Project
            </span>

            <div class="dates" style="margin-top: 2rem;">
              <icon name="calendar"></icon>
              <span class="created-date">{{project.created_at}}</span>
              <icon name="arrow-right"></icon>
              <span class="due-date">{{project.due_date}}</span>
            </div>
          </div>

          <div class="description pad-default pad-in-small">
            <h3>Project Description</h3>
            {{project.description}}
          </div>

          <div class="legal pad-small pad-in-small" v-if="project.legal">
            <h3>Legal</h3>
            {{project.legal}}
          </div>

          <div class="files pad-small pad-in-small white-bg" v-if="project_media">
            <div class="row">
              <div class="columns">
                <h3>Files</h3>
              </div>
            </div>
            <ul id="fileList" class="row small-up-2 medium-up-3 large-up-4">
              <li class="column" v-for="media in project_media">

                <div class="card">
                  <div class="thumb-container" :style="{ 'background-image': 'url(' + media.file.thumb.url + ')' }">
                    <span class="filename" v-if="media.name">{{media.name}}</span>
                  </div>
                  <!-- <img :src="media.file.thumb.url"> -->
                  <a :href="media.file.url" class="button rounded">
                    <icon name="download"></icon> Download
                  </a>
                </div>
              </li>
            </ul>
          </div>

          <div id="deliveryInfo" class="pad-in-small">
            <!-- add comma breaker -->
            <div class="tactics pad-small" v-if="project.tactic">
              <h3>Tactics</h3>
              <span v-for="tactic in project.tactic" class="tag">{{tactic}}</span>
            </div>

            <div id="details" class="row pad-small expanded" style="margin-left: -0.625rem; margin-right: -0.625rem;">
              <div class="columns small-6 medium-4 large-3" v-if="project.deliverables">
                <h4>Deliverables</h4>
                <h6>{{project.deliverables}}</h6>
              </div>
              <div class="columns small-6 medium-4 large-3" v-if="project.target">
                <h4>Target Audience</h4>
                <h6>{{project.target}}</h6>
              </div>
              <div class="columns small-6 medium-4 large-3" v-if="project.business_unit">
                <h4>Business Unit</h4>
                <h6>{{project.business_unit}}</h6>
              </div>
              <div class="columns small-6 medium-4 large-3" v-if="project.translation">
                <h4>Translation</h4>
                <h6>{{project.translation ? 'Needs Translation' : "No Translation needed"}}</h6>
              </div>
            </div>

            <div class="reference" v-if="project.reference">
              <h4>Link to reference</h4>
              <a class="button hollow expanded" :href="project.reference" target="_blank">View Link</a>
            </div>
          </div>

        </div>
        <!-- close Project Panel -->
        <!-- Contact Info -->
        <aside id="contact" class="columns small-12 medium-4 large-3">
          <div class="aside-container">
            <nav id="projectnav" v-if="project.id" class="flex" style="justify-content: space-between">
              <router-link v-if="project.id" class="button expanded" :class="{'disabled' : project.archive}" :to="{ name: 'edit', params: { id: project.id} }">Edit</router-link>
            </nav>
            <nav v-if="contactSession || auth">
              <router-link class="button hollow expanded" :to="{name: 'list'}">All Projects</router-link>
              <a v-if="auth" href="/account/edit">Edit User Profile</a>
              <a v-else="!auth && contactSession" :href="'/contacts/' + contactSession + '/edit'">Edit Contact Profile</a>
              <a v-if="project.id"
                id="deleteProject"
                style="float: right"
                class="delete-project"
                @click="deletePrompt">
                <icon name="trash"></icon>
                Delete
              </a>
            </nav>
            <div id="contactCard">
              <hr class="no-margin">
              <h3 class="banner">Contact</h3>

              <h4 v-if="contact.full_name">{{contact.full_name}}</h4>
              <ul>
                <li v-if="contact.email">
                  <label>Email</label>
                  <a :href="'mailto:' + contact.email"><span>{{contact.email}}</span></a>
                </li>
                <li v-if="contact.phone">
                  <label>Phone</label>
                  <span>{{contact.phone}}</span>
                </li>
                <li v-if="contact.position">
                  <label>Position</label>
                  <span>{{contact.position}}</span>
                </li>
                <li v-if="contact.branch">
                  <label>Location</label>
                  <span>{{contact.branch}}</span>
                </li>
              </ul>
            </div><!--close callout-->
          </div>
        </aside>
      </div><!-- close row -->
    </section><!-- close projectShow -->

    <div id="login" v-if="!loading && !validUser">
      <ContactLogin :project-user="contact.id"></ContactLogin>
    </div>
  </div>
</template>

<script>
  import Axios from "axios"
  import bus from "../bus.js"

  // Mixins
  import DeleteProject from "./mixins/deleteProject.js"

  // Components
  import ContactLogin from "../shared/contactLogin.vue"
  import AdminUpdates from "./components/form/adminUpdates.vue"

  export default {
    name: 'Show',
    components: {
      AdminUpdates,
      ContactLogin
    },
    mixins: [DeleteProject],
    props: ['contactSession', 'auth'],
    data() {
      return {
        loading: false,
        validUser: false,
        project: {
          id: null
        },
        project_media: [],
        contact: {},
        dzUpload: false,
        error: null
      }
    },
    watch: {
      '$route': 'fetchData',
      contactSession(id) {
        this.validateUser(id)
      },
      'contact.id': function(id) {
        this.validateUser(this.contactSession)
      },
      validUser(status) {
        if(this.validUser == true) {
          this.fetchData()
        }
      }
    },
    methods: {
      validateUser(id) {
        if(id == this.contact.id && id != null) {
          this.validUser = true
        }
      },
      fetchData() {
        this.error = this.post = null
        this.loading = true
        this.getProject()
      },
      getProject() {
        var vm = this

        //If we have route params
        if (vm.$route.params.id) {
          var pid = vm.$route.params.id

          if(this.auth || this.contactSession) {
            // if there is an admin user authorized or if we find a contact Session
            // Let's make a request
            Axios.get('/api/v1/projects/' + pid + '.json')
            .then( response => {
              // Before we update our DOM we want to make sure
              // if we have a contact session but no admin user the contact has access
              if(vm.contactSession != response.data.contact.id && vm.auth == null) {
                vm.$notify({
                  title: "Please Log In",
                  text: "Either you aren't logged in or don't have access to this page. <br>Please try logging in again."
                })
              } else {
                vm.loading = false
                vm.validUser = true
                vm.project = response.data.project
                vm.project_media = response.data.project_media.medias
                vm.contact = response.data.contact

                document.title = vm.project.title + " | Collateral Express"
              }
            }).catch(error => {
              // Push to 404
              vm.$router.push({ name: 'list' })
              console.log(error)
            })
          } else {
            // if no valid session is found
            // We will just grab some Ids so we can validate
            Axios.get('/api/v1/projects/' + pid + '.json')
            .then( response => {
                vm.loading = false
                vm.$set(vm.project, 'id', response.data.project.id)
                vm.$set(vm.project, 'title', response.data.project.title)
                vm.$set(vm.contact, 'id', response.data.contact.id)

                document.title = vm.project.title + " | Collateral Express"
            }).catch(error => {
              // Push to 404
              vm.$router.push({ name: 'list' })
              console.log(error)
            })
          }
        } else {
          // if no route param
          vm.$router.push({name: 'list'})
        }
      },
    },
    mounted() {
      // When we first mount lets see if there is an admin
      // If so the user is valid and everything is great
      if(this.auth != null) {
        this.validUser = true
      }
      this.validateUser(this.contactSession)
      bus.$on('projectPropSet', (key, val) => {
        this.$set(this.project, key, val)
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
      //bus.$emit('projectEmit');
      next()
    }
  }
</script>

<style scoped lang="scss">
  @mixin aspect-ratio($width, $height) {
    position: relative;
    &:before {
      display: block;
      content: "";
      width: 100%;
      padding-top: ($height / $width) * 100%;
    }
  }
  .form-card {
    background: white;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.20);
    border-radius: 6px;
    @include aspect-ratio(4,5);
    .card-content {
      position: absolute;
      top: 0; left: 0;
    }
  }
  #deliveryInfo {
    #details .columns {
      margin-bottom: 2rem;
    }
    h4 {
      border-bottom: 1px solid #484848;
      padding-bottom: .5rem;
      margin-bottom: .5rem;
    }
    h6 {
      font-family: tele-nor;
    }
  }
  #contact {
    height: 100vh;
    position: relative;
    background: #181818;
    .aside-container {
      position: absolute;
      top: 0;
      left: 0;
      padding: 2rem 2rem;
      width:100%;
      height: 100vh;
    }
    .delete-project {
      svg {
        fill: white;
      }
    }
    #contactCard {
      hr {
        margin: 2rem 0;
        border-color: #323232!important;
      }
      h3 {
        box-shadow: none;
      }
      h4 {
        margin-top: 2rem;
      }
      h4, span {
        color: white;
      }
    }
  }
</style>
