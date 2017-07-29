<template>
  <div class="row">
    <div class="columns small-order-2 large-order-1">
      <h3 class="show-for-large">Contact</h3>

      <div v-if="edit_contact || !contact.id">
        <hr class="hide-for-medium no-margin">
        <div class="float-input">
          <FloatLabel
            v-if="!contact.id"
            v-validate="'required|email'"
            data-vv-value-path="model"
            data-vv-name="Contact Email"
            label="Contact Email"
            :has-error="veeErrors.has('Contact Email')"
            :error-text="veeErrors.first('Contact Email')"
            :attr="contact.email"
            propKey="email"
            obj="contact"></FloatLabel>
            <div v-else class="callout">
              <span class="subheader">Contact Email</span>
              <h5 class="contact-email">{{contact.email}}</h5>
            </div>
        </div>

        <div class="row">
          <div class="columns float-input">
            <FloatLabel
              v-validate="'required'"
              data-vv-value-path="model"
              data-vv-name="First Name"
              label="First Name"
              :has-error="veeErrors.has('First Name')"
              :error-text="veeErrors.first('First Name')"
              :attr="contact.first_name"
              propKey="first_name"
              obj="contact"></FloatLabel>
          </div>
          <div class="columns float-input">
            <FloatLabel
              v-validate="'required'"
              data-vv-value-path="model"
              data-vv-name="Last Name"
              label="Last Name"
              :has-error="veeErrors.has('Last Name')"
              :error-text="veeErrors.first('Last Name')"
              :attr="contact.last_name"
              propKey="last_name"
              obj="contact"></FloatLabel>
          </div>
        </div>

        <div class="row">
          <div class="columns float-input">
            <FloatLabel
              v-validate="'required'"
              data-vv-value-path="model"
              data-vv-name="Phone Number"
              label="Phone Number"
              :has-error="veeErrors.has('Phone Number')"
              :error-text="veeErrors.first('Phone Number')"
              :attr="contact.phone"
              propKey="phone"
              obj="contact"></FloatLabel>
          </div>
          <div class="columns float-input">
            <FloatLabel
              v-validate=""
              data-vv-value-path="model"
              data-vv-name="Location"
              label="Location"
              :has-error="veeErrors.has('Location')"
              :error-text="veeErrors.first('Location')"
              :attr="contact.branch"
              propKey="branch"
              obj="contact"></FloatLabel>
          </div>
        </div>
      </div>

      <div v-if="contact.id" class="contact-info">
        <p>A contact associated "{{contact.email}}" has been found, and saved because you have used this contact previously.</p>

        <button class="button gradient" @click.prevent="makeContactEditable(!edit_contact)">
          {{edit_contact ? "Finish Editing" : "Edit Contact"}}
        </button>
        <button class="button gradient" @click.prevent="resetContact(true)">
          New Contact
        </button>
      </div>

      <span class="errors" v-if="message">{{message}}</span>

    </div>

    <aside id="contactCard" class="columns small-12 large-6 small-order-1 large-order-2">
      <h3 class="hide-for-large">Contact</h3>
      <div class="contact-help" v-if="edit_contact && !contact.id">
        <h5>Stay Connected</h5>
        <p>Your contact info will allow us to communicate with you when the status of your project has changed,
          make sure you are using a real '@tmobile.com' address that you have access to.</p>
        <h5>Use a previously created contact</h5>
        <p>If you have created a contact on a previous 'Project Request' just type the email of that contact in the form and we'll find it for you.</p>
        <p>It's that easy!</p>
      </div>
      <div class="contact-help" v-if="edit_contact && contact.id">
        <h5>Edit Contact</h5>
        <p>Make changes to the form to the left to update your contact info.</p>
        <h5>Need to change an email?</h5>
        <p>Your contact email can not be modified once ot has been saved to a contact. To associate a new email adress to your contact you'll need to select the 'New Contact' button.</p>
      </div>
      <div class="callout" v-if="!edit_contact">
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
            <label>Location</label>
            <span>{{contact.branch}}</span>
          </li>
        </ul>
      </div>
    </aside>

  </div>
</template>

<script>
import bus from '../../../../bus'
import {emitValidationErrors} from '../../../shared/validation.js'
import FloatLabel from '../../../shared/floatLabel.vue'
import Axios from "axios"

let token = document.getElementsByName('csrf-token')[0].getAttribute('content')
Axios.defaults.headers.common['X-CSRF-Token'] = token
Axios.defaults.headers.common['Accept'] = 'application/json'

export default {
  name: 'contact',
  mixins: [emitValidationErrors],
  components: {
    FloatLabel
  },
  props: ['contactQuery', 'projectId', 'token'],
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
        branch: ''
      },
      contacts: [],
    }
  },
  watch: {
    'contact.email': function(newEmail, oldEmail) {
      if(newEmail != oldEmail && this.contact.email != null) {
        this.findContact(newEmail)
      }
      this.mountContact()
    },
    contactQuery() {
      if (this.contactQuery != null) {
        this.mountContact()
      }
    }
  },
  methods: {
    //form methods
    makeContactEditable(bool) {
      this.edit_contact = bool
    },
    //contact methods
    manageContact(id) {
      var vm = this
      var axiosConfig = {
        utf8 : "✓",
        authenticity_token: token,
        contact : vm.contact,
        project : vm.projectId
      }
      if(!id || id == null || id == undefined) {
        // If contact doesn't exist
        Axios.post('/contacts/', axiosConfig)
        .then(function (response) {
          // IF SUCCESFUll
          vm.$emit("contactEmit", response.data.contact)
          vm.$notify({
            title: response.data.contact.first_name + " created"
          })
          bus.$emit('submitProjectForm', response.data.contact.id)
        })
      } else if (id) {
        //If contact exists
        Axios.patch('/contacts/' + id, axiosConfig)
        .then(function (response) {
          // IF SUCCESFUll
          vm.$emit("contactEmit", response.data.contact)
          vm.$notify({
            title: response.data.contact.first_name + " updated"
          })
          bus.$emit('submitProjectForm', response.data.contact.id)
        })
      }
    },
    mountContact() {
      var vm = this
      if(this.contactQuery != null) {
        Axios.get('/api/v1/contacts/' + this.contactQuery  + '.json')
        .then( response => {
          vm.contact = response.data
          vm.makeContactEditable(false)
        })
        .catch(error => {
          console.log(error)
        })
      }
    },
    findContact(email) {
      var vm = this;
      var found = false
      if (this.contact.email && this.contact.email.indexOf('@') === -1 && this.contact.email.length > 1) {
        this.message = 'Please enter a valid email address'
      } else if (this.contactQuery == null) {
        this.message = ''
        // Find contact in this.contacts array that was formed on creation
        // Will find contact based on email entered in watched input
        // Once it has been found it will emit an update to the contact_id

        this.contacts.find(c => {
          if (c.email == email) {
            console.log('find contact ' + email)
            this.contact.id = c.id
            this.$emit("contactEmit", {id: c.id})
            this.makeContactEditable(false)
          }
        })

        this.mountContact()
      }
    },
    resetContact(totalReset) {
      if(totalReset) {
        console.log('reset')
        this.contact.email = null
        this.$emit('contactEmit', {id: null})
      }
      this.contact.id = ''
      this.contact.first_name = ''
      this.contact.full_name = ''
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
    // this.mountContact()

    bus.$on('contactPropSet', (key, val) => {
      this.$set(this.contact, key, val)
    })

    bus.$on('postContact', (id) => {
      this.manageContact(id)
    })
  },
  beforeRouteEnter(to,from,next) {
    next(vm => {
      vm.mountContact()
    })
  },
  beforeRouteUpdate (to, from, next) {
    this.mountContact()
    next()
  },
  beforeDestroy() {
    bus.$off('contactPropSet')
    bus.$off('postContact')
  }
}
</script>

<style scoped lang="scss">

</style>
