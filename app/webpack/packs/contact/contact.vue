<template>
  <div id="contact">
    <ul>
      <li v-for="contact in contacts">
        {{contact.email}}
      </li>
    </ul>
    <input v-model.lazy="email">
    <button @click="findContact(email)"></button>
    {{message}}
    <h4>{{qContact.email}}</h4>
    <input v-model="qContact.first_name">
    <input v-model="qContact.last_name">

    <Project :projects="qContact.projects"></Project>
  </div>
</template>

<script>

import Axios from "axios"
import Project from "./Project.vue"

export default {
  name: 'contact',
  data() {
    return {
      message: "hello",
      contacts: [],
      qContact: {
        id: '',
        email: '',
        first_name: '',
        last_name: '',
        projects: []
      },
      email: '',
    }
  },
  created() {
    var vm = this;
    Axios.get('/api/v1/contacts.json')
      .then( response => {
        vm.contacts = response.data.contact;
      })
  },
  watch : {
    email: function (newEmail) {
      this.findContact(newEmail)
    }
  },
  components: {
    Project
  },
  methods: {
    findContact(email) {
      if (this.email.indexOf('@') === -1) {
        this.message = 'Not a valid email'
      } else {
        this.message = ''
        console.log('fire')

        this.contacts.find(c => {
          if (c.email == email) {
            this.qContact.id = c.id
          }
        })

        // Pull json only on watch function
        var vm = this
        Axios.get('/api/v1/contacts/' + vm.qContact.id + '.json')
          .then( response => {
              this.qContact.email = response.data.email
              this.qContact.first_name = response.data.first_name
              this.qContact.last_name = response.data.last_name
          })
        }
      }
    }
  }
</script>

<style scoped>
  p {
    font-size: 12em;
    text-align: center;
  }
</style>
