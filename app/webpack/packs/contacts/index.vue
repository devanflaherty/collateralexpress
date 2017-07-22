<template>
  <section id="contactApp">
    <transition name="fade" appear>
      <div class="row">
        <div class="columns">
          <h2>Edit {{full_name}}</h2>

          <button @click="clearCookie" class="button alert">Logout</button>

          <form v-on:submit.prevent="onSubmit" id="form">
            <div class="float-input">
              <FloatLabel
                :attr="contact.email"
                obj="contact"
                label="Contact Email"
                propKey="email"
                validation="required|email"></FloatLabel>
              <span v-show="veeErrors.has('email')">{{ veeErrors.first('email') }}</span>
            </div>

            <div class="row">
              <div class="columns">
                <div class="float-input">
                  <FloatLabel
                    :attr="contact.first_name"
                    obj="contact"
                    label="First Name"
                    propKey="first_name"
                    validation="required"></FloatLabel>
                  <span v-show="veeErrors.has('first_name')">{{ veeErrors.first('first_name') }}</span>
                </div>
              </div>
              <div class="columns">
                <div class="float-input">
                  <FloatLabel
                    :attr="contact.last_name"
                    obj="contact"
                    label="Last Name"
                    propKey="last_name"
                    validation="required"></FloatLabel>
                  <span v-show="veeErrors.has('last_name')">{{ veeErrors.first('last_name') }}</span>
                </div>
              </div>
            </div>

            <div class="float-input">
              <FloatLabel
                :attr="contact.phone"
                obj="contact"
                label="Phone Number"
                propKey="phone"
                validation="required"></FloatLabel>
              <span v-show="veeErrors.has('phone')">{{ veeErrors.first('phone') }}</span>
            </div>

            <div class="row">
              <div class="columns">
                <div class="float-input">
                  <FloatLabel
                    :attr="contact.position"
                    obj="contact"
                    label="T Mobile Position"
                    propKey="position"
                    validation=""></FloatLabel>
                  <!-- <span v-show="veeErrors.has('position')">{{ veeErrors.first('position') }}</span> -->
                </div>
              </div>
              <div class="columns">
                <div class="float-input">
                  <FloatLabel
                    :attr="contact.branch"
                    obj="contact"
                    label="T Mobile Branch"
                    propKey="branch"
                    validation=""></FloatLabel>
                  <!-- <span v-show="veeErrors.has('branch')">{{ veeErrors.first('branch') }}</span> -->
                </div>
              </div>
            </div>

            <div class="fieldset">
              <span v-show="veeErrors.any()">Make sure all required fields have filled out.</span>
              <input type="submit" value="Submit" :disabled="veeErrors.any()" class="button expanded">
            </div>
          </form>
        </div>
      </div>
    </transition>

    <notifications />

    <Reveal
      :reveal="reveal"
      :flash="flash">
    </Reveal>
  </section>
</template>

<script>
import bus from "../bus"
import Axios from "axios"

import { onValidation } from '../shared/validation'
import FloatLabel from "../shared/floatLabel.vue"
import Reveal from "../shared/reveal.vue"

let token = document.getElementsByName('csrf-token')[0].getAttribute('content')
Axios.defaults.headers.common['X-CSRF-Token'] = token
Axios.defaults.headers.common['Accept'] = 'application/json'

export default {
  name: 'Contact_Form',
  mixins: [onValidation],
  components: {
    Reveal,
    FloatLabel
  },
  props: ['contact', 'full_name'],
  data() {
    return {
      page_title: "Contact",
      message: "Update Form",
      flash: "",
      reveal: {
        type: null,
        title: null,
        msg: null
      },
      auth: null,
    }
  },
  computed: {
    token() {
      return document.getElementsByName('csrf-token')[0].getAttribute('content')
    },
    contactSession() {
      var cid = this.getCookie('current_contact_id')
      if (cid) {
        return parseInt(cid)
      } else {
        return null
      }
    }
  },
  watch: {
    flash: function(flash) {
      this.$notify({
        title: this.flash
      })
    }
  },
  methods: {
    clearCookie() {
      Axios.post('/contacts/clear')
        .then( response => {
          console.log("cleared contact")
          window.location.href = "/"
        }).catch(error => {
          console.log(error)
        })
    },
    updateMessage(message) {
      this.message = message
    },
    updateFlash(flash) {
      this.flash = flash
    },
    showReveal(type) {
      $('#reveal').foundation('open');
    },
    getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
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
          Axios.post('/contacts/', axiosConfig)
          .then(function (response) {
            // IF SUCCESFUll
            bus.$emit('messageEmit', vm.full_name + " has been saved!")
            bus.$emit('showReveal','contact', response.data.full_name, 'congratulations, you just created a contact.', vm.contact.id);

            bus.$emit('flashEmit', response.data.flash[0][1])
          })
          .catch(function (error) {
            // IF THERE ARE ERRORS
            bus.$emit('showReveal','error', vm.full_name, 'error.message');
          });
        } else {
          // ** If the project does exist let's update it
          Axios.patch('/contacts/' + this.contact.id, axiosConfig)
          .then(function (response) {
            bus.$emit('messageEmit', vm.full_name + " has been updated!")
            // And then we will launch the Foundation Reveal
            bus.$emit('showReveal','update', vm.full_name, 'congratulations, you just updated your contact.', vm.contact.id);

            bus.$emit('flashEmit', response.data.flash[0][1])
          })
          .catch(function (error) {
            // If there is an error we show the Foundation Reveal
            console.log(vm.contact)
            bus.$emit('showReveal','error', vm.full_name, error.message);
            // and run our error function
          });
        }
      } // validate end
    },
  },
  mounted() {
    //Listen on the bus for changers to the child components error bag and merge in/remove errors
    bus.$on('messageEmit', (msg) => {
      this.updateMessage(msg)
    })
    bus.$on('flashEmit', (flash) => {
      this.updateFlash(flash)
    })
    bus.$on('showReveal', (type, title, msg, pid) => {
      this.reveal.type = type
      this.reveal.title = title
      this.reveal.msg = msg
      this.reveal.project_id = pid
      this.showReveal()
    });

    bus.$on('contactPropSet', (key, val) => {
      this.$set(this.contact, key, val)
    })

    // Validation listeners are in onValidation Mixin
  },
  created() {
    document.title = "Edit " + this.contact.full_name + " | Collateral Express"
  },
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
