<template>
  <footer>
    <img src="/assets/logo.png">
    <div class="row expanded">
      <div class="columns small-12 medium-6">
        <p>&copy; Copyright T-Mobile Collateral Express</p>
      </div>
      <div id="footerWrap" class="columns small-12 medium-6 text-right">
        <nav id="footerNav">
          <router-link :to="{name: 'home'}">Home</router-link>
          <router-link :to="{name: 'how'}">How It Works</router-link>
          <router-link :to="{name: 'gallery'}">Gallery</router-link>
          <router-link :to="{name: 'faq'}">FAQ</router-link>
          <a href="#contactInfo" data-open="contact-info">Contact</a>
        </nav>
      </div>
    </div>
  </footer>
</template>

<script>
  export default {
    name: 'AppFooter',
  }
</script>

<style scoped lang="scss">
</style>
