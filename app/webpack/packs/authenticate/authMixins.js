import bus from '../bus'
import Axios from "axios"

const AuthMixins = {
  methods: {
    authenticate() {
      var vm = this
      Axios.get('/authenticate.json')
      .then(function (response) {
        if (response.data.user.id) {
          return response.data.user.id
        } else {
          return null
        }
      }).catch(function (error) {
        return null
      })
    },
    authRequest() {
      var vm = this
      Axios.get('/authenticate.json')
      .then(function (response) {
        if (response.data.user.id) {
          next(vm => {
            bus.$emit('authEmit', response.data.user.id)
          })
        } else if (response.data.contact.id) {

        } else {
          window.location.href = "/account/login"
        }
      }).catch(function (error) {
        window.location.href = "/account/login"
      })
    }
  },
}

export default AuthMixins
