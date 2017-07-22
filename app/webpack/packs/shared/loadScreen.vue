<template>
  <div class="overlay flex align-center align-middle">
    <div class="flex align-center align-middle">
      <h2>Loading</h2>
    </div>
  </div>
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
  height: 100%;
  transition: all 1s 0.5s ease;
}
</style>
