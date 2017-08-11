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
              v-model="user.email"
              v-validate="'required|email'"
              data-vv-name="User Email"
              :has-error="veeErrors.has('User Email')"
              :error-text="veeErrors.first('User Email')"
              label="User Email"></FloatLabel>
          </div>
        </div>
        <div class="columns">
          <div class="float-input">
            <FloatLabel
              v-model="user.phone"
              data-vv-name="User Phone"
              :has-error="veeErrors.has('User Phone')"
              :error-text="veeErrors.first('User Phone')"
              label="User Phone"></FloatLabel>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="columns">
          <div class="float-input">
            <FloatLabel
              v-model="user.first_name"
              v-validate="'required'"
              data-vv-name="First Name"
              :has-error="veeErrors.has('First Name')"
              :error-text="veeErrors.first('First Name')"
              label="First Name"></FloatLabel>
          </div>
        </div>
        <div class="columns">
          <div class="float-input">
            <FloatLabel
              v-model="user.last_name"
              v-validate="'required'"
              data-vv-name="Last Name"
              :has-error="veeErrors.has('Last Name')"
              :error-text="veeErrors.first('Last Name')"
              label="Last Name"></FloatLabel>
          </div>
        </div>
      </div>

      <div class="float-input">
        <FloatLabel
          v-model="user.password"
          v-validate="''"
          data-vv-name="User Password"
          :has-error="veeErrors.has('User Password')"
          :error-text="veeErrors.first('User Password')"
          inputType="password"
          label="User Password"></FloatLabel>
      </div>

      <div class="float-input" v-if="user.password">
        <FloatLabel
          v-model="user.password_confirmation"
          v-validate="'required|confirmed:User Password'"
          data-vv-name="Password Confirmation"
          :has-error="veeErrors.has('Password Confirmation')"
          :error-text="veeErrors.first('Password Confirmation')"
          inputType="password"
          label="Password Confirmation"
          ></FloatLabel>
      </div>

      <input type="submit" value="submit" :disabled="veeErrors.any()" class="button gradient">

    </form>
  </div>
</template>

<script>
import bus from '../../bus'
import { mapGetters } from 'vuex'

import { onValidation } from '../shared/validation'
import FloatLabel from "../shared/floatLabel.vue"

export default {
  name: 'New_Admin',
  mixins: [onValidation],
  components: {
    FloatLabel
  },
  metaInfo() {
    return {
      title: this.$route.meta.title
    }
  },
  data() {
    return {
      user: {
        id: null,
        email: null,
        first_name: null,
        last_name: null,
        full_name: null,
        phone: null,
        password: null,
        password_confirmation: null
      },
    }
  },
  computed: {
    ...mapGetters(['authUser']),
    token() {
      return document.getElementsByName('csrf-token')[0].getAttribute('content')
    },
  },
  methods: {
    onSubmit: function () {
      bus.$emit('validate'); // Validate child components
      this.$validator.validateAll(); // Validate self
      if (!this.veeErrors.any()) {
        this.axios.post('/api/v1/users', {
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
