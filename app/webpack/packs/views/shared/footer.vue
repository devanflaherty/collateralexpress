<template>
  <footer>
    <div class="row expanded">
      <div class="columns">
        <p>&copy; Copyright T-Mobile Collateral Express</p>
      </div>
      <div class="columns text-right flex align-middle align-right">
        <nav id="footerNav">
          <router-link :to="{name: 'home'}">Home</router-link>
          <router-link :to="{name: 'new'}">Create Project Request</router-link>
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
  import bus from '../../bus'

  export default {
    name: 'AppFooter',
    data() {
      return {}
    },
  }
</script>

<style scoped lang="scss">
footer {
  color: #999;
  #footerNav {
   a {
     color: #999;
     margin-left: .5rem;
   }
  }
}
</style>
