<template>
  <div v-if="$auth.ready()">
    <transition name="fade">
      <LoadScreen v-if="loading"></LoadScreen>
    </transition>
    <div id="accountList" v-if="$auth.check('admin')">
      <div class="row">
        <div class="columns">
          <h2>Users</h2>
          <nav class="user-scope-nav">
            <router-link :to="{ name: 'list-admin'}" :class="{'is-active':!role}">All</router-link>
            <router-link :to="{ name: 'list-admin', query:{role: 'admin'} }" exact>Admins</router-link>
            <router-link :to="{ name: 'list-admin', query:{role: 'contact'} }" exact>Contacts</router-link>
          </nav>
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
                <td>Role</td>
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
              <tr v-if="users.length > 0" v-for="user in users" v-bind:key="user">
                <td>{{user.full_name}}</td>
                <td>{{user.role}}</td>
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
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'AdminList',
    metaInfo() {
      return {
        title: this.$route.meta.title
      }
    },
    data() {
      return {
        loading: false,
        message: '',
        pagination: {
          current: null,
          next: null,
          prev: null,
        },
        role: null,
        resource_url: '/api/v1/users.json'
      }
    },
    computed: {
      ...mapGetters({
        authUser: 'authUser',
        validToken: 'validToken',
        users: 'users'
      }),
      token() {
        return document.getElementsByName('csrf-token')[0].getAttribute('content')
      }
    },
    watch: {
      '$route': function() {
        this.queryUsers()
        this.role = this.$route.query.role
        if(!this.$route.query.role) {
          this.role = ""
        }
      }
    },
    methods: {
      queryUsers() {
        var url = this.resource_url
        if(this.$route.query.role) {
          var url = this.resource_url + "?"
          var role = null
          var page = null

          if(this.$route.query.role && this.$route.query.role != '') {
            this.role = this.$route.query.role
            role = "role=" + this.role
            url = url + role
          }
          // if(this.$route.query.page && this.$route.query.page != '') {
          //   this.page = this.$route.query.page
          //   page = "page=" + this.page
          //   url = url + page
          // }
          // if(role != '') {
          //   url = url + page + "&" + role
          // } else {
          //   url = url
          // }
        }

        this.axios.get(url).then( response => {
          this.setData(response.data)
        }).catch(error => {
          this.$router.push({name: '404'})
        })
      },
      setData(data, err) {
        if(!err) {
          this.loading = false
          this.$store.dispatch('setUsers', data.users)
          this.message = "Succesfully found all users."
          if(data.users.length < 1) {
            if(this.role) {
              this.message = "You have no '" + this.role + "' users."
            } else {
              this.message = "You have no saved users."
            }
          }
        }
      },
      deleteUser(user) {
        this.axios.delete('/api/v1/users/' + user.id, {
          authenticity_token: this.token,
          user : user,
        })
        .then(response => {
          this.$store.dispatch({
            type: 'setFlash',
            title: response.data.flash[0][1],
            group: 'app'
          })
          this.queryUsers()
        })
        .catch(function (error) {
          console.log(error)
        });
      },
    },
    created(){
      this.queryUsers()
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
