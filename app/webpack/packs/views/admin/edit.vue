<template>
  <div id="account">
    <div class="flex space-between">
      <div>
        <h4>Account Info</h4>
        <h2 class="banner">{{user.full_name}}</h2>
      </div>
    </div>
    <form v-on:submit.prevent="onSubmit" id="form" class="callout">
      <div class="row">
        <div class="columns">
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
        </div>
        <div class="columns">
          <div class="float-input">
            <FloatLabel
              data-vv-value-path="model"
              data-vv-name="User Phone"
              :has-error="veeErrors.has('User Phone')"
              :error-text="veeErrors.first('User Phone')"
              :attr="user.phone"
              obj="user"
              label="User Phone"
              propKey="phone"></FloatLabel>
          </div>
        </div>
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
      </div>

      <div class="float-input">
        <FloatLabel
          v-validate="''"
          data-vv-value-path="model"
          data-vv-name="User Password"
          :has-error="veeErrors.has('User Password')"
          :error-text="veeErrors.first('User Password')"
          :attr="user.password"
          obj="user"
          inputType="password"
          label="User Password"
          propKey="password"></FloatLabel>
      </div>

      <div class="float-input" v-if="user.password">
        <FloatLabel
          v-validate="'required|confirmed:User Password'"
          data-vv-value-path="model"
          data-vv-name="Password Confirmation"
          :has-error="veeErrors.has('Password Confirmation')"
          :error-text="veeErrors.first('Password Confirmation')"
          :attr="user.password_confirmation"
          obj="user"
          inputType="password"
          label="Password Confirmation"
          propKey="password_confirmation"></FloatLabel>
      </div>

      <input type="submit" value="submit" :disabled="veeErrors.any()" class="button gradient">

    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import bus from "../../bus"
import axios from "axios"

import { onValidation } from '../shared/validation'
import FloatLabel from "../shared/floatLabel.vue"

let token = document.getElementsByName('csrf-token')[0].getAttribute('content')
axios.defaults.headers.common['X-CSRF-Token'] = token
axios.defaults.headers.common['Accept'] = 'application/json'

export default {
  name: 'Admin_Form',
  mixins: [onValidation],
  components: {
    FloatLabel
  },
  data() {
    return {
      loading: false,
      validUser: false,
      user: {
        id: null,
        first_name: null,
        last_name: null,
        full_name: null,
        email: null,
        phone: null,
        password: null,
        password_confirmation: null
      }
    }
  },
  computed: {
    ...mapGetters({
      authUser: 'authUser'
    }),
    token() {
      return document.getElementsByName('csrf-token')[0].getAttribute('content')
    },
  },
  watch: {
    '$route': 'fetchData',
    'authUser.id': function() {
      if(this.authUser.role == 'admin' && this.authUser.id) {
        this.validUser = true
        this.fetchData()
      }
    },
  },
  methods: {
    onSubmit: function () {
      var vm = this
      bus.$emit('validate'); // Validate child components
      this.$validator.validateAll(); // Validate self
      if (!this.veeErrors.any()) {
        axios.put('/users', {
          utf8 : "✓",
          authenticity_token: this.token,
          user: {
            id: this.user.id,
            email: this.user.email,
            first_name: this.user.first_name,
            last_name: this.user.last_name,
            phone: this.user.phone,
            password: this.user.password,
            password_confirmation: this.user.password_confirmation,
          }
        })
        .then(response => {
          this.$store.dispatch({
            type: 'setFlash',
            title: response.data.flash[0][1],
            group: 'app'
          })
        })
        .catch(error => {
          alert('error')
        })
      }
    },
    fetchData() {
      this.error = this.post = null
      this.loading = true
      var vm = this
      var userId = null

      if(this.$route.params.id) {
        userId = this.$route.params.id
      } else if (this.$route.name == 'account'){
        userId = this.authUser.id
      }

      if(userId) {
        axios.get('/api/v1/users/' + userId + '.json').then( response => {
          this.loading = false
          this.validUser = true
          this.user = response.data
          document.title = "Edit " + this.user.full_name + " | Collateral Express"

        }).catch(error => {
          // Push to 404
          this.$router.push({ name: 'login' })
          console.log(error)
        })
      }
    }
  },
  created() {
    this.fetchData()
  },
  mounted() {
    //Listen on the bus for changers to the child components error bag and merge in/remove errors
    bus.$on('userPropSet', (key, val) => {
      this.$set(this.user, key, val)
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
