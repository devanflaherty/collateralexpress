/* eslint no-console: 0 */
// Run this example by adding <%= javascript_pack_tag 'hello_vue' %> and
// <%= stylesheet_pack_tag 'hello_vue' %> to the head of your layout file,
// like app/views/layouts/application.html.erb.
// All it does is render <div>Hello Vue</div> at the bottom of the page.

import Vue from 'vue'
import VeeValidate from 'vee-validate';

const veeConfig = {
  errorBagName: 'veeErrors',
}

Vue.use(VeeValidate, veeConfig);

import TurbolinksAdapter from 'vue-turbolinks';

import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon.vue'
Vue.component('icon', Icon)

import Notifications from 'vue-notification'
Vue.use(Notifications)

import LoadScreen from '../shared/loadScreen.vue'
Vue.component('LoadScreen', LoadScreen)

// Components
import ContactApp from './index.vue'

document.addEventListener('turbolinks:load', () => {
//document.addEventListener('DOMContentLoaded', () => {
  const element = document.getElementById("contactApp")
  var props = ""
  if (element) {
    props = JSON.parse(element.getAttribute('data'))
  }
  if (element != null && props != null) {
    var contactApp = new Vue({
      el: '#contactApp',
      render: h => h(ContactApp, { props }),
      mixins: [TurbolinksAdapter],
    });
  }
});
