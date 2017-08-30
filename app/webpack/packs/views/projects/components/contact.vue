<template>
  <div class="row">
    <div class="columns small-order-2 large-order-1">
      <h3 class="show-for-large">Contact</h3>

      <div v-if="edit_contact || !contact.id">
        <hr class="hide-for-medium no-margin">
        <div class="float-input">
          <FloatLabel
            v-model="contact.email"
            v-if="!contact.id"
            v-validate="'required|email'"
            data-vv-name="Contact Email"
            label="Contact Email"
            :has-error="veeErrors.has('Contact Email')"
            :error-text="veeErrors.first('Contact Email')"
            ></FloatLabel>
            <div v-else class="callout">
              <span class="subheader">Contact Email</span>
              <h5 class="contact-email">{{contact.email}}</h5>
            </div>
        </div>

        <div class="row">
          <div class="columns float-input">
            <FloatLabel
              v-model="contact.first_name"
              v-validate="'required'"
              data-vv-name="First Name"
              label="First Name"
              :has-error="veeErrors.has('First Name')"
              :error-text="veeErrors.first('First Name')"></FloatLabel>
          </div>
          <div class="columns float-input">
            <FloatLabel
              v-model="contact.last_name"
              v-validate="'required'"
              data-vv-name="Last Name"
              label="Last Name"
              :has-error="veeErrors.has('Last Name')"
              :error-text="veeErrors.first('Last Name')"></FloatLabel>
          </div>
        </div>

        <div class="row">
          <div class="columns float-input small-12 medium-expand">
            <FloatLabel
              v-model="contact.phone"
              v-validate="'required'"
              data-vv-name="Phone Number"
              label="Phone Number"
              :has-error="veeErrors.has('Phone Number')"
              :error-text="veeErrors.first('Phone Number')"></FloatLabel>
          </div>
          <div class="columns float-input small-6 medium-expand">
            <FloatLabel
              v-model="contact.superior"
              data-vv-name="Superior"
              label="Superior"
              :has-error="veeErrors.has('Superior')"
              :error-text="veeErrors.first('Superior')"
              ></FloatLabel>
          </div>
          <div class="columns float-input small-6 medium-expand">
            <FloatLabel
              v-model="contact.location"
              data-vv-name="State or Region"
              label="State or Region"
              :has-error="veeErrors.has('State or Region')"
              :error-text="veeErrors.first('State or Region')"
              ></FloatLabel>
          </div>
        </div>
      </div>

      <div v-if="contact.id" class="contact-info">
        <p>A contact associated "{{contact.email}}" has been found, and saved because you have used this contact previously.</p>

        <button class="button gradient" @click.prevent="makeContactEditable(!edit_contact)">
          {{edit_contact ? "Finish Editing" : "Edit Contact"}}
        </button>
        <button class="button gradient" @click.prevent="resetContact()">
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
          <li v-if="contact.superior">
            <label>Superior</label>
            <span>{{contact.superior}}</span>
          </li>
          <li v-if="contact.location">
            <label>State or Region</label>
            <span>{{contact.location}}</span>
          </li>
        </ul>
      </div>
    </aside>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import bus from '../../../bus'
import {emitValidationErrors} from '../../shared/validation.js'
import FloatLabel from '../../shared/floatLabel.vue'

export default {
  name: 'contact',
  mixins: [emitValidationErrors],
  components: {
    FloatLabel
  },
  props: ['contactQuery'],
  data() {
    return {
      message: "",
      edit_contact: true,
    }
  },
  computed: {
    ...mapGetters(['contact', 'contacts']),
    token(){
      return document.getElementsByName('csrf-token')[0].getAttribute('content')
    }
  },
  watch: {
    'contact.email': function(newEmail, oldEmail) {
      if(newEmail != oldEmail && this.contact.email != null) {
        this.findContact(newEmail)
      }
      this.fetchContact()
    },
    contactQuery() {
      if (this.contactQuery != null) {
        this.fetchContact()
      }
    }
  },
  methods: {
    //form methods
    makeContactEditable(bool) {
      this.edit_contact = bool
    },


    //contact methods
    postContact(id) {
      // Set Default Password for contact
      var contactUser = {...this.contact}
      contactUser.password = this.contact.email
      contactUser.password_confirmation = this.contact.email

      var axiosConfig = {
        utf8 : "✓",
        authenticity_token: this.token,
        contact : contactUser,
        project : this.projectId
      }
      if(!id || id == null || id == undefined) {
        // If contact doesn't exist
        this.axios.post('/api/v1/contacts/', axiosConfig)
        .then(response => {
          // IF SUCCESFUll
          this.$emit("contactEmit", response.data.contact)
          this.$notify({
            title: response.data.contact.first_name + " created"
          })
          bus.$emit('submitProjectForm', response.data.contact.id)

          if(!this.$auth.check()) {
            this.loginContact()
          }
        })
      } else if (id) {
        //If contact exists
        this.axios.patch('/api/v1/contacts/' + id, axiosConfig)
        .then(response => {
          // IF SUCCESFUll
          this.$emit("contactEmit", response.data.contact)
          this.$notify({
            title: response.data.contact.first_name + " updated"
          })
          bus.$emit('submitProjectForm', response.data.contact.id)

          if(!this.$auth.check()) {
            this.loginContact()
          }
        })
      }
    },


    fetchContact() {
      if(this.contactQuery != null) {
        this.axios.get('/api/v1/contacts/' + this.contactQuery  + '.json')
        .then( response => {
          this.$store.dispatch('setContact', response.data)
          this.makeContactEditable(false)
        })
        .catch(error => {
          console.log(error)
        })
      }
    },


    findContact(email) {
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
            this.$store.dispatch('setContactProperty', ['id', c.id])
            this.$emit("contactEmit", {id: c.id})
            this.makeContactEditable(false)
          }
        })

        this.fetchContact()
      }
    },


    resetContact() {
      this.$emit('contactEmit', {id: null})
      this.$store.dispatch({
        type: 'setContactProperty',
        contact: {
          email: null,
          id: null,
          first_name: null,
          full_name: null,
          last_name: null,
          phone: null,
          location: null
        }
      })
      this.makeContactEditable(true)
    },


    loginContact() {
      this.$auth.login({
        url: '/api/v1/user_token',
        data: {
          auth: {email: this.contact.email, password: this.contact.email}
        },
        success: function (response) {
          this.$notify({
            title: 'Succesfully signed in ' + this.email,
            type: 'success',
            group: 'auth'
          })
          this.$store.dispatch('setToken', response.data.jwt)
          this.$store.dispatch('setContactSession')
        },
        error: function (error) {
          this.$notify({
            title: 'Error signing in ' + this.email,
            text: 'We could not find a contact with that email.',
            type: 'alert',
            group: 'auth'
          })
        },
        redirect: this.$route.path,
        rememberMe: false,
      });
    }
  },
  created() {
    // Form contacts array with all contacts on creation
    this.axios.get('/api/v1/contacts.json').then( response => {
      this.$store.dispatch('setContacts', response.data.contact)
    })

    this.fetchContact()
  },
  mounted() {
    bus.$on('postContact', (id) => {
      this.postContact(id)
    })
  },
  beforeDestroy() {
    bus.$off('postContact')
  }
}
</script>

<style scoped lang="scss">

</style>