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
    mounted() {
      // Open contact modal if route name is equal to contact
      if(this.$route.name == 'contact' || this.$route.query.contact == 'true') {
        $('#contactReveal').foundation('open');
      }
      
      // Open contact Modal on emit
      bus.$on('contactReveal', () => {
        $('#contactReveal').foundation('open');
      });
    }
  }
</script>

<style scoped lang="scss">
</style>
