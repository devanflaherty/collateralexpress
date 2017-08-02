<template>
  <div id="how-it-works" v-once>

    <HeroHeader :title="'<p>How<br><strong>It Works</strong></p>'" :image="'https://unsplash.it/g/1200/720'"></HeroHeader>

    <section id="whyVideo" class="white-bg">
      <div class="row align-center align-middle">
        <div class="small-11 medium-4 column">
          <h3 class="banner add-tag">Why Collateral Express?</h3>
          <p>
            We want to make your lives easier, get your projects done quicker, and increase communication all around.
            'Collateral Express' allows us to do just that. Watch this video to learn more about our vision.
          </p>
        </div>

        <div class="small-11 medium-6 column">
          <div class="responsive-embed widescreen" data-aos="fade-up">
            <iframe src="https://player.vimeo.com/video/54658957" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
          </div>
        </div>
      </div>
    </section>

    <section id="copy" class="pad">
      <div class="row align-center">
        <div class="columns small-11 medium-5">
          <h3>How are we different?</h3>
          <p>
            With tools like TMAP and Brand Muscle already in your tool belt you might be wondering, “Why do I need to use Collateral Express?”, well that is a great question.
          </p>
          <p>
            Collateral Express is the go-to tool for any requesting any new projects, or requiring updates for an existing project.
          </p>
          <p>
            What that means for you is the days of shooting off an email and hoping it got in the right hands is over! Collateral Express gives you peace that your project is going through the correct steps and is added to the correct system all to help ensure it gets done in a timely and efficient manner.
          </p>
        </div>

        <div class="columns small-11 medium-5 medium-offset-1">
          <div style="margin-top:4rem" class="hide-for-medium"></div>
          <h4>What you need to know</h4>
          <p>
            Making all project requests go through a system to make your life easier will of course require some change in protocols. This is for the best!
          </p>
          <p>
            All that we ask is that you have all the information needed to help us complete your project. It really is that simple.
          </p>
          <p>
            Once your project has been received and approved, you will be informed with an ETD. Please be ready to answer any questions the project manager may have to help complete the project quickly.
          </p>
        </div>
      </div>
    </section>

    <section id="processSlides">
      <div class="step-container row">
        <div class="columns">
          <h4>Step <span id="stepIndex">1</span></h4>
        </div>
      </div>
      <div class="swiper-container">
        <!-- Additional required wrapper -->
        <div class="swiper-wrapper">
            <!-- Slides -->
            <div class="swiper-slide" data-key="1" style="background: black">
              <div class="row align-center">
                <div class="columns small-10 medium-5">
                  <blockquote data-swiper-parallax="-200">
                    <p>
                      Fill Out A<br>
                      <strong>Project Request</strong>
                    </p>
                  </blockquote>
                  <p class="step-desc" style="margin-left:2rem;">Use the form and answer all the questions to the best of your knowledge. There are a variety of fields that will help the design team to take your request, so you can relax.</p>
                </div>
                <div class="columns small-10 medium-3 show-for-medium">
                  <img src="/assets/slides/airplane.png" data-swiper-parallax="-500">
                </div>
              </div>
              <div class="hide-for-medium" style="position: absolute; opacity: 0.66; bottom: -25%;" data-swiper-parallax="-500">
                <img src="/assets/slides/airplane.png">
              </div>
            </div>

            <div class="swiper-slide gradient-bg" data-key="2">
              <div class="row align-center">
                <div class="columns small-10 medium-6">
                  <blockquote data-swiper-parallax="-200">
                    <p class="white-banner">
                      Stay connected as we<br>
                      <strong>Review, assign, and complete</strong>
                    </p>
                  </blockquote>
                  <p class="step-desc">Another description and step</p>
                </div>
                <div class="columns small-10 medium-3 show-for-medium">
                  <img src="/assets/slides/airplane.png" data-swiper-parallax="-500">
                </div>
              </div>
            </div>

            <div class="swiper-slide" data-key="3" style="background-image: url(https://unsplash.it/g/1200/720)">
              <div class="overlay"></div>
              <div class="row align-center">
                <div class="columns small-10 medium-3 show-for-medium">
                  <img src="/assets/slides/airplane.png" data-swiper-parallax="-500">
                </div>
                <div class="columns small-10 medium-7">
                  <blockquote data-swiper-parallax="-200">
                    <p class="white-banner">
                      Start using your new asset<br>
                      <strong>Project Complete</strong>
                    </p>
                  </blockquote>
                  <p class="step-desc">Another description and step</p>
                </div>
              </div>
            </div>
        </div>
        <!-- If we need pagination -->
        <div class="swiper-pagination"></div>

        <!-- If we need navigation buttons -->
        <div class="swiper-button-prev swiper-button-white show-for-medium"></div>
        <div class="swiper-button-next swiper-button-white show-for-medium"></div>
      </div>
    </section>

    <section id="canDo" class="pad">
      <div class="text-center">
        <h2>What can you do</h2>
        <p>
          Welcome to the one stop shop for your collateral needs.<br>
          The question is what can you not do?
        </p>
      </div>

      <div class="can-do-cards row align-center">
        <div class="can-do-col">
          <div class="card space-between">
            <div class="can-do-image">
              <img src="/assets/icons/search.png" >
            </div>
            <p>
              Find an exisiting asset to help communicate the direction of your project request, include the link or file  on the project request form.
            </p>
            <div class="can-do-buttons">
              <a href="#" class="expanded button hollow">
                Brand Muscle
              </a>
            </div>
          </div>
        </div>

        <div class="can-do-col">
          <div class="card primary-bg no-border text-center contrast-text">
            <div class="can-do-image">
              <img src="/assets/marketing/phone.png" >
            </div>
            <div>
              <h4>Project Requests</h4>
              <span>Request, Check-In, Complete</span>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script>
import bus from "../../bus"

import HeroHeader from "../shared/heroHeader.vue"

import Swiper from 'swiper/dist/js/swiper.min.js'
export default {
  name: 'Home',
  components: {
    HeroHeader
  },
  data() {
    return {}
  },
  mounted() {
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

      var active = Number;
      active = mySwiper.activeIndex + 1;
      $("[data-key="+ active +"]").find($(".step-desc")).addClass('fade-in');

      mySwiper.on("onSlideChangeStart",function (mySwiper) {
        active = mySwiper.activeIndex + 1;
        $("#stepIndex").text(active);
        $(".step-desc").removeClass('fade-in');
      });

      mySwiper.on("onSlideChangeEnd",function (mySwiper) {
        $("[data-key="+ active +"]").find($(".step-desc")).addClass('fade-in');
      });
    }
  }
}

</script>
