<template>
  <nav id="mobileNav" :class="{'show' : mobileNav, 'hidden' : !mobileNav}" :style="{height: topSet}">
    <router-link v-for="link in links" class="" :to="{name: link.url}" :key="link.url">{{link.name}}</router-link>
    <a href="mailto:coexdemo@gmail.com?subject=Collateral%20Express%20Contact">Contact</a>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'
import bus from '../../../../bus'

export default {
  data() {
    return {
      topSet: '0'
    }
  },
  props: ['links'],
  computed: {
    ...mapGetters(['mobileNav']),
  },
  methods: {
    getOffset() {
      var count = this.links.length
      var offset = count * 64
      return offset + 64 + 'px'
    },
    launchContact() {
      bus.$emit('contactReveal')
    }
  },
  watch: {
    mobileNav(bool) {
      if(!bool) {
        this.topSet = '0px'
      } else {
        this.topSet = this.getOffset()
      }
    }
  }
}
</script>

<style scoped lang="scss">
#mobileNav {
  width: 100%;
  position: absolute;
  z-index: 100;
  left: 0;
  background: #F1F4F6;
  transition: all 0.5s ease;
  overflow: hidden;
  top: 96px;
  a {
    display: block;
    line-height: 4rem;
    height: 4rem;
    padding: 0 1rem;
    text-transform: uppercase;
    font-family: Tele-Fet;
    letter-spacing: 2px;
    font-size: 1.25rem;
    &:hover {
      background: white;
    }
  }
}
.show {
  height: 512px;
  border-bottom: 1px solid #e2e2e2;
}
</style>
