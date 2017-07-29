<template>
  <div>
    <transition name="fade">
      <LoadScreen v-if="loading"></LoadScreen>
    </transition>
    <div id="accountList" v-if="validUser">
      <div class="row">
        <div class="columns">
          <h2>Users</h2>

          <hr class="no-margin" style="margin-bottom:1.25rem">
        </div>
      </div>

      <div class="row">
        <div class="column">
          <table>
            <thead>
              <tr>
                <td>Name</td>
                <td>Email</td>
                <td>Phone Number</td>
                <td>Actions</td>
              </tr>
            </thead>
            <tbody v-if="!loading && users.length < 1">
              <tr>
                <td width="100%">
                  <h3>{{message}}</h3>
                  <p>Please try a different filter.</p>
                </td>
                <td></td><td></td><td></td><td></td>
              </tr>
            </tbody>
            <tbody>
              <tr v-if="users.length > 0" v-for="user in users" v-bind:key="project">
                <td>{{user.full_name}}</td>
                <td>{{user.email}}</td>
                <td>{{user.phone}}</td>
                <td>
                  <router-link :to="{ name: 'edit-admin', params: { id: user.id} }">Edit</router-link>
                  <button id="deleteUser" @click="deleteUser(user)" v-if="user.id">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- <nav id="pagination" v-if="pagination.next || pagination.prev">
            <button @click="previousPage" class="button" :class="{'disabled': !pagination.prev}">Previous Page</button>
            <button @click="nextPage" class="button" :class="{'disabled': !pagination.next}">Next Page</button>
          </nav> -->
        </div>
      </div>
    </div>

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
    name: 'AdminList',
    components: {
      Login
    },
    props: ['authUser'],
    data() {
      return {
        loading: false,
        validUser: false,
        login: false,
        message: '',
        users: [],
        pagination: {
          current: null,
          next: null,
          prev: null,
        },
        resource_url: '/api/v1/users.json',
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
        if(this.validUser == true && this.users.length == 0) {
          this.getUsers(this.resource_url)
        }
      }
    },
    methods: {
      setScope(scope) {
        if(scope) {
          this.scope = scope
          var url = this.resource_url + "?q=" + this.scope
          this.getUsers(url)
        } else {
          this.scope = null
          this.getUsers()
        }
      },
      nextPage() {
        if(this.pagination.next != null) {
          if (this.scope != null) {
            var url = this.resource_url + "?q=" + this.scope + "&page=" + this.pagination.prev
            this.getUsers(url)
          } else {
            var url = this.resource_url + "?page=" + this.pagination.next
            this.getUsers(url)
          }
        }
      },
      previousPage() {
        if(this.pagination.prev != null){
          if (this.scope != null) {
            var url = this.resource_url + "?q=" + this.scope + "&page=" + this.pagination.prev
            this.getUsers(url)
          } else {
            var url = this.resource_url + "?page=" + this.pagination.prev
            this.getUsers(url)
          }
        }
      },
      getUsers(url) {
        var vm = this
        if(!url) { url = this.resource_url }
        this.loading = true
        Axios.get(url)
          .then( response => {
            vm.loading = false
            vm.users = response.data.users
            vm.message = "Succesfully found all users."
            // vm.pagination.next = response.data.next_page
            // vm.pagination.prev = response.data.prev_page
            // vm.pagination.current = response.data.current_page
            // if(response.data.projects.length < 1) {
            //   if(this.scope) {
            //     vm.message = "You have no '" + vm.scope + "' projects."
            //   } else {
            //     vm.message = "You have no saved projects."
            //   }
            // }
          }).catch(error => {
            console.log(error)
          })
      },
      deleteProject(user) {
        var vm = this
        Axios.delete('/users/' + user.id, {
          user : user,
        })
        .then(function (response) {
          bus.$emit('flashEmit', response.data.flash[0][1])

          var url = ""
          if(vm.scope != null) {
            url = vm.resource_url + "?q=" + vm.scope + "&page=" + vm.pagination.current
          } else {
            url = vm.resource_url + "?page=" + vm.pagination.current
          }
          vm.getUsers(url)
          // vm.$router.push({ name: 'list'})
        })
        .catch(function (error) {
          console.log(error)
        });
      },
    },
    beforeCreate(){
      // Because we hit this page from outside of vue router we have to do some secondary checks.
      // We will run this get request to set our authentication
      // And set wether login is visible or not
      var vm = this
      Axios.get('/api/v1/authenticate.json')
      .then(function (response) {
        if (response.data.user.id) {
          vm.login = false
          bus.$emit('authEmit', response.data.user.id, response.data.role)
        } else {
          vm.login = true
        }
      }).catch(function (error) {
        console.log('Trouble authenticating user.')
      })
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
.fade-enter-active, .fade-leave-active {
  transition: opacity .125s ease;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
