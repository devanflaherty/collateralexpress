<template>
  <div>
    <section id="projectShow" v-if="validUser == true">
      <LoadScreen v-if="loading"></LoadScreen>
      <div class="row" v-else>
        <!-- Project Info -->
        <div class="columns medium-7">
          <router-link v-if="project.id" :to="{ name: 'edit', params: { id: project.id} }">Edit</router-link>

          <hr>

          <AdminUpdates v-if="auth" :project="project"></AdminUpdates>

          <div id="projectInfo">
            <h2>{{project.title}}</h2>
            <span v-if="project.existing" class="exists-tag-true">
              Existing Project
            </span>
            <span v-else class="exists-tag-false">
              new Project
            </span>

            <div class="dates">
              <icon name="calendar"></icon>
              <span class="created-date">{{project.created_at}}</span>
              <icon name="arrow-right"></icon>
              <span class="due-date">{{project.due_date}}</span>
            </div>
          </div>

          <div class="description">
            <h3>Project Description</h3>
            {{project.description}}
          </div>

          <div class="reference" v-if="project.reference">
            <h3>Link to reference</h3>
            <a :href="project.reference" target="_blank">View Link</a>
          </div>

          <div class="files" v-if="project.medias">
            <h3>Files</h3>
            <div class="row small-3-up">
              <div class="column" v-for="media in project.medias">
                <div class="card">
                  <img :src="media.file.thumb.url">
                  {{media.name}}
                  <a :href="media.file.url" class="button rounded">
                    <icon name="download"></icon> Download
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div id="deliveryInfo">
            <hr>
            <!-- add comma breaker -->
            <div class="tactics" v-if="project.tactic">
              <h3>Tactics</h3>
              <span v-for="tactic in project.tactic">{{tactic}}</span>
            </div>

            <div class="target" v-if="project.target">
              <h3>Target</h3>
              <h4>{{project.target}}</h4>
            </div>

            <div class="business-unit" v-if="project.business_unit">
              <h4>Business Unit: {{project.business_unit}}</h4>
            </div>

            <div class="translation" v-if="project.translation">
              <h4>Needs translation</h4>
            </div>
          </div>

        </div>
        <!-- close Project Panel -->
        <!-- Contact Info -->
        <div class="columns medium-5">
          <h3>Contact Information</h3>

          <ul>
            <li v-if="contact.avatar">
              <span>Avatar</span>
              <h5>{{contact.avatar}}</h5>
            </li>
            <li v-if="contact.full_name">
              <span>Name</span>
              <h5>{{contact.full_name}}</h5>
            </li>
            <li v-if="contact.email">
              <span>Email</span>
              <h5>{{contact.email}}</h5>
            </li>
            <li v-if="contact.phone">
              <span>Phone</span>
              <h5>{{contact.phone}}</h5>
            </li>
            <li v-if="contact.branch">
              <span>Branch</span>
              <h5>{{contact.branch}}</h5>
            </li>
            <li v-if="contact.position">
              <span>Position</span>
              <h5>{{contact.position}}</h5>
            </li>
          </ul>

        </div>
      </div><!-- close row -->
    </section><!-- close projectShow -->

    <div id="login" v-else>
      <ContactLogin :project-user="contact.id"></ContactLogin>
    </div>
  </div>
</template>

<script>
  import Axios from "axios"
  import bus from "../bus.js"

  import ContactLogin from "../shared/contactLogin.vue"
  import AdminUpdates from "./components/form/adminUpdates.vue"

  export default {
    name: 'Show',
    components: {
      AdminUpdates,
      ContactLogin
    },
    props: ['contactSession', 'auth'],
    data() {
      return {
        loading: false,
        validUser: false,
        project: {
          id: null
        },
        contact: {},
        dzUpload: false,
        error: null
      }
    },
    watch: {
      '$route': 'fetchData',
      contactSession(id) {
        if(id == this.contact.id) {
          this.validUser = true
        }
      },
      validUser(status) {
        if(this.validUser == true) {
          this.fetchData()
        }
      }
    },
    methods: {
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
      }
    },
    mounted() {
      // When we first mount lets see if there is an admin
      // If so the user is valid and everything is great
      if(this.auth != null) {
        this.validUser = true
      }
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
</style>
