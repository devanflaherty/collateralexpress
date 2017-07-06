<template>
  <header>
    <div class="row">
      <div class="columns">
        <a href="/" id="logo"><img src="/assets/logo.png"></a>
      </div>
      <div class="small-9 columns" id="navBar">
        <links :links="links" class="show-for-medium"></links>
        <toggle class="hide-for-medium"></toggle>
      </div>
    </div>

    <!-- <mobileNav :links="links" class="hide-for-medium"></mobileNav> -->
  </header>
</template>

<script>
import Axios from "axios"
import Toggle from './components/navToggle.vue'
import Links from './components/links.vue'


export default {
  name: 'header',
  data() {
    return {
      message: "hello",
      links: []
    }
  },
  created() {
    var vm = this;
    Axios.get('/api/v1/application.json')
      .then( response => {
        vm.links = response.data;
      })
  },
  components: {
    Toggle,
    Links
  },
  methods: {}
}
</script>

<style scoped lang="scss">

  p {
    font-size: 12em;
    text-align: center;
  }
</style>
