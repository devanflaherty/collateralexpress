<template>
  <header id="header" :class="{'overlaid':overlay}">
    <div class="row expanded">
      <div class="columns flex align-middle">
        <router-link :to="{ name: 'home' }" id="logo">
          <img v-if="!overlay" src="/assets/logo.png">
          <img v-else src="/assets/white-logo.png">
        </router-link>
      </div>
      <div class="small-3 medium-9 columns" id="navBar">
        <nav id="links" class="show-for-navbreak">
          <router-link v-for="link in links" class="" :to="{name: link.url}" :key="link.url">{{link.name}}</router-link>
          <a href="#launchContact" @click.prevent="launchContact">Contact</a>
        </nav>
        <toggle class="hide-for-navbreak" :class="{'white-toggle': overlay}"></toggle>
        <MobileNav :links="links" class="hide-for-navbreak"></MobileNav>
      </div>
    </div>
  </header>
</template>

<script>
import { mapGetters } from 'vuex'
import bus from "../../../bus"
import Toggle from './components/navToggle.vue'
import MobileNav from './components/mobileNav.vue'

export default {
  name: 'header',
  components: {
    Toggle,
    MobileNav
  },
  data() {
    return {
      overlay: false
    }
  },
  computed: mapGetters(['links', 'navContrast']),
  watch: {
    '$route': function() {
      this.overlayHeader()
    }
  },
  methods: {
    overlayHeader() {
      if(this.$route.meta.header == true) {
        this.overlay = true
      } else {
        this.overlay = false
      }
    },
    launchContact() {
      bus.$emit('contactReveal')
    }
  },
  mounted() {
    console.log(this.navContrast)
    this.overlayHeader()
  }
}
</script>

<style scoped lang="scss">
  .contrast a {
    color: black!important
  }
  p {
    font-size: 12em;
    text-align: center;
  }
</style>
