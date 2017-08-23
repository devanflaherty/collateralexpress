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
          v-model="user.email"
          v-validate="'required|email'"
          data-vv-name="User Email"
          :has-error="veeErrors.has('User Email')"
          :error-text="veeErrors.first('User Email')"
          label="User Email"></FloatLabel>
      </div>

      <div class="float-input">
        <FloatLabel
          v-model="user.password"
          v-validate="'required'"
          data-vv-name="User Password"
          :has-error="veeErrors.has('User Password')"
          :error-text="veeErrors.first('User Password')"
          input-type="password"
          label="User Password"></FloatLabel>
      </div>

      <input type="submit" value="submit" class="button gradient">

    </form>
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
    return {}
  },
  computed: {
    ...mapGetters({
      authUser: 'authUser',
      validToken: 'validToken',
      user: 'user'
    }),
    token() {
      return document.getElementsByName('csrf-token')[0].getAttribute('content')
    },
  },
  created() {
  },
  methods: {
    onSubmit: function () {
      this.$auth.login({
          url: '/api/v1/user_token',
          data: {
            auth: {email: this.user.email, password: this.user.password}
          },
          success: function (response) {
            this.$notify({
              title: 'Succesfully signed in ' + this.user.email,
              type: 'success',
              group: 'auth'
            })
            this.$store.dispatch('setToken', response.data.jwt)
          },
          error: function (error) {
            this.$notify({
              title: 'Error signing in ' + this.user.email,
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
