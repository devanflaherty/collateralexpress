<template>
  <div class="row">
    <div class="columns small-12 medium-6">
      <h3>Contact</h3>

      <div v-if="edit_contact || !contactId">
        <div class="float-input">
          <FloatLabel
            :attr="contact.email"
            obj="contact"
            label="Contact Email"
            propKey="email"></FloatLabel>
          <span v-show="veeErrors.has('email')">{{ veeErrors.first('email') }}</span>
        </div>

        <div class="row">
          <div class="columns float-input">
            <FloatLabel
              :attr="contact.first_name"
              obj="contact"
              label="First Name"
              propKey="first_name"></FloatLabel>
          </div>
          <div class="columns float-input">
            <FloatLabel
              :attr="contact.last_name"
              obj="contact"
              label="Last Name"
              propKey="last_name"></FloatLabel>
          </div>
        </div>

        <div class="columns float-input">
          <FloatLabel
            :attr="contact.phone"
            obj="contact"
            label="Phone Number"
            propKey="phone"></FloatLabel>
        </div>

        <div class="row">
          <div class="columns float-input">
            <FloatLabel
              :attr="contact.position"
              obj="contact"
              label="T-Mobile Position"
              propKey="position"></FloatLabel>
          </div>
          <div class="columns float-input">
            <FloatLabel
              :attr="contact.branch"
              obj="contact"
              label="Branch"
              propKey="branch"></FloatLabel>
          </div>
        </div>
      </div>

      <div v-if="contactId" class="contact-info small-12 medium-6">
        <p>A contact associated "{{contact.email}}" has been found, and saved because you have used this contact previously.</p>

        <button class="button" @click.prevent="makeContactEditable(!edit_contact)">
          {{edit_contact ? "Finish Editing" : "Edit Contact"}}
        </button>
        <button class="button" @click.prevent="resetContact(true)">
          New Contact
        </button>
      </div>

      <span class="errors" v-if="message">{{message}}</span>

    </div>

    <div id="contactCard" class="columns" v-if="!edit_contact">
      <div class="callout">
        <h4 v-if="contact.full_name">{{contact.full_name}}</h4>
        <ul>
          <li v-if="contact.email">
            <label>Email</label>
            <span>{{contact.email}}</span>
          </li>
          <li v-if="contact.phone">
            <label>Phone</label>
            <span>{{contact.phone}}</span>
          </li>
          <li v-if="contact.position">
            <label>Position</label>
            <span>{{contact.position}}</span>
          </li>
          <li v-if="contact.branch">
            <label>Branch</label>
            <span>{{contact.branch}}</span>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
import bus from '../../../bus'
import FloatLabel from './floatLabel.vue'
import Axios from "axios"

let token = document.getElementsByName('csrf-token')[0].getAttribute('content')
Axios.defaults.headers.common['X-CSRF-Token'] = token
Axios.defaults.headers.common['Accept'] = 'application/json'

export default {
  name: 'contact',
  components: {
    FloatLabel
  },
  props: ['contactId', 'projectId', 'postTime'],
  data() {
    return {
      message: "",
      edit_contact: true,
      contact: {
        id: '',
        email: null,
        first_name: '',
        last_name: '',
        phone: '',
        position: '',
        branch: ''
      },
      contacts: [],
    }
  },
  watch: {
    'contact.email': function(newEmail) {
      //this.$emit("contactEmit", {id: null})
      if(!this.contactId) {
        this.findContact(newEmail)
      }
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
    //form methods
    makeContactEditable(bool) {
      this.edit_contact = bool
    },
    onValidate() {
      this.$validator.validateAll();
      if (this.veeErrors.any()) {
        bus.$emit('errors-changed', this.veeErrors.errors)
      }
    },
    //contact methods
    manageContact() {
      var vm = this
      var axiosConfig = {
        utf8 : "✓",
        authenticity_token: token,
        contact : vm.contact,
        project : vm.projectId
      }

      if(this.contactId == null) {
        // If contact doesn't exist
        Axios.post('/contacts/', axiosConfig)
        .then(function (response) {
          // IF SUCCESFUll
          vm.$emit("contactEmit", response.data.contact)
          vm.$notify({
            title: response.data.contact.first_name + " created"
          })
        })
      } else {
        //If contact exists
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
            vm.makeContactEditable(false)
          })
        }
    },
    findContact(email) {
      var vm = this;
      var found = false
      if (this.contact.email && this.contact.email.indexOf('@') === -1 && this.contact.email.length > 1) {
        this.message = 'Please enter a valid email address'
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

        this.$nextTick(() => {
          if(foundContact.id == null) {
            this.resetContact()
          }
        })
      }
    },
    resetContact(totalReset) {
      if(totalReset) {
        this.contact.email = null
      }
      this.contact.id = ''
      this.contact.first_name = ''
      this.contact.last_name = ''
      this.contact.phone = ''
      this.contact.position = ''
      this.contact.branch = ''

      this.makeContactEditable(true)
    }
  },
  created() {
    var vm = this;
    // Form contacts array with all contacts on creation
    Axios.get('/api/v1/contacts.json')
      .then( response => {
        vm.contacts = response.data.contact;
      })

    this.mountContact()
  },
  mounted() {
    bus.$on('contactPropSet', (key, val) => {
      this.$set(this.contact, key, val)
    })

    //Listen on the bus for the parent component running validation
    this.$validator.validateAll();
    bus.$on('validate', this.onValidate)
  },
  beforeRouteUpdate (to, from, next) {
    this.mountContact()
    next()
  },
}
</script>

<style scoped lang="scss">

</style>
