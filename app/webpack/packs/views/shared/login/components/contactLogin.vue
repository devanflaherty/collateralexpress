<template>
  <div>
    <form v-on:submit.prevent="onSubmit" id="form">
      <div class="float-input">
        <FloatLabel
          v-model="contact_email"
          v-validate="'required|email'"
          data-vv-name="Contact Email"
          :has-error="veeErrors.has('Contact Email')"
          :error-text="veeErrors.first('Contact Email')"
          label="Contact Email"></FloatLabel>
      </div>

      <input type="submit" value="Login" class="button gradient">

    </form>

    <div class="callout alert" v-if="access_message">
      <p>
        {{access_message}}
      </p>
    </div>

  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import FloatLabel from "../../floatLabel.vue"

  export default {
    name: 'ContactLogin',
    data() {
      return {
        contact_email: null,
        password: null,
        access_message: null
      }
    },
    components: {
      FloatLabel
    },
    props: ['project-user'],
    computed: {
      token() {
        return document.getElementsByName('csrf-token')[0].getAttribute('content')
      },
      ...mapGetters(['project'])
    },
    methods: {
      onSubmit: function () {
        this.password = this.contact_email
        this.$auth.login({
            url: '/api/v1/user_token',
            data: {
              auth: {email: this.contact_email, password: this.password}
            },
            success: function (response) {
              this.$notify({
                title: 'Succesfully signed in ' + this.contact_email,
                type: 'success',
                group: 'auth'
              })
              this.access_message = "You've succesfully logged in with the email " + this.contact_email + ", but you don't have access to this project."
              this.$store.dispatch('setToken', response.data.jwt)
              this.$store.dispatch('setContactSession')
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
