import Swiper from "swiper/dist/js/swiper.js"

document.addEventListener("turbolinks:load", function() {
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
