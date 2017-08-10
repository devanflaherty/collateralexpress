<template>
  <div id="account" v-if="!loading">
    <div class="flex space-between">
      <div>
        <h4>Account Info</h4>
        <h2 class="banner" v-show="user.full_name">{{user.full_name}}</h2>
      </div>
    </div>
    <transition name="fade" appear>
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
    </transition>
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
      title: this.pageTitle
    }
  },
  data() {
    return {
      loading: false,
      pageTitle: ""
    }
  },
  computed: {
    ...mapGetters(['authUser', 'user']),
    token() {
      return document.getElementsByName('csrf-token')[0].getAttribute('content')
    },
  },
  watch: {
    '$route': 'fetchData',
    'authUser.id':'fetchData'
  },
  methods: {
    onSubmit: function () {
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
      this.loading = true

      if(this.$route.params.id) {
        this.setData(this.$route.params.id)
      } else if (this.$route.name == 'account' && this.authUser.id){
        this.setData(this.authUser.id)
      }
    },
    setData(id) {
      axios.get('/api/v1/users/' + id + '.json').then( response => {
        this.loading = false
        this.pageTitle = "Update " + response.data.first_name
        this.$store.dispatch('setUser', response.data)

      }).catch(error => {
        // Push to 404
        this.$router.push({ name: 'login' })
        console.log(error)
      })
    }
  },
  created() {
    this.pageTitle = this.$route.meta.title
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
