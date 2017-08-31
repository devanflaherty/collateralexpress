<template>
  <button id="navToggle" @click="toggle()" :class="[{ isActive: mobileNav, notActive: !mobileNav }]">
    <span></span>
    <span></span>
  </button>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      message: "Toggle",
    }
  },
  computed: {
    ...mapGetters(['mobileNav']),
  },
  methods: {
    toggle() {
      this.$store.dispatch('toggleMobileNav', !this.mobileNav)
    }
  }
}
</script>

<style lang="scss" scoped>
  #navToggle {
    color: white;
    padding: 2rem 1rem;
    width: 4rem;
    height: 4rem;
    position: relative;
    z-index: 200;
    border: none;
    background: none;
    cursor: pointer;
    transition: all 0.5s ease;
    outline:none;

    &:hover {
      span:after, span:before {
        background: #EB0183;
      }
    }
  }
  .white-toggle {
    span:after, span:before {
      background: white;
    }
  }
  span {
    background-color: transparent;
    cursor: pointer;
    border-radius: 6px;
    height: 4px;
    width: 2rem;
    position: absolute;
    display: block;
    content: '';
    transition: all 1s cubic-bezier(.75,0,.50, 2), background-color .5s ease;
  }
  span:after, span:before {
    cursor: pointer;
    border-radius: 6px;
    height: 3px;
    width: 2rem;
    background: black;
    position: absolute;
    display: block;
    content: '';
    transition: all 1s cubic-bezier(.75,0,.50, 2), background-color .5s ease;
  }
  span:before {
    top: -5px;
  }
  span:after {
    bottom: -5px;
  }
  .isActive span:after  {
    bottom: 1px;
    background: #EB0183;
  }
  .isActive span:before {
    top:0;
    background: #EB0183;
  }
  .isActive span {
    background-color: transparent;
  }
  .isActive span:before {
    transform: rotate(-225deg);
  }
  .isActive span:after {
    transform: rotate(-135deg);
  }

</style>
