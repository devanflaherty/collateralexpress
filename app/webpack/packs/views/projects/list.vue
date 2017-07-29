<template>
  <div>
    <LoadScreen v-if="loading"></LoadScreen>
    <section id="projectList" class="pad-small" v-if="validUser">
      <div class="row">
        <div class="columns">
          <h2>Project Requests</h2>

          <nav class="project-scope-nav">
            <a href="#all" @click.prevent="setScope()" :class="{'active': scope == null}">All</a>
            <a href="#open" @click.prevent="setScope('complete')" :class="{'active': scope == 'complete'}">Complete</a>
            <a href="#falgged" @click.prevent="setScope('flagged')" :class="{'active': scope == 'flagged'}">Flagged</a>
          </nav>
          <hr class="no-margin" style="margin-bottom:1.25rem">
          <div v-if="projects.length < 1">
            <h3>{{message}}</h3>
            <p>Please try a different filter.</p>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="column">
          <table v-if="!loading && projects.length > 0">
            <thead>
              <tr>
                <td width="20%">Title</td>
                <td width="30%">Description</td>
                <td width="10%">Status</td>
                <td width="20%">Contact</td>
                <td width="20%">Actions</td>
              </tr>
            </thead>
            <tbody>
              <tr v-if="projects.length > 0" v-for="project in projects" v-bind:key="project">
                <td width="20%">{{project.title}}</td>
                <td width="30%">{{project.description}}</td>
                <td width="10%">{{project.status}}</td>
                <td width="20%">{{project.contact ? project.contact.name : ""}}</td>
                <td width="20%">
                  <router-link :to="{ name: 'show', params: { id: project.id} }">Show</router-link>
                  <router-link :to="{ name: 'edit', params: { id: project.id} }">Edit</router-link>
                  <button id="deleteProject" @click="deleteProject(project)" v-if="project.id">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>

          <nav id="pagination" v-if="pagination.next || pagination.prev">
            <button @click="previousPage" class="button" :class="{'disabled': !pagination.prev}">Previous Page</button>
            <button @click="nextPage" class="button" :class="{'disabled': !pagination.next}">Next Page</button>
          </nav>
        </div>
      </div>
    </section>

    <div id="login" v-if="!loading && login">
      <Login></Login>
    </div>
  </div>
</template>

<script>
  import Axios from 'axios'
  import bus from '../../bus'
  import Login from '../shared/login/index.vue'

  export default {
    name: 'ProjectList',
    components: {
      Login
    },
    props: ['contact-session', 'authUser'],
    data() {
      return {
        loading: false,
        validUser: false,
        login: false,
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
      'authUser.id': function(id) {
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
    mounted(){
      if(this.authUser.id) {
        this.validUser = true
      }
    },
  }
</script>

<style scoped lang="scss">
.project-scope-nav {
  padding-top: 2rem;
  a {
    color: #aaa;
    position: relative;
    padding-bottom: .5rem;
    margin-right: 1.5rem;
    font-size: 1.25rem;
    font-family: tele-Fet;
    &:hover {
      color: black;
    }
    &:after {
      content: '';
      bottom: 4px;
      left: 0;
      position: absolute;
      height: 2px;
      width: 100%;
      transition: all 0.5s ease;
    }
  }
  .active {
    color: black;
    font-family: tele-Ult;
    &:after {
      background: magenta
    }
  }
}
.list-move {
  transition: opacity .5s;
}
.list-enter-active, .list-leave-active {
  transition: all .5s;
}
.list-enter, .list-leave-to /* .list-leave-active for <2.1.8 */ {
  opacity: 0;
}
</style>
