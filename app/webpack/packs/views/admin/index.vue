<template>
  <section id="admin" class="pad">
    <div class="row align-center">
      <div class="columns small-11 medium-9 large-6">
        <div class="flex space-between">
          <div>
            <h2 class="banner">Login</h2>
          </div>
        </div>
        <form v-on:submit.prevent="onSubmit" id="form" class="callout">
          <div class="float-input">
            <FloatLabel
              v-validate="'required|email'"
              data-vv-value-path="model"
              data-vv-name="User Email"
              :has-error="veeErrors.has('User Email')"
              :error-text="veeErrors.first('User Email')"
              :attr="user.email"
              obj="user"
              label="User Email"
              propKey="email"></FloatLabel>
          </div>

          <!-- <div class="row">
            <div class="columns">
              <div class="float-input">
                <FloatLabel
                  v-validate="'required'"
                  data-vv-value-path="model"
                  data-vv-name="First Name"
                  :has-error="veeErrors.has('First Name')"
                  :error-text="veeErrors.first('First Name')"
                  :attr="user.first_name"
                  obj="user"
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
                  :attr="user.last_name"
                  obj="user"
                  label="Last Name"
                  propKey="last_name"></FloatLabel>
              </div>
            </div>
          </div> -->

          <div class="float-input">
            <FloatLabel
              v-validate="'required'"
              data-vv-value-path="model"
              data-vv-name="User Password"
              :has-error="veeErrors.has('User Password')"
              :error-text="veeErrors.first('User Password')"
              :attr="user.password"
              obj="user"
              label="User Password"
              propKey="password"></FloatLabel>
          </div>

          <input type="submit" value="submit" class="button gradient">

        </form>
      </div>
    </div>
  </section>
</template>

<script>
import bus from "../../bus"
import axios from "axios"

import { onValidation } from '../shared/validation'
import FloatLabel from "../shared/floatLabel.vue"
import ContactLogin from "../shared/contactLogin.vue"

let token = document.getElementsByName('csrf-token')[0].getAttribute('content')
axios.defaults.headers.common['X-CSRF-Token'] = token
axios.defaults.headers.common['Accept'] = 'application/json'

export default {
  name: 'Admin_Form',
  mixins: [onValidation],
  components: {
    ContactLogin,
    FloatLabel
  },
  props: ['authUser'],
  data() {
    return {
      loading: false,
      validUser: false,
      user: {
        email: null,
        password: null
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
    validUser(status) {
      if(this.validUser == true) {
      }
    }
  },
  methods: {
    onSubmit: function () {
      axios.post('/users/sign_in', {
        utf8 : "✓",
        authenticity_token: token,
        user: this.user
      })
      .then(response => {
        alert('success')
        this.$router.push({name: 'list'})
      })
      .catch(error => {
        alert('error')
      })
    }
  },
  mounted() {
    //Listen on the bus for changers to the child components error bag and merge in/remove errors
    bus.$on('userPropSet', (key, val) => {
      this.$set(this.user, key, val)
    })
  },
  // beforeRouteEnter (to,from,next) {
  //   next(vm => {
  //     if(vm.auth) {
  //       vm.$router.push({name:'list'})
  //     }
  //   })
  // }
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
