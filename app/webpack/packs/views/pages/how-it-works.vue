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
          <h4>Why Collateral Express</h4>
          <h3 class="banner">Keep it on track.</h3>
          <p>
            The idea’s to give you one place where you can request projects and they’re automatically taken care of and easily trackable. Request a project here through Collateral Express, and you know it’s in the right hands and will get done—on-time and on-target.
          </p>
        </div>

        <div class="columns small-11 medium-5 medium-offset-1">
          <div style="margin-top:4rem" class="hide-for-medium"></div>
          <h4>You got this</h4>
          <h3 class="banner">It’s not that different</h3>
          <p>
            With a small change to how you submit jobs, you get more control and more insight into what’s going on. All we ask is you have the information we need to complete it for you.
          </p>
          <p>
            Once we’ve received your project and given the go-ahead, you’ll get an Estimated Time of Delivery (EDT) and any follow-up questions from the project manager.
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
                      Go to Brand Muscle<br>
                      <strong>for inspiration</strong>
                    </p>
                  </blockquote>
                  <p class="step-desc" style="margin-left:2rem;">
                    Whether you're doing email, direct mail, flyers, or brochures, you’ll find all kinds of great marketing materials to use as a starting place.
                  </p>
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
                      Bring your genius to us<br>
                      <strong>at Collateral Express.</strong>
                    </p>
                  </blockquote>
                  <p class="step-desc">Complete the Project Request Form. We’ve designed it to communicate everything needed to complete your project.</p>
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
                      Relax and watch the magic happen.
                    </p>
                  </blockquote>
                  <p class="step-desc" style="width: 320px; margin-left: 2rem">We may have follow up questions for you—so don’t be surprised if we contact you after you get approval.</p>
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
        <h2>Start Here</h2>
      </div>

      <div class="can-do-cards row align-center">
        <div class="can-do-col">
          <div class="card space-between">
            <div class="can-do-image">
              <img src="/assets/icons/search.png" >
            </div>
            <p>
              Find an exisiting asset to help communicate the direction of your project request, include the link or file on the project request form.
            </p>
            <div class="can-do-buttons">
              <a href="#" class="expanded button hollow">
                Brand Muscle
              </a>
            </div>
          </div>
        </div>

        <div class="can-do-col">
          <router-link :to="{ name: 'new'}">
            <div id="projectCard" class="card primary-bg no-border text-center contrast-text">
              <div class="can-do-image">
                <img src="/assets/marketing/phone.png" >
              </div>
              <div>
                <h4>Project Requests</h4>
                <span>Request, Check-In, Complete</span>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </section>

  </div>
</template>

<script>
import HeroHeader from "../shared/heroHeader.vue"

import Swiper from 'swiper/dist/js/swiper.min.js'
export default {
  name: 'Home',
  metaInfo() {
    return {
      title: this.$route.meta.title
    }
  },
  components: {
    HeroHeader
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
