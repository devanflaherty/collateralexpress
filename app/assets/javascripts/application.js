// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require foundation-sites/dist/js/foundation
//= require swiper/dist/js/swiper.js
//= require rails-ujs
//= require turbolinks
//= require_tree .
//=
document.addEventListener("turbolinks:load", function() {
  // $(document).foundation();
  const element = document.getElementById("processSlides")
  if(element) {
    var mySwiper = new Swiper ('.swiper-container', {
      // Optional parameters
      effect: 'fade',
      speed: 1000,
      fade: {
        crossFade: false
      },
      pagination: '.swiper-pagination',
      nextButton: '.swiper-button-next',
      prevButton: '.swiper-button-prev',
      slidesPerView: 1,
      paginationClickable: true,
      parallax:true
    })

    var active = Number
    active = mySwiper.activeIndex + 1
    $("[data-key="+ active +"]").find($(".step-desc")).addClass('fade-in')

    mySwiper.on("onSlideChangeStart",(mySwiper) => {
      active = mySwiper.activeIndex + 1
      $("#stepIndex").text(active)
      $(".step-desc").removeClass('fade-in')
    });

    mySwiper.on("onSlideChangeEnd",(mySwiper) => {
      $("[data-key="+ active +"]").find($(".step-desc")).addClass('fade-in')
    });
  }
})
