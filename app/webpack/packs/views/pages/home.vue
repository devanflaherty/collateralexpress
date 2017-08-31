<template>
  <div id="home">

    <HeroHeader title="Your tools. Your sales. Your wins." :contrast="selectedHero.contrast">
      <transition name="fade" in-out>
        <!-- <div key="fade" class="rellax-image fade" v-if="fadeHero != ''" :style="'background-image: url(' + fadeHero.image + ')'"></div> -->
        <div key="hero" id="hero" class="rellax-image" :style="'background-image: url(' + selectedHero.image + ')'"></div>
      </transition>
    </HeroHeader>

    <ProjectSelector></ProjectSelector>

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
        style="background-image: url(http://collateralexpress.s3.amazonaws.com/img/slide-3.jpg)"></div>
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
import ProjectSelector from "../projects/components/projectSelector.vue"

export default {
  name: 'Home',
  metaInfo() {
    return {
      title: this.$route.meta.title
    }
  },
  components: {
    HeroHeader,
    ProjectSelector
  },
  data() {
    return {
      selectedHero: {
        image: "",
        contrast: false
      },
      fadeHero: {
        image: "",
        contrast: false
      },
      heroImages: [
        {
          image: "http://collateralexpress.s3.amazonaws.com/img/slide-1.jpg",
          contrast: false
        },
        {
          image: "http://collateralexpress.s3.amazonaws.com/img/slide-2.jpg",
          contrast: true
        },
        {
          image: "http://collateralexpress.s3.amazonaws.com/img/slide-3.jpg",
          contrast: true
        },
        {
          image: "http://collateralexpress.s3.amazonaws.com/img/slide-4.jpg",
          contrast: true
        },
        {
          image: "http://collateralexpress.s3.amazonaws.com/img/slide-5.jpg",
          contrast: true
        },
      ]
    }
  },
  watch: {
    'selectedHero.image': function() {
      this.$store.dispatch('setNavContrast', this.selectedHero.contrast)
    }
  },
  created() {
    var vm = this
    if(vm.heroImages.length > 1) {
      var randomImage = Math.floor(Math.random() * vm.heroImages.length);
      vm.selectedHero = vm.heroImages[randomImage]
      vm.$store.dispatch('setNavContrast', this.selectedHero.contrast)
      console.log(this.selectedHero.contrast)
      // setInterval(function() {
      //   vm.fadeHero = vm.selectedHero
      //
      //   setTimeout(function(){
      //     randomImage = Math.floor(Math.random() * vm.heroImages.length);
      //     vm.selectedHero = vm.heroImages[randomImage]
      //     vm.fadeHero = ""
      //   }, 0.1)
      //
      // }, 30000)
    } else {
      vm.selectedHero = vm.heroImages[0]
    }
  },
  beforeDestroy() {
    this.$store.dispatch('setNavContrast', false)
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
