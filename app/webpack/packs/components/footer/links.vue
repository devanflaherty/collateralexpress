<template>
  <div id="links">
    <div v-for="link in links">
      <a :href="link.url">{{link.name}}</a>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {}
  },
  props: ['links'],
}
</script>
