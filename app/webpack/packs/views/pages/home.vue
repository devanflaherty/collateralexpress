<template>
  <div id="home">

    <HeroHeader>
      <transition name="fade" in-out>
        <div key="fade" class="rellax-image fade" v-if="fadeHero" :style="'background-image: url(' + fadeHero + ')'"></div>
        <div key="hero" id="hero" class="rellax-image" v-else :style="'background-image: url(' + selectedHero + ')'"></div>
      </transition>
    </HeroHeader>

    <section v-if="$auth.check()" id="projectSelector" class="pad-small gradient-bg">
      <div class="text-center">
        <h2>Create a Project</h2>
        <p class="text-center">Select one of the options below to get started.</p>
      </div>

      <div class="select-cards row align-center align-middle" style="margin-bottom: 1rem;">
        <div class="select-col text-center">
          <router-link class="card space-between" :to="{ name: 'new', query: { type: 'existing'}}">
            <div class="select-image">
              <img src="/assets/icons/modify.png" >
            </div>
            <div>
              <h4>Modify Existing Asset</h4>
              <p>
                Share with us the existing asset and we'll make your requested modifications.
              </p>
            </div>
          </router-link>
        </div>

        <div class="select-col text-center">
          <router-link class="card space-between" :to="{ name: 'new', query: { type: 'template'}}">
            <div class="select-image">
              <img src="/assets/icons/template.png" >
            </div>
            <div>
              <h4>Create from Template</h4>
              <p>Fill us in on the details and choose from a template.</p>
            </div>
          </router-link>
        </div>
      </div>
    </section>


    <section id="homeSteps" v-if="!$auth.check()">
      <div class="row">
        <div class="column text-center" style="margin-bottom: 2rem">
          <h2>Where your success begins</h2>
        </div>
      </div>

      <div id="stepColumns" class="row align-center">
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
      </div>
    </section>

    <hr class="show-for-medium no-margin">

    <section id="assets" class="flex align-middle">
      <div class="rellax-image"
        style="background-image: url(https://unsplash.it/g/600/900)"></div>
      <div class="overlay"></div>

      <div class="row align-center">
        <div class="column shrink">
          <blockquote class="white-w-magenta">
            <p>
              Flex your<br>
              <strong>Brand Muscle</strong>
            </p>
          </blockquote>

          <p>
            First go to Brand Muscle. There you'll find examples of sales flyers, emails, brochures. Find the type of material you need then upload the PDF here to Collateral Express. We'll customize your vision to the needs you express in the Project Request Form.
          </P>
          <p>
            Can't find it on Brand Muscle?  No problem. Tell us what you need by emailing us <a href="mailto:coexdemo@gmail.com">here</a>. We'll help out in a jiff.
          </p>

          <a href="#" class="button hollow">Brand Muscle</a>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import HeroHeader from "../shared/heroHeader.vue"

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
  data() {
    return {
      selectedHero: "",
      fadeHero: "",
      heroImages: [
        "http://collateralexpress.s3.amazonaws.com/img/welcome-hero.png"
      ]
    }
  },
  created() {
    var vm = this
    if(vm.heroImages.length > 1) {
      var randomImage = Math.floor(Math.random() * vm.heroImages.length);
      this.selectedHero = this.heroImages[randomImage]

      setInterval(function() {
        vm.fadeHero = vm.selectedHero

        setTimeout(function(){
          randomImage = Math.floor(Math.random() * vm.heroImages.length);
          vm.selectedHero = vm.heroImages[randomImage]
          vm.fadeHero = null
        }, 1)

      }, 30000)
    } else {
      vm.selectedHero = vm.heroImages[0]
    }
  }
}

</script>

<style scoped lang="scss">
.fade-enter-active, .fade-leave-active {
  transition: opacity 1s ease;
}
.fade-enter, .fade-leave-to
/* .component-fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
