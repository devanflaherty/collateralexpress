<template>
  <div id="login">
    <div class="row align-center">
      <div class="columns small-9">
        <h3 class="banner">Login</h3>

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

          <div class="float-input" v-if="admin">
            <FloatLabel
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

        <div class="callout alert" v-if="access_message">
          <p>
            {{access_message}}
          </p>
        </div>

      </div>
      <div class="columns small-9">
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
    </div>
  </div><!-- close login-->
</template>

<script>
  import { mapGetters } from 'vuex'

  import FloatLabel from "../floatLabel.vue"

  export default {
    name: 'login',
    components: {
      FloatLabel
    },
    props: ['project-user'],
    data() {
      return {
        loading: false,
        email: null,
        password: null,
        access_message: null,
        // True for admin, false for contact
        admin: false
      }
    },
    computed: {
      token() {
        return document.getElementsByName('csrf-token')[0].getAttribute('content')
      },
      ...mapGetters(['validUser'])
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
            this.$store.dispatch('setContactSession')

            if(this.validUser == false) {
              this.access_message = "You've succesfully logged in with the email " + this.contact_email + ", but you don't have access to this project."
            }
          },
          error: function (error) {
            if(this.admin) {
              this.$notify({
                title: 'Error signing in ' + this.email,
                text: 'We could not validate your given email and password. <br>Please try again.',
                type: 'alert',
                group: 'auth'
              })
            } else {
              this.$notify({
                title: 'Error signing in ' + this.email,
                text: 'We could not find a contact with that email.',
                type: 'alert',
                group: 'auth'
              })
            }
          },
          redirect: this.$route.path,
          rememberMe: true,
        });
      }
    }
  }
</script>
