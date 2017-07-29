<template>
  <div id="login">
    <div class="row align-center">
      <div class="columns small-9">
        <h3 class="banner">Login</h3>

        <ContactLogin v-if="loginForm == false" :project-user="projectUser"></ContactLogin>
        <AdminLogin v-else></AdminLogin>

      </div>
      <div class="columns small-9">
        <hr>
        <div v-if="!loginForm">
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
  import bus from '../../../bus'

  import ContactLogin from './components/contactLogin.vue'
  import AdminLogin from './components/adminLogin.vue'

  export default {
    name: 'login',
    components: {
      AdminLogin,
      ContactLogin
    },
    data() {
      return {
        // True for admin, false for contact
        loginForm: false
      }
    },
    props: ['project-user'],
    methods: {
      switchForm() {
        this.loginForm = !this.loginForm
      }
    }
  }
</script>

<style scoped lang="scss">
</style>
