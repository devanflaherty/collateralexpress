<template>
  <div>
    <template v-if="title">
      <section id="heroHeader" class="cover" :class="{'authorized' : $auth.check()}" :style="'background-image: url(' + image + ')'">
        <slot></slot>
        <div class="overlay"></div>
        <div class="row align-middle" v-if="title">
          <div class="column">
            <blockquote v-html="title">
            </blockquote>
          </div>
        </div>
      </section>
    </template>
    <template v-else>
      <section id="welcome" class="cover" :class="{'authorized' : $auth.check()}" :style="'background-image: url(' + image + ')'">
        <slot></slot>
        <div class="overlay"></div>
      </section>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'HeroHeader',
    props: ['title','image'],
    data() {
      return {

      }
    }
  }
</script>

<style scoped lang="scss">
.authorized {
  margin-bottom: 0!important;
}
</style>
