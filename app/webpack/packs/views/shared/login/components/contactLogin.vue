<template>
  <div>
    <input type="email" v-model="contact_email" placeholder="Enter your email here">
    <button @click="loginContact" class="button gradient">Login</button>

    <div class="callout alert" v-if="contact_id && contact_id != projectUser">
      <p>
        You've succesfully logged in as {{contact_name}}, but you don't have access to this project.
      </p>
    </div>

  </div>
</template>

<script>
  import axios from 'axios'

  let token = document.getElementsByName('csrf-token')[0].getAttribute('content')
  axios.defaults.headers.common['X-CSRF-Token'] = token
  axios.defaults.headers.common['Accept'] = 'application/json'

  export default {
    name: 'ContactLogin',
    data() {
      return {
        contact_id: null,
        contact_name: null,
        contact_email: null,
        // persistent_url: null
      }
    },
    props: ['project-user'],
    methods: {
      loginContact() {
        var vm = this
        axios.post('/contacts/login', {
          utf8 : "✓",
          authenticity_token: token,
          contact_email : this.contact_email,
          // persistent_url : this.persistent_url
        })
          .then( response => {
            vm.contact_id = response.data.contact.id
            vm.contact_name = response.data.contact.first_name + " " + response.data.contact.last_name

            vm.$store.dispatch({
              type: 'setAuth',
              id: response.data.contact.id,
              role: 'contact'
            })
            vm.$store.dispatch('setContactSession', response.data.contact.id)
            vm.$store.dispatch({
              type: 'setFlash',
              title: 'Login Status',
              text: response.data.flash[0][1],
              group: 'auth'
            })
            this.$store.dispatch('toggleLogin', false)

          }).catch(error => {
            console.log(error)
          })
      }
    }
  }
</script>

<style scoped lang="scss">
</style>
