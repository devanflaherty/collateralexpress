<template>
  <section id="contactApp" class="pad">
      <div v-if="authUser.role != 'public'" class="row align-center" key="profile">
        <div class="columns small-11 medium-9 large-6">
          <div class="flex space-between">
            <div>
              <h4 v-if="roleIs('contact')">Account Info</h4>
              <h4 v-else-if="roleIs('admin')">Edit Contact</h4>
              <h2 class="banner">{{contact.full_name}}</h2>
            </div>
            <button @click="clearCookie" class="self-align-bottom" v-if="roleIs('contact')">Logout</button>
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
      <div id="login" v-else-if="!loading && authUser.role == 'public'" key="login">
        <Login :project-user="contact.id"></Login>
      </div>

  </section>
</template>

<script>
import { mapGetters } from 'vuex'
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
  data() {
    return {
      loading: true,
    }
  },
  computed: {
    ...mapGetters({
      authUser: 'authUser',
      contact: 'user',
    }),
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
    roleIs(role) {
      if(role == this.authUser.role) {
        return true
      } else {
        return false
      }
    },
    clearCookie() {
      axios.post('/contacts/clear')
        .then( response => {
          console.log("cleared contact")
          this.$router.push({name: 'home'})
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
            this.loading = false
            this.$store.dispatch('setUser', response.data)

            document.title = response.data.full_name + " | Collateral Express"
          }).catch(error => {
            // Push to 404
            this.$router.push({ name: 'list' })
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
            this.loading = false
            this.$store.dispatch('setUser', response.data)

            document.title = "Edit " +  response.data.full_name + " | Collateral Express"
          }).catch(error => {
            // Push to 404
            this.$router.push({ name: 'list' })
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
          .then(response => {
            // IF SUCCESFUll
            this.$store.dispatch('setMessage', response.data.full_name + " has been saved!")
            this.$store.dispatch({
              type: 'setReveal',
              reveal_type: 'contact',
              title: response.data.full_name,
              msg: 'congratulations, you just created a contact.',
              pid: response.data.id
            })

            this.$store.dispatch({
              type: 'setFlash',
              title:response.data.flash[0][1],
              group: 'app'
            })
          })
          .catch(error => {
            // IF THERE ARE ERRORS
            this.$store.dispatch({
              type: 'setReveal',
              reveal_type: 'error',
              msg: vm.contact.full_name,
              text: error.message
            })
          });
        } else {
          // ** If the contact does exist let's update it
          axios.patch('/contacts/' + this.contact.id, axiosConfig)
          .then(response => {
            this.$store.dispatch('setMessage', response.data.full_name + " has been saved!")

            // And then we will launch the Foundation Reveal
            this.$store.dispatch({
              type: 'setReveal',
              reveal_type: 'update',
              title: response.data.full_name,
              msg: 'congratulations, you just updated your contact.',
              pid: vm.contact.id
            })

            this.$store.dispatch({
              type: 'setFlash',
              title:response.data.flash[0][1],
              group: 'app'
            })
          })
          .catch(error => {
            // If there is an error we show the Foundation Reveal
            this.$store.dispatch({
              type: 'setReveal',
              reveal_type: 'error',
              title: vm.contact.full_name,
              msg: error.message,
            })
          })
        }
      } // validate end
    },
  },
  created() {
    this.fetchData()
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
