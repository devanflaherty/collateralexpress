<template>
  <div>
    <template v-if="image">
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
      <section id="welcome" :class="{'authorized' : $auth.check()}">
        <div class="overlay"></div>
        <slot></slot>
        <div id="headline">
          <div class="hgroup">
            <img :src="headline" alt="coex headline">
            <h4 :style="titleColor">{{title}}</h4>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'HeroHeader',
    props: ['title','image', 'contrast'],
    computed: {
      headline() {
        if(this.contrast) {
          return '/assets/headline-white.png'
        } else {
          return '/assets/headline.png'
        }
      },
      titleColor() {
        if(this.contrast) {
          return 'color: white'
        } else {
          return ''
        }
      }
    }
  }
</script>

<style scoped lang="scss">
.authorized {
  margin-bottom: 0!important;
}
</style>
