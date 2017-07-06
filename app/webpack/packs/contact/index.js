/* eslint no-console: 0 */
// Run this example by adding <%= javascript_pack_tag 'hello_vue' %> and
// <%= stylesheet_pack_tag 'hello_vue' %> to the head of your layout file,
// like app/views/layouts/application.html.erb.
// All it does is render <div>Hello Vue</div> at the bottom of the page.

import Vue from 'vue'
import Contact from './contact.vue'

document.addEventListener('DOMContentLoaded', () => {
  // const header = new Vue(Header).$mount('#header')
  // const footer = new Vue(Footer).$mount('#footer')
  new Vue({
    el: '#contactList',
    render: h => h(Contact)
  })
})
