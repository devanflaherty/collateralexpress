import Vue from 'vue'
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
