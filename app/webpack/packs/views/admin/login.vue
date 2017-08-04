<template>
  <div id="accountLogin">
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
</template>

<script>
import { mapGetters } from 'vuex'
import bus from "../../bus"
import axios from "axios"

import { onValidation } from '../shared/validation'
import FloatLabel from "../shared/floatLabel.vue"

export default {
  name: 'Admin_Form',
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
    return {}
  },
  computed: {
    ...mapGetters({
      authUser: 'authUser',
      user: 'user'
    }),
    token() {
      return document.getElementsByName('csrf-token')[0].getAttribute('content')
    },
  },
  methods: {
    onSubmit: function () {
      axios.post('/users/sign_in', {
        utf8 : "✓",
        authenticity_token: this.token,
        user: this.user
      })
      .then(response => {
        this.$notify({
          title: 'Succesfully signed in ' + this.user.email,
          type: 'success',
          group: 'auth'
        })
        this.$router.push({name: 'list'})
      })
      .catch(error => {
        this.$notify({
          title: 'Error signing in ' + this.user.email,
          type: 'alert',
          group: 'auth'
        })
      })
    }
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
