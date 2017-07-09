<template>
  <div id="projectList">
    <LoadScreen v-if="loading"></LoadScreen>
    <table v-if="!loading">
      <thead>
        <tr>
          <td>Title</td>
          <td>Description</td>
          <td>Status</td>
          <td>Contact</td>
          <td>Actions</td>
        </tr>
      </thead>
      <transition-group name="list" tag="tbody">
        <tr v-for="project in projects" v-bind:key="project">
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
</template>

<script>
  import Axios from 'axios'

  export default {
    name: 'ProjectList',
    data() {
      return {
        loading: false,
        projects: []
      }
    },
    props: ['contact-session'],
    methods: {
      getProjects() {
        var vm = this
        this.loading = true
        Axios.get('/api/v1/projects.json')
          .then( response => {
            this.loading = false
            vm.projects = response.data.projects;
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
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
          if(!vm.contactSession) {
            vm.$router.push({ name: 'new'})
          }
        })
    },
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
