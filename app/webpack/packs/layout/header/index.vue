<template>
  <div>
    <toggle class="hide-for-medium"></toggle>
    <nav class="mobileMenu" style="display:none;">
      <Links :links="links"></Links>
    </nav>
  </div>
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
