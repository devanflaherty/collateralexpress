<template>
  <div id="accountLogin" v-if="$auth.ready()">
    <div class="flex space-between">
      <div>
        <h2 class="banner">Login</h2>
      </div>
    </div>
    <form v-on:submit.prevent="onSubmit" id="form" class="callout">
      <div class="float-input">
        <FloatLabel
          v-model="email"
          v-validate="'required|email'"
          data-vv-name="User Email"
          :has-error="veeErrors.has('User Email')"
          :error-text="veeErrors.first('User Email')"
          label="User Email"></FloatLabel>
      </div>

      <div class="float-input">
        <FloatLabel v-if="admin"
          v-model="password"
          v-validate="'required'"
          data-vv-name="User Password"
          :has-error="veeErrors.has('User Password')"
          :error-text="veeErrors.first('User Password')"
          input-type="password"
          label="User Password"></FloatLabel>
      </div>

      <input type="submit" value="submit" class="button gradient">

    </form>

    <hr>
    <div v-if="!admin">
      <p>If you are an admin user click the link below to login.</p>
      <a href="#adminLogin" @click.prevent="switchForm">Admin Login</a>
    </div>
    <div v-else>
      <p>If you are contact user click the link below to login.</p>
      <a href="#contactLogin" @click.prevent="switchForm">Contact Login</a>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import bus from "../../bus"

import { onValidation } from '../shared/validation'
import FloatLabel from "../shared/floatLabel.vue"

export default {
  name: 'Admin_Form',
  mixins: [onValidation],
  components: {
    FloatLabel
  },
  metaInfo() {
    return {
      title: this.$route.meta.title
    }
  },
  data() {
    return {
      email: null,
      password: null,
      // True for admin, false for contact
      admin: false
    }
  },
  computed: {
    ...mapGetters({
      authUser: 'authUser',
      validToken: 'validToken',
    }),
    token() {
      return document.getElementsByName('csrf-token')[0].getAttribute('content')
    },
  },
  methods: {
    switchForm() {
      this.admin = !this.admin
    },
    onSubmit: function () {
      if(this.admin == false) {
        // if this is a contact we will secretly send their password, which is just their email
        this.password = this.email
      }
      this.$auth.login({
          url: '/api/v1/user_token',
          data: {
            auth: {email: this.email, password: this.password}
          },
          success: function (response) {
            this.$notify({
              title: 'Succesfully signed in ' + this.email,
              type: 'success',
              group: 'auth'
            })
            this.$store.dispatch('setToken', response.data.jwt)
          },
          error: function (error) {
            this.$notify({
              title: 'Error signing in ' + this.email,
              type: 'alert',
              group: 'auth'
            })
          },
          rememberMe: true,
      });
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
