<template>
  <div class="reveal" id="contactReveal" data-reveal data-animation-in="fade-in" data-animation-out="fade-out">
    <h1>Contact</h1>

    <button class="close-button" data-close aria-label="Close modal" type="button">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
</template>

<script>
  import bus from '../../bus'

  export default {
    name: 'ContactReveal',
    data() {
      return {}
    },
  }
</script>

<style scoped lang="scss">
</style>
