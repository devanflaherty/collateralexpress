<template>
  <div>
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
  import axios from 'axios'
  import bus from '../../../../bus'

  import { onValidation } from '../../validation'
  import FloatLabel from "../../floatLabel.vue"

  export default {
    name: 'AdminLogin',
    components: {
      FloatLabel
    },
    data() {
      return {
        loading: false,
      }
    },
    computed: {
      ...mapGetters(['user']),
      token() {
        return document.getElementsByName('csrf-token')[0].getAttribute('content')
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
          vm.$store.dispatch({
            type: 'setAuth',
            id: response.data.user.id,
            role: response.data.role
          })

          vm.$store.dispatch({
            type: 'setFlash',
            title: 'Login Status',
            text: response.data.flash[0][1],
            group: 'auth'
          })
        })
        .catch(error => {
          alert('error')
        })
      }
    }
  }
</script>

<style scoped lang="scss">
</style>
