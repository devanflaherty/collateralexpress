<template>
  <header>
    <links :links="links"></links>
    <toggle></toggle>
    <p @click="showme()">{{ message }}</p>
  </header>
</template>

<script>
import Axios from "axios"
import Toggle from './navToggle.vue'
import Links from './links.vue'


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
    Axios.get('/application.json')
      .then( response => {
        vm.links = response.data;
      })
  },
  components: {
    Toggle,
    Links
  },
  methods: {
    showme() {
      console.log(this.doit);
    }
  }
}
</script>

<style scoped>
  p {
    font-size: 12em;
    text-align: center;
  }
</style>
