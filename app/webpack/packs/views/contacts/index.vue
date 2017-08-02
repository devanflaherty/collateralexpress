<template>
  <section id="contactApp" class="pad">
    <div id="login" v-if="!loading && !validUser">
      <Login :project-user="contact.id"></Login>
    </div>
    <transition v-else name="fade" appear>
      <div class="row align-center">
        <div class="columns small-11 medium-9 large-6">
          <div class="flex space-between">
            <div>
              <h4 v-if="authUser.role == 'contact'">Account Info</h4>
              <h4 v-else-if="authUser.role == 'admin'">Edit Contact</h4>
              <h2 class="banner">{{contact.full_name}}</h2>
            </div>
            <button @click="clearCookie" class="self-align-bottom" v-if="authUser.role == 'contact'">Logout</button>
          </div>

          <form v-on:submit.prevent="onSubmit" id="form" class="callout">
            <div class="float-input">
              <FloatLabel
                v-validate="'required|email'"
                data-vv-value-path="model"
                data-vv-name="Contact Email"
                :has-error="veeErrors.has('Contact Email')"
                :error-text="veeErrors.first('Contact Email')"
                :attr="contact.email"
                obj="contact"
                label="Contact Email"
                propKey="email"></FloatLabel>
            </div>

            <div class="row">
              <div class="columns">
                <div class="float-input">
                  <FloatLabel
                    v-validate="'required'"
                    data-vv-value-path="model"
                    data-vv-name="First Name"
                    :has-error="veeErrors.has('First Name')"
                    :error-text="veeErrors.first('First Name')"
                    :attr="contact.first_name"
                    obj="contact"
                    label="First Name"
                    propKey="first_name"></FloatLabel>
                </div>
              </div>
              <div class="columns">
                <div class="float-input">
                  <FloatLabel
                    v-validate="'required'"
                    data-vv-value-path="model"
                    data-vv-name="Last Name"
                    :has-error="veeErrors.has('Last Name')"
                    :error-text="veeErrors.first('Last Name')"
                    :attr="contact.last_name"
                    obj="contact"
                    label="Last Name"
                    propKey="last_name"></FloatLabel>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="columns">
                <div class="float-input">
                  <FloatLabel
                    v-validate="'required'"
                    data-vv-value-path="model"
                    data-vv-name="Phone Number"
                    :has-error="veeErrors.has('Phone Number')"
                    :error-text="veeErrors.first('Phone Number')"
                    :attr="contact.phone"
                    obj="contact"
                    label="Phone Number"
                    propKey="phone"></FloatLabel>
                </div>
              </div>
              <div class="columns">
                <div class="float-input">
                  <FloatLabel
                    data-vv-value-path="model"
                    data-vv-name="Location"
                    :has-error="veeErrors.has('Location')"
                    :error-text="veeErrors.first('Location')"
                    :attr="contact.branch"
                    obj="contact"
                    label="Location"
                    propKey="branch"></FloatLabel>
                </div>
              </div>
            </div>

            <div>
              <span v-show="veeErrors.any()">Make sure all required fields have filled out.</span>
              <input type="submit" value="Update Info" :disabled="veeErrors.any()" class="button gradient expanded">
            </div>
          </form>
        </div>
      </div>
    </transition>

  </section>
</template>

<script>
import bus from "../../bus"
import axios from "axios"

import { onValidation } from '../shared/validation'
import FloatLabel from "../shared/floatLabel.vue"
import Login from "../shared/login/index.vue"

let token = document.getElementsByName('csrf-token')[0].getAttribute('content')
axios.defaults.headers.common['X-CSRF-Token'] = token
axios.defaults.headers.common['Accept'] = 'application/json'

export default {
  name: 'Contact_Form',
  mixins: [onValidation],
  components: {
    Login,
    FloatLabel
  },
  props: ['authUser'],
  data() {
    return {
      loading: false,
      validUser: false,
      contact: {
        first_name: null,
        last_name: null,
        full_name: null,
        email: null,
        phone: null,
        branch: null,
      }
    }
  },
  computed: {
    token() {
      return document.getElementsByName('csrf-token')[0].getAttribute('content')
    },
  },
  watch: {
    '$route': 'fetchData',
    'authUser.id': function(id) {
      this.fetchData()
    }
  },
  methods: {
    clearCookie() {
      axios.post('/contacts/clear')
        .then( response => {
          console.log("cleared contact")
          window.location.href = "/"
        }).catch(error => {
          console.log(error)
        })
    },
    fetchData() {
      this.error = this.post = null
      this.loading = true
      var vm = this

      if(this.$route.name == 'contact-profile') {
        if(this.authUser.role == 'contact') {
          // If they are contact show them their info
          axios.get('/api/v1/contacts/' + this.authUser.id + '.json').then( response => {
            vm.loading = false
            vm.contact = response.data

            document.title = data.contact.full_name + " | Collateral Express"
          }).catch(error => {
            // Push to 404
            vm.$router.push({ name: 'list' })
            console.log(error)
          })

        } else if (this.authUser.role == 'admin') {
          // if admin direct to their account
          this.$router.push({name: 'account'})
        } else {
          vm.loading = false
          // show login form
        }
      } else if(this.$route.name == 'contact-edit' && this.$route.params.id) {
        var cid = this.$route.params.id

        if(this.authUser.role == 'contact') {
          // If they are a contact redirect to their profile
          this.$router.push({name: 'contact-profile'})
        } else if (this.authUser.role == 'admin') {
          // If admin give them the ability to edit the contact
          axios.get('/api/v1/contacts/' + cid + '.json').then( response => {
            vm.loading = false
            vm.contact = response.data

            document.title = "Edit " + data.contact.full_name + " | Collateral Express"
          }).catch(error => {
            // Push to 404
            vm.$router.push({ name: 'list' })
            console.log(error)
          })
        } else {
          vm.loading = false
        }
      } else {
        vm.loading = false
      }
    },
    onSubmit() {
      // bus.$emit('validate'); // Validate child components
      this.$validator.validateAll(); // Validate self

      // If there are no errors
      if (!this.veeErrors.any()) {

        // Let's go on with the submission!
        // Let's set up some configurations
        var vm = this
        var axiosConfig = {
          utf8 : "✓",
          authenticity_token: vm.token,
          contact : vm.contact
        }

        if (!this.contact.id) {
          // ** if this is a new contact
          console.log('submitted')
          //** if is a new project but contact exist
          axios.post('/contacts/', axiosConfig)
          .then(function (response) {
            // IF SUCCESFUll
            bus.$emit('messageEmit', vm.contact.full_name + " has been saved!")
            bus.$emit('showReveal','contact', response.data.full_name, 'congratulations, you just created a contact.', vm.contact.id);

            bus.$emit('flashEmit', response.data.flash[0][1])
          })
          .catch(function (error) {
            // IF THERE ARE ERRORS
            bus.$emit('showReveal','error', vm.contact.full_name, 'error.message');
          });
        } else {
          // ** If the project does exist let's update it
          axios.patch('/contacts/' + this.contact.id, axiosConfig)
          .then(function (response) {
            bus.$emit('messageEmit', vm.contact.full_name + " has been updated!")
            // And then we will launch the Foundation Reveal
            bus.$emit('showReveal','update', vm.contact.full_name, 'congratulations, you just updated your contact.', vm.contact.id);

            bus.$emit('flashEmit', response.data.flash[0][1])
          })
          .catch(function (error) {
            // If there is an error we show the Foundation Reveal
            bus.$emit('showReveal','error', vm.contact.full_name, error.message);
            // and run our error function
          });
        }
      } // validate end
    },
  },
  created() {
    this.fetchData()
  },
  mounted() {
    //Listen on the bus for changers to the child components error bag and merge in/remove errors
    bus.$on('contactPropSet', (key, val) => {
      this.$set(this.contact, key, val)
    })
  }
}
</script>

<style scoped lang="scss">
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0
}
</style>
