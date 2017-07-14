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

  var navHeader = document.getElementById("toggle")
  if (navHeader != null) {
    const header = new Vue({
      el: '#toggle',
      render: h => h(Header),
      mixins: [TurbolinksAdapter],
    })
  }
})
