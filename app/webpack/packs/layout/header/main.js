/* eslint no-console: 0 */
// Run this example by adding <%= javascript_pack_tag 'hello_vue' %> and
// <%= stylesheet_pack_tag 'hello_vue' %> to the head of your layout file,
// like app/views/layouts/application.html.erb.
// All it does is render <div>Hello Vue</div> at the bottom of the page.

import Vue from 'vue'
import TurbolinksAdapter from 'vue-turbolinks';

// Components
// import Toggle from './components/navToggle.vue'
import Header from './index.vue'
// import Footer from './components/footer/index.vue'

document.addEventListener('turbolinks:load', () => {
  // const header = new Vue(Header).$mount('#toggle')
  // const footer = new Vue(Footer).$mount('#footer')
  var element = document.getElementById("header")
  if (element != null) {
    const header = new Vue({
      el: '#header',
      render: h => h(Header),
      mixins: [TurbolinksAdapter],
    })
  } else {
    console.log('no header')
  }
})
