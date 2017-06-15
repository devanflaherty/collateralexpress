<template>
  <footer>
    <links :links="links"></links>
    <toggle></toggle>
    <p @click="showme()">{{ message }}</p>
  </footer>
</template>

<script>
import axios from "axios"
import Toggle from './navToggle.vue'
import Links from './links.vue'


export default {
  data () {
    return {
      message: "hello",
      links: []
    }
  },
  methods: {
    showme : function() {
      console.log(this.doit);
    }
  },
  created () {
    var vm = this;
    axios.get('/pages.json')
      .then(function (response) {
        console.log(response.data)
        vm.links = response.data
      })
  },
  components: {
    Toggle,
    Links
  }
}

</script>

<style scoped>
p {
  font-size: 12em;
  text-align: center;
}
</style>
