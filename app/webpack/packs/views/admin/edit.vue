<template>
  <div id="account" v-if="$auth.ready()">
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
            v-model="password"
            v-validate="''"
            data-vv-name="User Password"
            :has-error="veeErrors.has('User Password')"
            :error-text="veeErrors.first('User Password')"
            inputType="password"
            label="User Password"></FloatLabel>
        </div>

        <div class="float-input" v-if="password">
          <FloatLabel
            v-model="password_confirmation"
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
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import bus from "../../bus"

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
      pageTitle: "",
      password: null,
      password_confirmation: null
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
      if (this.password == null) {
        var user = this.user
      } else {
        console.log(this.password)
        var user = {...this.user, password: this.password, password_confirmation: this.password_confirmation}
      }
      if (!this.veeErrors.any()) {
        this.axios.put('/api/v1/users', {
          utf8 : "✓",
          authenticity_token: this.token,
          user: user
        })
        .then(response => {
          this.$store.dispatch({
            type: 'setFlash',
            title: response.data.flash[0][1],
            group: 'app',
            flash_type: 'success'
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
      } else if (this.$route.name == 'account' && this.$auth.check('admin')){
        this.setData(this.$auth.user().id)
      }
    },
    setData(id) {
      this.axios.get('/api/v1/users/' + id + '.json').then( response => {
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
