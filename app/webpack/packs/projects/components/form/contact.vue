<template>
  <div>
    {{postTime}}
    <h3>{{contact.email}} / {{contact.id}}</h3>
    <input
      v-model.lazy="contact.email"
      v-validate="'required|email'"
      name="email"
      type="text">
    <span v-show="veeErrors.has('email')">{{ veeErrors.first('email') }}</span>

    <input v-model="contact.first_name" type="text">
    <input v-model="contact.last_name" type="text">
    <div class="callout" v-if="message">
      <h4>{{message}}</h4>
    </div>
  </div>
</template>

<script>
import { find, propEq } from 'ramda'
import bus from '../../../bus'
import Axios from "axios"

let token = document.getElementsByName('csrf-token')[0].getAttribute('content')
Axios.defaults.headers.common['X-CSRF-Token'] = token
Axios.defaults.headers.common['Accept'] = 'application/json'

export default {
  name: 'contact',
  props: ['contactId','projectId', 'postTime'],
  data() {
    return {
      message: "",
      contact: {
        id: '',
        email: null,
        first_name: '',
        last_name: ''
      },
      contacts: [],
    }
  },
  watch: {
    'contact.email': function(newEmail) {
      this.$emit("contactEmit", {id: null})
      this.findContact(newEmail)
    },
    contactId(id) {
      this.mountContact(id)
      // When contactID changes via the emit from the function findContact()
      // We will do a new json request
      // This request will pull in all the data from the selected contact
      // And will update our contact
    },
    postTime(time) {
      this.manageContact()
    },
    'veeErrors.errors': {
      handler(errors){

        bus.$emit('errors-changed', this.veeErrors)
        console.log('emited')

      },
      deep: true
    }
  },
  methods: {
    onValidate() {
      this.$validator.validateAll();
      if (this.veeErrors.any()) {
        bus.$emit('errors-changed', this.veeErrors.errors)
      }
    },
    manageContact() {
      var vm = this
      var axiosConfig = {
        utf8 : "✓",
        authenticity_token: token,
        contact : vm.contact,
        project : vm.projectId
      }

      if(this.contactId == null) {
        Axios.post('/contacts/', axiosConfig)
        .then(function (response) {
          // IF SUCCESFUll
          vm.$emit("contactEmit", response.data.contact)
          vm.$notify({
            title: response.data.contact.first_name + " created"
          })
        })
      } else {
          Axios.patch('/contacts/' + this.contact.id, axiosConfig)
          .then(function (response) {
            // IF SUCCESFUll
            vm.$emit("contactEmit", response.data.contact)
            vm.$notify({
              title: response.data.contact.first_name + " updated"
            })
          })
      }
    },
    mountContact(id) {
      var vm = this

      if(this.contactId != null) {
        Axios.get('/api/v1/contacts/' + this.contactId  + '.json')
          .then( response => {
            vm.contact = response.data
          })
        }
    },
    findContact(email) {
      var vm = this;
      var found = false
      if (this.contact.email.indexOf('@') === -1) {
        this.message = 'Not a valid email'
      } else {
        this.message = ''
        // Find contact in this.contacts array that was formed on creation
        // Will find contact based on email entered in watched input
        // Once it has been found it will emit an update to the contact_id
        this.contacts.find(c => {
          if (c.email == email) {
            this.contact.id = c.id
            this.$emit("contactEmit", this.contact)
          }
        })
      }
    }
  },
  created() {
    var vm = this;
    // Form contacts array with all contacts on creation
    Axios.get('/api/v1/contacts.json')
      .then( response => {
        vm.contacts = response.data.contact;
      })
    if(this.contactId != null){
      this.mountContact()
    }
  },
  mounted() {
    //Listen on the bus for the parent component running validation
    this.$validator.validateAll();
    bus.$on('validate', this.onValidate)
  }
}
</script>

<style scoped>

</style>
