<template>
  <div id="home">
    <section id="welcome">
      <div class="rellax-image" style="background-image: url(http://collateralexpress.s3.amazonaws.com/img/welcome-hero.png)"></div>
    </section>

    <section id="hero" class="full-pane-callout">
      <div class="row small-collapse">
        <div class="columns small-12 medium-6 brand-color">
          <div class="rellax-image" style="background-image: url(https://unsplash.it/g/600/900)"></div>

          <div class="hero-card-container">
            <div class="hero-card rellax"
              data-rellax-speed="1">
              <h2 class="banner white-banner">Submit a Project</h2>

              <div class="hero-copy">
                <p>Fill out a project request’s and keep up-to-date with its status until your project has been completed with your requested assets.</p>
              </div>

              <div class="hero-actions">
                <router-link :to="{name: 'new'}" class="button hollow primaryAlt">Fill out a project request</router-link>
              </div>
            </div>
          </div><!-- close card container -->
        </div>

        <div class="columns small-12 medium-6 show-for-medium">
          <div class="hero-card-container">
            <div class="hero-card rellax"
              data-rellax-speed="1">
              <h2 class="banner">How Does It Work?</h2>

              <div class="hero-copy">
                <p>Just exactly how does Collateral Express work? Well, we would love to tell you just click the links below.</p>
              </div>

              <div class="hero-actions">
                <router-link :to="{name: 'how'}" class="button hollow primaryAlt">How It Works</router-link>
                <router-link :to="{name: 'faq'}" class="button hollow primaryAlt">FAQs</router-link>
              </div>
            </div>
          </div><!-- close card container -->
        </div>
      </div>
    </section>

    <section id="homeSteps">
      <div class="row">
        <div class="column section-heading">
          <h4 class="serif">Don't Hesistate</h4>
          <h2>Live your best life now</h2>
        </div>
      </div>

      <div id="stepColumns" class="row align-center">
        <div class="step">
          <div class="card">
              <div class="step-image">
                <img src="/assets/icons/steps.png" height='40' width='174'>
              </div>
              <p>Learn what Collateral Express is and how it can it
                make your life easier.</p>
              <div class="card-buttons">
                <router-link :to="{name: 'how'}" class="button hollow">How it works</router-link>
              </div>
          </div>
        </div>
        <div class="step">
          <div class="card">
              <div class="step-image">
                <img src="/assets/icons/logo.png" heigh='62' width='134'>
              </div>
              <p>Know what you need? and when you'll need it? Fill out
                this request form and let's get started. </p>

              <div class="card-buttons">
                <router-link :to="{name: 'new'}" class="button hollow">Send Requests</router-link>
              </div>
          </div>
        </div>
        <div class="step">
          <div class="card">
              <div class="step-image">
                <img src="/assets/icons/search.png" height='70' width='80'>
              </div>
              <p>Browse existing assets and find exactly what you need.</p>

              <div class="card-buttons">
                <a href="#" class="button hollow">Go to TMAP</a><br class="show-for-large">
                <a href="#" class="button hollow">Go to Brand Muscle</a>
              </div>
          </div>
        </div>
      </div>
    </section>

    <section id="howForMobile" class="full-pane-callout hide-for-medium">

      <div class="row small-collapse">
        <div class="columns small-12">
          <div class="hero-card-container">
            <div class="hero-card">
              <h2 class="banner">How Does It Work?</h2>

              <div class="hero-copy">
                <p>Just exactly how does Collateral Express work? Well, we would love to tell you just click the links below.</p>
              </div>

              <div class="hero-actions">
                <router-link :to="{name: 'how'}" class="button hollow primaryAlt">How It Works</router-link>
                <router-link :to="{name: 'faq'}" class="button hollow primaryAlt">FAQs</router-link>
              </div>
            </div>
          </div><!-- close card container -->
        </div>
      </div>

    </section>

    <hr class="show-for-medium no-margin">

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

    <section id="assets" class="flex align-middle">
      <div class="rellax-image"
        style="background-image: url(https://unsplash.it/g/600/900)"></div>

      <div class="row align-center">
        <div class="column shrink">
          <blockquote class="white-w-magenta">
            <p>
              Thousands of assets<br>
              <strong>At your finger tips</strong>
            </p>
          </blockquote>

          <a href="#" class="button hollow">TMAP</a>
          <a href="#" class="button hollow">Brand Muscle</a>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import bus from "../../bus"
import HeroHeader from "../shared/heroHeader.vue"

export default {
  name: 'Home',
  data() {
    return {}
  },
}

</script>
