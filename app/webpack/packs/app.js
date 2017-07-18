import AOS from "aos"
import Rellax from "rellax"

//Vue imports
import Vue from 'vue'
import TurbolinksAdapter from 'vue-turbolinks';
import Header from './layout/header/index.vue'


document.addEventListener("turbolinks:load", function() {
  $(document).foundation();
  AOS.init();
  var rellax = new Rellax('.rellax');

  const navHeader = document.getElementById("toggle")
  const props = ""
  if (navHeader) {
    const props = JSON.parse(navHeader.getAttribute('data'))
  }
  if (navHeader != null && props != null) {
    const header = new Vue({
      el: '#toggle',
      render: h => h(Header, {props}),
      mixins: [TurbolinksAdapter],
    })
  }
})
