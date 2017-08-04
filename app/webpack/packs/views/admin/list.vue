<template>
  <div>
    <transition name="fade">
      <LoadScreen v-if="loading"></LoadScreen>
    </transition>
    <div id="accountList">
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
              <tr v-if="users.length > 0" v-for="user in users" v-bind:key="user">
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
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import axios from 'axios'

  export default {
    name: 'AdminList',
    data() {
      return {
        loading: false,
        message: '',
        pagination: {
          current: null,
          next: null,
          prev: null,
        },
        resource_url: '/api/v1/users.json'
      }
    },
    computed: {
      ...mapGetters({
        authUser: 'authUser'
      }),
      token() {
        return document.getElementsByName('csrf-token')[0].getAttribute('content')
      }
    },
    methods: {
      fetchData() {
        var url = this.resource_url

        axios.get(url).then( response => {
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
          // this.pagination.next = data.next_page
          // this.pagination.prev = data.prev_page
          // this.pagination.current = data.current_page
        }
      },
      deleteUser(user) {
        axios.delete('/users/' + user.id, {
          authenticity_token: this.token,
          user : user,
        })
        .then(response => {
          this.$store.dispatch({
            type: 'setFlash',
            title: response.data.flash[0][1],
            group: 'app'
          })
          this.fetchData()
        })
        .catch(function (error) {
          console.log(error)
        });
      },
    },
    mounted(){

    },
    beforeRouteEnter(to, from, next) {
      // var page = to.query.page
      // var filter = to.query.filter
      var url = '/api/v1/users.json'

      axios.get(url).then( response => {
        next(vm => vm.setData(response.data))
      }).catch(error => {
        console.log('Not authenticated')
      })
    },
    beforeRouteUpdate (to, from, next) {
      this.fetchData()
      next()
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
