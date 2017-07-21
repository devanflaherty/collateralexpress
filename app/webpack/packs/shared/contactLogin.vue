<template>
  <div class="row align-center">
    <div class="columns small-9">
      <h3 class="banner">Login</h3>
      <input type="email" v-model="contact_email" placeholder="Enter your email here">
      <button @click="loginContact" class="button gradient">Login</button>
    </div>
    <div class="columns small-9">
      <hr>
      <p>If you are an admin user click the link below to login.</p>
      <a :href="'/account/login?url=' + persistent_url">Admin Login</a>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import bus from '../bus'

  let token = document.getElementsByName('csrf-token')[0].getAttribute('content')
  axios.defaults.headers.common['X-CSRF-Token'] = token
  axios.defaults.headers.common['Accept'] = 'application/json'

  export default {
    name: 'ContactLogin',
    data() {
      return {
        contact_email: null,
        persistent_url: null
      }
    },
    methods: {
      loginContact() {
        var vm = this
        axios.post('/contacts/login', {
          utf8 : "✓",
          authenticity_token: token,
          contact_email : this.contact_email,
          persistent_url : this.persistent_url
        })
          .then( response => {
            bus.$emit('contactSessionEmit')
            console.log(response.data.flash)
            console.log(response.data.url)
            vm.$notify({
              title: response.data.flash
            })
          }).catch(error => {
            console.log(error)
          })
      }
    },
    mounted() {
      bus.$on('setRedirect', (from, to) => {
        this.persistent_url = to.path
      })
    }
  }
</script>

<style scoped lang="scss">
</style>
