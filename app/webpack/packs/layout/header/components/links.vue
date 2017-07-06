<template>
  <nav id="links">
    <a :href="link.url" v-for="link in links">{{link.name}}</a>
  </nav>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: ['links'],
}
</script>
