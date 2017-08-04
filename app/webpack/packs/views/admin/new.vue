<template>
  <div id="addAccount">
    <div class="flex space-between">
      <div>
        <h2 class="banner">Add an Admin</h2>
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
import axios from "axios"

import { onValidation } from '../shared/validation'
import FloatLabel from "../shared/floatLabel.vue"

export default {
  name: 'New_Admin',
  mixins: [onValidation],
  components: {
    FloatLabel
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['authUser', 'user']),
    token() {
      return document.getElementsByName('csrf-token')[0].getAttribute('content')
    },
  },
  methods: {
    onSubmit: function () {
      bus.$emit('validate'); // Validate child components
      this.$validator.validateAll(); // Validate self
      if (!this.veeErrors.any()) {
        axios.post('/users', {
          utf8 : "✓",
          authenticity_token: this.token,
          user: this.user
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
