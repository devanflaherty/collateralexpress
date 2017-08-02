<template>
  <div>
    <template v-if="title">
      <section id="heroHeader" class="cover" :style="'background-image: url(' + image + ')'">
        <div class="overlay"></div>
        <slot></slot>
        <div class="row align-middle" v-if="title">
          <div class="column">
            <blockquote v-html="title">
            </blockquote>
          </div>
        </div>
      </section>
    </template>
    <template v-else>
      <section id="welcome" class="cover" :style="'background-image: url(' + image + ')'">
        <div class="overlay"></div>
        <slot></slot>
      </section>
    </template>
  </div>
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
