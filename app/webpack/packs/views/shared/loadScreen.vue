<template>
  <transition name="fade">
    <div class="overlay flex align-center align-middle">
      <div class="flex align-center align-middle">
        <h2>Loading</h2>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'LoadScreen',
    data() {
      return {}
    }
  }
</script>

<style scoped lang="scss">
.overlay {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  background: rgba(255,255,255,0.4);
  transition: all 1s 0.5s ease;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s ease;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
