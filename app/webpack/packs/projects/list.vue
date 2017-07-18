<template>
  <section id="projectList">
    <div class="row">
      <div class="columns">
        <h2>Project Requests</h2>

        <nav>
          <a href="#all" @click.prevent="getProjects()">All</a>
          <a href="#open" @click.prevent="getProjects('open')">Open</a>
          <a href="#flagged" @click.prevent="getProjects('flagged')">flagged</a>
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
          <tbody v-if="loading || projects.length < 1">
            <tr v-if="loading">
              <td width="100%"><LoadScreen v-if="loading"></LoadScreen></td>
            </tr>
            <tr v-else>
              <td width="100%">
                <h3>{{message}}</h3>
                <p>Please try a different filter.</p>
              </td>
            </tr>
          </tbody>
          <transition-group v-else name="list" tag="tbody">
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
          </transition-group>
        </table>

      </div>
    </div>
  </section>
</template>

<script>
  import Axios from 'axios'

  export default {
    name: 'ProjectList',
    data() {
      return {
        loading: false,
        message: '',
        scope: '',
        projects: []
      }
    },
    props: ['contact-session', 'auth'],
    methods: {
      getProjects(query) {
        var vm = this
        this.loading = true
        this.scope = query
        var fetchUrl = '/api/v1/projects.json'
        if(query){
          fetchUrl = '/api/v1/projects.json?q=' + query
        }
        Axios.get(fetchUrl)
          .then( response => {
            vm.loading = false
            vm.projects = response.data.projects
            vm.message = "Succesfully found all projects."
            if(response.data.projects.length < 1) {
              vm.message = "You have no '" + vm.scope + "' projects."
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
          var filteredProjects = vm.projects.filter(p => p.id !== project.id)
          vm.projects = filteredProjects

          for(var f in response.data.flash) {
            var flash = response.data.flash[f]
            if(flash[0] == 'notice') {
              vm.$emit('flashEmit', flash[1])
              console.log(flash[1])
            }
          }
          vm.$router.push({ name: 'list'})
        })
        .catch(function (error) {
          console.log(error)
        });
      },
    },
    created(){
      this.getProjects()
    }
  }
</script>

<style scoped lang="scss">
.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to /* .list-leave-active for <2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
</style>
