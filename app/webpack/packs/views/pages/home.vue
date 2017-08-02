<template>
  <div id="home" v-once>

    <HeroHeader>
      <div class="rellax-image" style="background-image: url(http://collateralexpress.s3.amazonaws.com/img/welcome-hero.png)"></div>
    </HeroHeader>

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
                <a href="#" class="button hollow">Go to Brand Muscle</a>
              </div>
          </div>
        </div>
      </div>
    </section>

    <hr class="show-for-medium no-margin">

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
  components: {
    HeroHeader
  },
  data() {
    return {}
  },
}

</script>
