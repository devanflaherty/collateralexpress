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
  import FloatLabel from "../../floatLabel.vue"

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
      loginContact() {
        this.axios.post('/api/v1/contacts/login', {
          utf8 : "✓",
          authenticity_token: this.token,
          contact_email : this.contact_email,
          // persistent_url : this.persistent_url
        })
          .then( response => {
            this.contact_id = response.data.contact.id
            this.contact_name = response.data.contact.first_name + " " + response.data.contact.last_name

            this.$store.dispatch({
              type: 'setAuth',
              id: response.data.contact.id,
              role: 'contact'
            })
            this.$store.dispatch('setContactSession', response.data.contact.id)
            this.$store.dispatch({
              type: 'setFlash',
              title: 'Login Status',
              text: response.data.flash[0][1],
              group: 'auth'
            })

          }).catch(error => {
            console.log(error)
          })
      }
    }
  }
</script>

<style scoped lang="scss">
</style>
