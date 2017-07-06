import AOS from "aos"
import Rellax from "rellax"

document.addEventListener("turbolinks:load", function() {
  $(document).foundation();
  AOS.init();
  var rellax = new Rellax('.rellax');
})
