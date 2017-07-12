<template>
  <div>
    <div v-if="contactId">
      <p>
        We have found a contact associated to the email address, "{{contact.email}}".
        To create a new contact just change the email address and fill in your contact credentials.
      </p>
      <p>
        To modify this contact's info click the button below.
      </p>
    </div>
    <input
      v-model.lazy="contact.email"
      v-validate="'required|email'"
      name="email"
      type="text">
    <span v-show="veeErrors.has('email')">{{ veeErrors.first('email') }}</span>

    <div v-if="edit_contact || !contactId">
      <input v-model="contact.first_name" type="text">
      <input v-model="contact.last_name" type="text">
      <div class="callout" v-if="message">
        <h4>{{message}}</h4>
      </div>
    </div>

    <div v-else>
      <h5>{{contact.first_name}} {{contact.last_name}}</h5>
      <p>
        {{contact.phone}}<br>
        {{contact.branch}}<br>
      </p>
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
      edit_contact: true,
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
    makeContactEditable(bool) {
      this.edit_contact = bool
    },
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
    resetContact() {
      console.log('reset')
      this.contact = {
        id: '',
        email: '',
        first_name: '',
        last_name: ''
      }
    },
    mountContact(id) {
      var vm = this

      if(this.contactId != null) {
        Axios.get('/api/v1/contacts/' + this.contactId  + '.json')
          .then( response => {
            vm.contact = response.data
            vm.makeContactEditable(false)
          })
        }
    },
    findContact(email) {
      var vm = this;
      var found = false
      if (this.contact.email.indexOf('@') === -1) {
        this.message = 'Not a valid email'
        this.resetContact()
      } else {
        this.message = ''
        // Find contact in this.contacts array that was formed on creation
        // Will find contact based on email entered in watched input
        // Once it has been found it will emit an update to the contact_id

        var foundContact = {}
        this.contacts.find(c => {
          if (c.email == email) {
            this.contact.id = c.id
            this.$emit("contactEmit", this.contact)
            this.makeContactEditable(false)
            foundContact = this.contact
          }
        })
        console.log(foundContact)

        if(foundContact.id == null) {
          this.resetContact()
        }
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

<style scoped lang="scss">

</style>
