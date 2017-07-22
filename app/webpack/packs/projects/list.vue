<template>
  <div>
    <transition name="fade">
      <LoadScreen v-if="loading"></LoadScreen>
    </transition>
    <section id="projectList" v-if="validUser">
      <div class="row">
        <div class="columns">
          <h2>Project Requests</h2>

          <nav>
            <a href="#all" @click.prevent="setScope()">All</a>
            <a href="#open" @click.prevent="setScope('complete')">Complete</a>
            <a href="#falgged" @click.prevent="setScope('flagged')">flagged</a>
          </nav>
        </div>
      </div>

      <div class="row">
        <div class="column">
          <table>
            <thead>
              <tr>
                <td>Title</td>
                <td>Description</td>
                <td>Status</td>
                <td>Contact</td>
                <td>Actions</td>
              </tr>
            </thead>
            <tbody v-if="projects.length < 1">
              <tr>
                <td width="100%">
                  <h3>{{message}}</h3>
                  <p>Please try a different filter.</p>
                </td>
                <td></td><td></td><td></td><td></td>
              </tr>
            </tbody>
            <tbody>
              <tr v-if="projects.length > 0" v-for="project in projects" v-bind:key="project">
                <td>{{project.title}}</td>
                <td>{{project.description}}</td>
                <td>{{project.status}}</td>
                <td>{{project.contact ? project.contact.name : ""}}</td>
                <td>
                  <router-link :to="{ name: 'show', params: { id: project.id} }">Show</router-link>
                  <router-link :to="{ name: 'edit', params: { id: project.id} }">Edit</router-link>
                  <button id="deleteProject" @click="deleteProject(project)" v-if="project.id">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>

          <nav id="pagination" v-if="pagination.next || pagination.prev">
            <button @click="nextPage" class="button" :class="{'disabled': !pagination.next}">Next Page</button>
            <button @click="previousPage" class="button" :class="{'disabled': !pagination.prev}">Previous Page</button>
          </nav>
        </div>
      </div>
    </section>

    <div id="login" v-if="!loading && !validUser">
      <ContactLogin></ContactLogin>
    </div>
  </div>
</template>

<script>
  import Axios from 'axios'
  import bus from '../bus'
  import ContactLogin from '../shared/contactLogin.vue'

  export default {
    name: 'ProjectList',
    components: {
      ContactLogin
    },
    props: ['contact-session', 'auth'],
    data() {
      return {
        loading: false,
        validUser: false,
        message: '',
        projects: [],
        pagination: {
          current: null,
          next: null,
          prev: null,
        },
        resource_url: '/api/v1/projects.json',
        scope: null
      }
    },
    watch: {
      contactSession(id) {
        if(id != null) {
          this.validUser = true
        }
      },
      validUser(status) {
        if(this.validUser == true && this.projects.length == 0) {
          this.getProjects(this.resource_url)
        }
      }
    },
    methods: {
      setScope(scope) {
        if(scope) {
          this.scope = scope
          var url = this.resource_url + "?q=" + this.scope
          this.getProjects(url)
        } else {
          this.scope = null
          this.getProjects()
        }
      },
      nextPage() {
        if(this.pagination.next != null) {
          if (this.scope != null) {
            var url = this.resource_url + "?q=" + this.scope + "&page=" + this.pagination.prev
            this.getProjects(url)
          } else {
            var url = this.resource_url + "?page=" + this.pagination.next
            this.getProjects(url)
          }
        }
      },
      previousPage() {
        if(this.pagination.prev != null){
          if (this.scope != null) {
            var url = this.resource_url + "?q=" + this.scope + "&page=" + this.pagination.prev
            this.getProjects(url)
          } else {
            var url = this.resource_url + "?page=" + this.pagination.prev
            this.getProjects(url)
          }
        }
      },
      getProjects(url) {
        var vm = this
        if(!url) { url = this.resource_url }
        this.loading = true
        Axios.get(url)
          .then( response => {
            vm.loading = false
            vm.projects = response.data.projects
            vm.message = "Succesfully found all projects."
            vm.pagination.next = response.data.next_page
            vm.pagination.prev = response.data.prev_page
            vm.pagination.current = response.data.current_page
            if(response.data.projects.length < 1) {
              if(this.scope) {
                vm.message = "You have no '" + vm.scope + "' projects."
              } else {
                vm.message = "You have no saved projects."
              }
            }
          }).catch(error => {
            console.log(error)
          })
      },
      deleteProject(project) {
        var vm = this
        Axios.delete('/projects/' + project.id, {
          project : project,
        })
        .then(function (response) {
          // var filteredProjects = vm.projects.filter(p => p.id !== project.id)
          // vm.projects = filteredProjects

          bus.$emit('flashEmit', response.data.flash[0][1])

          var url = ""
          if(vm.scope != null) {
            url = vm.resource_url + "?q=" + vm.scope + "&page=" + vm.pagination.current
          } else {
            url = vm.resource_url + "?page=" + vm.pagination.current
          }
          vm.getProjects(url)
          // vm.$router.push({ name: 'list'})
        })
        .catch(function (error) {
          console.log(error)
        });
      },
    },
    created(){
      if(this.auth != null || this.contactSession != null) {
        this.validUser = true
        // this.getProjects()
      }
    }
  }
</script>

<style scoped lang="scss">
.list-move {
  transition: opacity .5s;
}
.list-enter-active, .list-leave-active {
  transition: all .5s;
}
.list-enter, .list-leave-to /* .list-leave-active for <2.1.8 */ {
  opacity: 0;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .125s ease;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
