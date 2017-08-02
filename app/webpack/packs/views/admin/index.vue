<template>
  <section id="admin" class="pad">
    <div class="row align-center">
      <div class="columns small-11 medium-9 large-6">
        <router-view
          :auth-user="authUser">
        </router-view>
      </div>
      <aside class="columns small-11 medium-3 large-4" v-if="authUser.role == 'admin'">
        <nav>
          <router-link :to="{name: 'account'}" class="button expanded" v-if="$route.name != 'account'">Edit Account</router-link>

          <router-link :to="{name: 'list-admin'}" class="button expanded hollow">All Admin</router-link>
          <router-link :to="{name: 'new-admin'}" class="button expanded">Add Admin</router-link>

          <a href="#logout" @click.prevent="logoutUser" class="button expanded secondary">Logout</a>
        </nav>
      </aside>
    </div>
  </section>
</template>

<script>
import bus from "../../bus"
import axios from "axios"

import { onValidation } from '../shared/validation'
import FloatLabel from "../shared/floatLabel.vue"

let token = document.getElementsByName('csrf-token')[0].getAttribute('content')
axios.defaults.headers.common['X-CSRF-Token'] = token
axios.defaults.headers.common['Accept'] = 'application/json'

export default {
  name: 'Admin_Form',
  mixins: [onValidation],
  components: {
    FloatLabel
  },
  props: ['authUser'],
  data() {
    return {
    }
  },
  methods: {
    logoutUser() {
      axios.delete('/users/sign_out', {
        utf8 : "✓",
        authenticity_token: token
      })
      .then(response => {
        alert('success')
        this.$router.push({name: 'home'})
        bus.$emit('flashEmit', "Succefully signed out.")
      })
      .catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0
}
</style>
