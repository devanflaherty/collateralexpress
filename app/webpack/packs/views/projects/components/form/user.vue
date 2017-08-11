<template>
  <div>
    {{user_id}}
    <p>Full Name: {{user.full_name}}</p>
    <p>Email: {{user.email}}</p>
    <p v-if="user.phone">Phone: {{user.phone}}</p>
    <p v-if="user.location">Location: {{user.location}}</p>
    <p v-if="user.position">Position: {{user.position}}</p>

    <!-- <input v-model.lazy="user.email" type="text">

    <input v-model="user.first_name" type="text">
    <input v-model="user.last_name" type="text"> -->
  </div>
</template>

<script>
import axios from "axios"

export default {
  name: 'UserFields',
  data() {
    return {
      message: "hello",
      users: []
    }
  },
  computed: {
    user_id() {
      return this.user.id
    }
  },
  created() {
    var vm = this;
    axios.get('/api/v1/users.json')
      .then( response => {
        vm.users = response.data.user;
      })

    if (this.user.id) {
      axios.get('/api/v1/users/' + this.user.id + '.json')
        .then( response => {
          vm.user.email = response.data.email;
        })
    }
  },
  props: ['user'],
  watch: {
      'user.email': function (newEmail) {
        this.findUser(newEmail)
      }
  },
  methods: {
    findUser(email) {
      var vm = this;

      if (this.user.email.indexOf('@') === -1) {
        this.message = 'Not a valid email'
      } else {
        this.message = ''

        this.users.find(c => {
          if (c.email == email) {
            this.user.id = c.id
          }
        })
        // this.$Progress.start()
        axios.get('/api/v1/users/' + this.user.id + '.json')
          .then( response => {
            // this.$Progress.finish()
            this.user.email = response.data.email
            this.user.full_name = response.data.full_name
            this.user.first_name = response.data.first_name
            this.user.last_name = response.data.last_name
          })
      }
    }
  }
}
</script>

<style scoped>

</style>
