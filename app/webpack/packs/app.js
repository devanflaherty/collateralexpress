import AOS from "aos"
import Rellax from "rellax"

//Vue imports
import Vue from 'vue'
import TurbolinksAdapter from 'vue-turbolinks';
import Header from './layout/header/index.vue'


document.addEventListener("turbolinks:load", function() {
  AOS.init();
  var rellax = new Rellax('.rellax');

  const toggle = document.getElementById("toggle")
  var props = ""
  if (toggle) {
    var props = JSON.parse(toggle.getAttribute('data'))
  }
  if (toggle != null && props != null) {
    const header = new Vue({
      el: '#toggle',
      render: h => h(Header, {props}),
      mixins: [TurbolinksAdapter],
    })
  }
})
