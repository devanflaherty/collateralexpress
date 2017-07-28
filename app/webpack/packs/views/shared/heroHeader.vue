<template>
  <section id="heroHeader" class="cover" :style="'background-image: url(' + image + ')'">
    <div class="overlay"></div>
    <div class="row align-middle">
      <div class="column">
        <blockquote v-html="title">
        </blockquote>
      </div>
    </div>
  </section>

</template>

<script>
  export default {
    name: 'HeroHeader',
    props: ['title','image'],
    data() {
      return {}
    }
  }
</script>

<style scoped lang="scss">
</style>
