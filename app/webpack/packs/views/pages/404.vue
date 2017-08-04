<template>
  <div id="404" v-once>
    <HeroHeader :title="'<p>Page doesn\'t exist<br><strong>404</strong></p>'" :image="'https://unsplash.it/g/1200/720'"></HeroHeader>

    <section id="copy" class="pad white-bg">
      <div class="row align-center">
        <div class="columns small-11 medium-7 text-center">
          <icon name="meh-o" style="width: auto; height: 4em;"></icon>
          <h2>The page you are looking for doesn't exist</h2>
          <p>Sadly the page you are looking for does not exist. If you came across this page while navigating the site we would love your feedback. Please email us <a href="mailto:hello@saltagency.co?subject=Collateral%20Express%20Support">here</a>, and we'll look into the issue.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import HeroHeader from "../shared/heroHeader.vue"

export default {
  name: 'fourohfour',
  metaInfo() {
    return {
      title: this.$route.meta.title
    }
  },
  components: {
    HeroHeader
  }
}

</script>
