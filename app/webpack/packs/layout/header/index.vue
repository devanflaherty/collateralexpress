<template>
  <div>
    <toggle class="hide-for-medium" @toggleNav="toggleNav()"></toggle>
    <MobileNav :links="links" :toggleState="nav_visible" class="hide-for-medium"></MobileNav>
  </div>
</template>

<script>
import Axios from "axios"
import Toggle from './components/navToggle.vue'
import MobileNav from './components/mobileNav.vue'

export default {
  name: 'header',
  components: {
    Toggle,
    MobileNav
  },
  props: ['links'],
  data() {
    return {
      nav_visible: false
    }
  },
  methods: {
    toggleNav() {
      this.nav_visible = !this.nav_visible
    }
  }
}
</script>

<style scoped lang="scss">
  p {
    font-size: 12em;
    text-align: center;
  }
</style>
