<template>
  <div>
    <toggle class="hide-for-medium"></toggle>
    <MobileNav :links="links" class="hide-for-medium"></MobileNav>
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
    return {}
  }
}
</script>

<style scoped lang="scss">
  p {
    font-size: 12em;
    text-align: center;
  }
</style>
