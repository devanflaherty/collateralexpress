<template>
  <div>
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
        <FloatLabel
          v-model="password"
          v-validate="'required'"
          data-vv-name="User Password"
          :has-error="veeErrors.has('User Password')"
          :error-text="veeErrors.first('User Password')"
          label="User Password"></FloatLabel>
      </div>

      <input type="submit" value="submit" class="button gradient">

    </form>

  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import axios from 'axios'
  import bus from '../../../../bus'

  import { onValidation } from '../../validation'
  import FloatLabel from "../../floatLabel.vue"

  export default {
    name: 'AdminLogin',
    components: {
      FloatLabel
    },
    data() {
      return {
        loading: false,
        email: null,
        password: null
      }
    },
    computed: {
      token() {
        return document.getElementsByName('csrf-token')[0].getAttribute('content')
      }
    },
    methods: {
      onSubmit: function () {
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
              this.$store.dispatch('checkValidUser')
            },
            error: function (error) {
              this.$notify({
                title: 'Error signing in ' + this.email,
                type: 'alert',
                group: 'auth'
              })
            },
            redirect: this.$route.path,
            rememberMe: true,
        });
      }
    }
  }
</script>

<style scoped lang="scss">
</style>
