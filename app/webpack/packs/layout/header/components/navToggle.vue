<template>
  <button id="navToggle" @click="toggle()" :class="[{ isActive: active, notActive: !active }]">
    <span></span>
    <span></span>
  </button>
</template>

<script>
export default {
  data() {
    return {
      message: "Toggle",
      active: false
    }
  },
  methods: {
    toggle() {
      this.active = !this.active;
      //console.log(this.active);
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
    z-index: 100;
    border: none;
    background: black;
    cursor: pointer;
    transition: all 0.5s ease;

    &:hover {
      box-shadow: 1px 1px 6px rgba(black, 0.1);
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
    transition: all 1s cubic-bezier(.75,0,.50, 2);
  }
  span:after, span:before {
    cursor: pointer;
    border-radius: 6px;
    height: 3px;
    width: 2rem;
    background: white;
    position: absolute;
    display: block;
    content: '';
    transition: all 1s cubic-bezier(.75,0,.50, 2);
  }
  span:before {
    top: -5px;
  }
  span:after {
    bottom: -5px;
  }
  .isActive span:after  {
    bottom: 1px;
  }
  .isActive span:before {
    top:0;
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
