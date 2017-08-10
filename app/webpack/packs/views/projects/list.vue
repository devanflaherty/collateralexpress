<template>
  <div>
    <LoadScreen v-if="loading"></LoadScreen>
    <section id="projectList" class="pad-small" v-if="authUser.id">
      <div class="row">
        <div class="columns">
          <h2>Project Requests</h2>

          <nav class="project-scope-nav">
            <router-link :to="{ name: 'list'}" :class="{'is-active':!scope}">All</router-link>
            <router-link :to="{ name: 'list', query:{filter: 'complete'} }" exact>Complete</router-link>
            <router-link :to="{ name: 'list', query:{filter: 'flagged'} }" exact>Flagged</router-link>
          </nav>
          <hr class="no-margin" style="margin-bottom:1.25rem">
          <div v-if="projects.length < 1">
            <h3>{{query_message}}</h3>
            <p>Please try a different filter.</p>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="column">
          <table v-if="projects.length > 0">
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
              <tr v-for="project in projects" v-bind:key="project">
                <td width="20%">{{project.title}}</td>
                <td width="30%">{{project.description}}</td>
                <td width="10%">
                  <span class="tag flagged expanded" v-if="project.flagged">Flagged</span>
                  <span class="tag expanded" v-if="project.status" :class="{open: project.status == 'open', complete: project.status == 'complete',alert: project.status == 'need info'}">{{project.status}}</span>
                </td>
                <td width="20%">{{project.contact ? project.contact.name : ""}}</td>
                <td width="20%">
                  <router-link :to="{ name: 'show', params: { id: project.id} }">Show</router-link>
                  <router-link :to="{ name: 'edit', params: { id: project.id} }">Edit</router-link>
                  <button id="deleteProject" @click="deleteProject(project)" v-if="project.id">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>

          <nav id="pagination" v-if="pagination.prev || pagination.next">
            <router-link v-if="pagination.prev" tag="button" :to="{ name: 'list', query:queryPrev}" :class="{'disabled': !pagination.prev}" exact append><icon name="chevron-left"></icon></router-link>
            <router-link v-else tag="button" :to="{name: 'list'}" class="disabled" exact><icon name="chevron-left"></icon></router-link>
            <div><span>{{pagination.current}} of {{pagination.total}}</span></div>
            <router-link v-if="pagination.next" tag="button" :to="{ name: 'list', query:queryNext}" :class="{'disabled': !pagination.next}" exact append><icon name="chevron-right"></icon></router-link>
            <router-link v-else tag="button" :to="{name: 'list', query:{page: pagination.total}}" class="disabled" exact><icon name="chevron-right"></icon></router-link>
          </nav>
        </div>
      </div>
    </section>

    <div id="login" v-if="!loading && authUser.role == 'public'">
      <Login></Login>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import axios from 'axios'
  import Login from '../shared/login/index.vue'

  export default {
    name: 'ProjectList',
    metaInfo() {
      return {
        title: this.$route.meta.title
      }
    },
    components: {
      Login
    },
    data() {
      return {
        loading: false,
        projects: [],
        pagination: {
          current: null,
          next: null,
          prev: null,
          total: null
        },
        query_message: "",
        resource_url: '/api/v1/projects.json',
        page: '',
        scope: null
      }
    },
    computed: {
      ...mapGetters({
        authUser: 'authUser'
      }),
      queryNext() {
        if(this.scope) {
          return {
            filter: this.scope,
            page: this.pagination.next
          }
        } else {
          return {
            page: this.pagination.next
          }
        }
      },
      queryPrev() {
        if(this.scope) {
          return {
            filter: this.scope,
            page: this.pagination.prev
          }
        } else {
          return {
            page: this.pagination.prev
          }
        }
      }
    },
    watch: {
      '$route': function() {
        this.queryProjects()
        this.scope = this.$route.query.filter
        if(!this.$route.query.filter) {
          this.scope = ""
        }
      }
    },
    methods: {
      queryProjects() {
        this.$Progress.start()
        var url = this.resource_url
        if(this.$route.query) {
          var url = this.resource_url + "?"
          var filter = null
          var page = null

          if(this.$route.query.filter && this.$route.query.filter != '') {
            this.scope = this.$route.query.filter
            filter = "q=" + this.scope
            url = url + filter
          }
          if(this.$route.query.page && this.$route.query.page != '') {
            this.page = this.$route.query.page
            page = "page=" + this.page
            url = url + page
          }
          if(filter != '' && page != '') {
            url = url + page + "&" + filter
          } else {
            url = url
          }
        }
        axios.get(url).then( response => {
          this.$Progress.finish()
          this.setData(response.data)
        }).catch(error => {
          this.$Progress.fail()
          this.$router.push({name: '404'})
        })
      },

      setData(data, err) {
        this.loading = false
        this.projects = data.projects
        this.query_message = "Succesfully found all projects."

        this.pagination.next = data.next_page
        this.pagination.prev = data.prev_page
        this.pagination.current = data.current_page
        this.pagination.total = data.last_page
        if(data.projects.length < 1) {
          if(this.scope) {
            this.query_message = "You have no '" + this.scope + "' projects."
          } else {
            this.query_message = "You have no saved projects."
          }
        }
      },

      deleteProject(project) {
        axios.delete('/projects/' + project.id, {
          project : project,
        })
        .then(response => {
          // var filteredProjects = vm.projects.filter(p => p.id !== project.id)
          // vm.projects = filteredProjects

          this.$store.dispatch({
            type: 'setFlash',
            title: response.data.flash[0][1],
            group: 'app'
          })

          this.queryProjects()
        })
        .catch(function (error) {
          console.log(error)
        });
      },
    },
    created() {
      this.queryProjects()
    }
  }
</script>

<style scoped lang="scss">
@import '../../../../assets/stylesheets/util/colors';

// Scope Nav
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
  .is-active {
    color: black;
    font-family: tele-Ult;
    &:after {
      background: magenta
    }
  }
}

// Pagination
#pagination {
  height:38px;
  background: #fff;
  border-radius: 100px;
  margin: 2rem auto;
  width: 200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,0.20);
  overflow: hidden;
  span {
    font-family: Tele-Fet;
  }
  button {
    height: 38px;
    width: 48px;
    color: $primaryColor;
    cursor: pointer;
    &.disabled {
      opacity: 0.25;
      cursor: not-allowed;
    }
    &:hover {
      background: #EEF3F3;
    }
    &:first-of-type {
      border-right: 1px solid #EEEFF3;
    }
    &:last-of-type {
      border-left: 1px solid #EEEFF3;
    }
  }
}
// Transitions
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
