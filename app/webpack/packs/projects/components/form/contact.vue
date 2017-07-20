<template>
  <div class="row">
    <div class="columns small-12 medium-6">
      <h3>Contact</h3>

      <div v-if="edit_contact || !contact.id">
        <div class="float-input">
          <FloatLabel
            :attr="contact.email"
            obj="contact"
            label="Contact Email"
            propKey="email"
            validation=""></FloatLabel>
          <span v-show="veeErrors.has('email')">{{ veeErrors.first('email') }}</span>
        </div>

        <div class="row">
          <div class="columns float-input">
            <FloatLabel
              :attr="contact.first_name"
              obj="contact"
              label="First Name"
              propKey="first_name"
              validation=""></FloatLabel>
          </div>
          <div class="columns float-input">
            <FloatLabel
              :attr="contact.last_name"
              obj="contact"
              label="Last Name"
              propKey="last_name"
              validation=""></FloatLabel>
          </div>
        </div>

        <div class="float-input">
          <FloatLabel
            :attr="contact.phone"
            obj="contact"
            label="Phone Number"
            propKey="phone"
            validation=""></FloatLabel>
        </div>

        <div class="row">
          <div class="columns float-input">
            <FloatLabel
              :attr="contact.position"
              obj="contact"
              label="T-Mobile Position"
              propKey="position"
              validation=""></FloatLabel>
          </div>
          <div class="columns float-input">
            <FloatLabel
              :attr="contact.branch"
              obj="contact"
              label="Branch"
              propKey="branch"
              validation=""></FloatLabel>
          </div>
        </div>
      </div>

      <div v-if="contact.id" class="contact-info">
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
import {emitValidationErrors} from '../../../shared/validation.js'
import FloatLabel from '../../../shared/floatLabel.vue'
import Axios from "axios"

let token = document.getElementsByName('csrf-token')[0].getAttribute('content')
Axios.defaults.headers.common['X-CSRF-Token'] = token
Axios.defaults.headers.common['Accept'] = 'application/json'

export default {
  name: 'contact',
  mixins: ['emitValidationErrors'],
  components: {
    FloatLabel
  },
  props: ['contactQuery', 'projectId', 'contactSession'],
  data() {
    return {
      message: "",
      edit_contact: true,
      // contactQuery:null,
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
      this.$emit('contactEmit', {id: null})
      if(this.contactQuery == null) {
        this.findContact(newEmail)
      }
        // console.log('sup')
        this.mountContact()
    },
    contactQuery() {
      this.mountContact()
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
      } else {


        this.message = ''
        // Find contact in this.contacts array that was formed on creation
        // Will find contact based on email entered in watched input
        // Once it has been found it will emit an update to the contact_id

        var foundContact = {}
        this.contacts.find(c => {
          if (c.email == email) {
            console.log('wooo')
            this.contact.id = c.id
            //this.contactQuery = c.id
            this.$emit("contactEmit", {id: c.id})
            this.makeContactEditable(false)
            foundContact = this.contact
          }
        })
        console.log(foundContact)

        this.$nextTick(() => {
          if(foundContact.id == null) {
            this.resetContact()
            //this.contactQuery = null
            this.$emit("contactEmit", {id: null})
          }
        })

        this.mountContact()
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
