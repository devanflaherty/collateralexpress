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

    <div class="callout alert" v-if="contact_id && contact_id != projectUser">
      <p>
        You've succesfully logged in as {{contact_name}}, but you don't have access to this project.
      </p>
    </div>

  </div>
</template>

<script>
  import FloatLabel from "../../floatLabel.vue"

  export default {
    name: 'ContactLogin',
    data() {
      return {
        contact_id: null,
        contact_name: null,
        contact_email: null,
        password: null
        // persistent_url: null
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
              this.contact_id = response.data.user.id
              this.contact_name = response.data.user.first_name + " " + response.data.user.last_name
              this.$store.dispatch('setToken', response.data.jwt)
              this.$store.dispatch('setContactSession', response.data.user.id)
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
