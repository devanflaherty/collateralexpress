/* eslint no-console: 0 */
// Run this example by adding <%= javascript_pack_tag 'hello_vue' %> and
// <%= stylesheet_pack_tag 'hello_vue' %> to the head of your layout file,
// like app/views/layouts/application.html.erb.
// All it does is render <div>Hello Vue</div> at the bottom of the page.

import Vue from 'vue'
import router from './router'
import {store} from './store'
import Meta from 'vue-meta'
Vue.use(Meta)

import axios from 'axios'
import VueAxios from 'vue-axios'
import VueAuth from '@websanova/vue-auth'
import AuthBearer from '@websanova/vue-auth'
Vue.router = router

const bearer = {
  request: function (req, token) {
    this.options.http._setHeaders.call(this, req, {Authorization: 'Bearer ' + token});
  },

  response: function (res) {
    var headers = this.options.http._getHeaders.call(this, res),
        token = res.request.response.jwt || res.data.jwt;
    if (token) {
      return token
    }
  }
}
function _parseData(data) {
  return data.user
}
Vue.use(VueAxios, axios)
Vue.use(VueAuth, {
    auth: bearer,
    http: require('@websanova/vue-auth/drivers/http/axios.1.x.js'),
    router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js'),
    token: [{request: 'Authorization', response: 'Authorization', authType: 'bearer', foundIn: 'header'}],
    authRedirect: {path: '/account'},
    rolesVar: 'role',
    loginData: {url: '/api/v1/user_token', redirect: '/account', fetchUser: true},
    fetchData: {url: '/api/v1/user'},
    refreshData: {enabled: false},
    parseUserData: _parseData
});


import VeeValidate from 'vee-validate';
const veeConfig = {
  errorBagName: 'veeErrors'
}

Vue.use(VeeValidate, veeConfig);

import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon.vue'
Vue.component('icon', Icon)

import VueProgressBar from 'vue-progressbar'
Vue.use(VueProgressBar, {
  color: '#EB0183',
  failedColor: 'red',
  thickness: '6px',
})

import Notifications from 'vue-notification'
Vue.use(Notifications)

import LoadScreen from './views/shared/loadScreen.vue'
Vue.component('LoadScreen', LoadScreen)

// Components
import App from './index.vue'

import AOS from "aos"
// import Rellax from "rellax"

document.addEventListener('DOMContentLoaded', () => {
  AOS.init();
  // var rellax = new Rellax('.rellax');

  const element = document.getElementById("app")
  // const props = JSON.parse(element.getAttribute('data'))
  if (element != null) {
    var VueApp = new Vue({
      el: '#app',
      router,
      store,
      render: h => h(App),
    });
  }
});
