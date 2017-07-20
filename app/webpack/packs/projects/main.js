/* eslint no-console: 0 */
// Run this example by adding <%= javascript_pack_tag 'hello_vue' %> and
// <%= stylesheet_pack_tag 'hello_vue' %> to the head of your layout file,
// like app/views/layouts/application.html.erb.
// All it does is render <div>Hello Vue</div> at the bottom of the page.

import Vue from 'vue'
import router from '../router'
import VeeValidate from 'vee-validate';

const veeConfig = {
  errorBagName: 'veeErrors',
}

Vue.use(VeeValidate, veeConfig);

import TurbolinksAdapter from 'vue-turbolinks';

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

import LoadScreen from '../shared/loadScreen.vue'
Vue.component('LoadScreen', LoadScreen)

// Components
import ProjectApp from './index.vue'

document.addEventListener('turbolinks:load', () => {
//document.addEventListener('DOMContentLoaded', () => {
  const element = document.getElementById("app")
  // const props = JSON.parse(element.getAttribute('data'))
  if (element != null) {
    var projApp = new Vue({
      el: '#app',
      router,
      render: h => h(ProjectApp),
      mixins: [TurbolinksAdapter],
    });
  }
});
