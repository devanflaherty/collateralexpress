<template>
  <div>
    <hr class="no-margin">
    <section id="projectShow" v-if="validUser">
      <LoadScreen v-if="loading"></LoadScreen>
      <div class="row expanded small-collapse">
        <!-- Project Info -->
        <div class="columns small-12 medium-8 large-9" :class="{'pad-small': $auth.check('contact')}">

          <AdminUpdates v-if="$auth.check('admin')"></AdminUpdates>

          <div id="projectInfo" class="pad-small pad-in-small">
            <h2 class="banner" :class="{'black-banner':project.archive}">{{project.title}}</h2><br>
            <span class="tag flagged" v-if="project.flag">Flagged</span>
            <span class="tag" :class="{open: project.status == 'open', complete: project.status == 'complete',alert: project.status == 'need info'}" v-if="project.status">{{project.status}}</span>
            <span v-if="project.existing" class="tag exists-tag-true">
              Existing Project
            </span>
            <span v-else class="tag exists-tag-false">
              New Project
            </span>

            <div class="dates" style="margin-top: 2rem;">
              <icon name="calendar"></icon>
              <span class="created-date">{{createDate}}</span>
              <icon name="arrow-right" v-if="dueDate"></icon>
              <span class="due-date" v-if="dueDate">{{dueDate}}</span>
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

          <div class="files pad-small pad-in-small white-bg" v-if="projectMedia != ''">
            <div class="row">
              <div class="columns">
                <h3>Files</h3>
              </div>
            </div>
            <ul id="fileList" class="row small-up-2 medium-up-3 large-up-4">
              <li class="column" v-for="media in projectMedia">

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
            <div class="tactics pad-small" v-if="project.tactic != ''">
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
              <div class="columns small-6 medium-4 large-3" v-if="project.translation">
                <h4>Link to reference</h4>
                <a class="button hollow expanded" :href="project.reference" target="_blank">View Link</a>
              </div>
            </div>
          </div>

        </div>
        <!-- close Project Panel -->
        <!-- Contact Info -->
        <aside id="contact" class="columns small-12 medium-4 large-3">
          <div class="aside-container">
            <nav id="projectnav" v-if="project.id && $auth.check('admin')" class="flex" style="justify-content: space-between">
              <router-link class="button expanded" :class="{'disabled' : project.archive}" :to="{ name: 'edit', params: { id: project.id} }">Edit</router-link>
            </nav>
            <nav v-if="$auth.check()">
              <router-link class="button hollow expanded" :to="{name: 'list'}">All Projects</router-link>
              <a v-if="project.id && $auth.check('admin')"
                id="deleteProject"
                style="float: right"
                class="delete-project"
                @click="deletePrompt(project.id)">
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
                <li v-if="contact.superior">
                  <label>Superior</label>
                  <span>{{contact.superior}}</span>
                </li>
                <li v-if="contact.location">
                  <label>State or Region</label>
                  <span>{{contact.location}}</span>
                </li>
              </ul>
            </div><!--close callout-->
          </div>
        </aside>
      </div><!-- close row -->
    </section><!-- close projectShow -->

    <div id="login" v-if="!loading && !validUser">
      <Login :project-user="contact.id"></Login>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import moment from "moment"

  // Mixins
  import DeleteProject from "./mixins/deleteProject.js"

  // Components
  import Login from "../shared/login/index.vue"
  import AdminUpdates from "./components/adminUpdates.vue"

  export default {
    name: 'Show',
    metaInfo() {
      return {
        title: this.pageTitle
      }
    },
    components: {
      AdminUpdates,
      Login
    },
    mixins: [DeleteProject],
    data() {
      return {
        loading: false,
        pageTitle: '',
        createDate: "",
        dueDate: "",
        dzUpload: false,
        error: null
      }
    },
    computed: {
      ...mapGetters({
        authUser: 'authUser',
        project: 'project',
        projectMedia: 'projectMedia',
        contact: 'contact',
        validUser: 'validUser'
      }),
    },
    watch: {
      '$route': function() {
        // Watch if route changers
        // If it does we are going to re-fetch the data
        if(this.$auth.check()) {
          this.fetchData()
        }
      },
      'contact.id': function(id) {
        this.$store.dispatch('checkValidUser', id)
      },
      'authUser.id': function() {
        // If we get an authUser fetchData
        this.fetchData()
      },
    },
    methods: {
      fetchData() {
        this.loading = true
        if(this.$route.params.id) {
          this.$Progress.start()
          this.axios.get('/api/v1/projects/' + this.$route.params.id  + '.json').then( response => {
            this.$Progress.finish()
            this.setData(response.data)
          }).catch(error => {
            this.$Progress.fail()
            this.setData(response.data, error)
          })
        } else {
          this.$router.push({name: '404'})
        }
      },

      setData(data, err) {
        // if we have an ID param
        if(!err) {
          this.$store.dispatch('checkValidUser', data.contact.id)
        }

        if(this.$auth.check() && !err) {
          this.loading = false
          // if there is an authUser
          // We make a request with the ID Param
          if(this.$auth.check('contact') && this.authUser.id != data.contact.id) {
            this.$notify({
              title: "Please Log In",
              text: "Either you aren't logged in or don't have access to this page. <br>Please try logging in again.",
              group: 'auth'
            })
          } else {
            this.$store.dispatch('setProject', data.project)
            this.$store.dispatch('setProjectMedia', data.project_media.medias)
            this.$store.dispatch('setContact', data.contact)

            this.createDate = moment(data.project.created_at).format("MMM Do YYYY")
            if(data.project.due_date != null) {
              this.dueDate = moment(data.project.due_date).format("MMM Do YYYY")
            }

            this.pageTitle = data.project.title
          }
        } else if (this.$auth.check() && err) {
          this.loading = false
          this.$router.push({ name: 'list' })
          console.log(error)
        } else if (!this.$auth.check() && !err) {
          this.loading = false

          this.$store.dispatch({
            type: 'setProjectProperty',
            project: {
              id: data.project.id,
              title: data.project.title
            }
          })

          this.$store.dispatch('setContactProperty', ['id', data.contact.id])

          this.pageTitle = data.project.title
        } else {
          this.$store.dispatch({
            type: 'setFlash',
            title: "We couldn/'t get your project.",
            group: 'app'
          })

          this.$router.push({ name: 'list' })
          console.log(error)
        }
      }
    },
    created() {
      if(this.$auth.check()) {
        this.fetchData()
      }
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
    min-height: 100vh;
    position: relative;
    background: #181818;
    display: flex;
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
