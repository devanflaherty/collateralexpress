<template>
  <section id="gallery">

    <HeroHeader
      :title="'<p>See what\'s been made<br><strong>With collateral express</strong></p>'"
      :image="'https://unsplash.it/g/1200/720'">
    </HeroHeader>

    <div class="row pad-small">
      <div class="column">
        <h2>Gallery</h2>
        <p>See what has been made through Collateral Express.</p>

        <div class="row small-up-2 medium-up-3">

          <div class="column" v-for="image in gallery">
            <div class="card gallery-card">
              <img :src="image" class="gallery-image">
              <div class="gallery-image-hover text-center">
                <icon name="arrows-alt" ></icon><br>
                <span>View Real Pixels</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<script>
import bus from "../../bus"
import HeroHeader from "../shared/heroHeader.vue"

export default {
  name: 'Gallery',
  components: {
    HeroHeader
  },
  data() {
    return {
      gallery: [
        "http://placehold.it/400x/400",
        "http://placehold.it/400x/400",
        "http://placehold.it/400x/400",
        "http://placehold.it/400x/400",
        "http://placehold.it/400x/400",
        "http://placehold.it/400x/400",
        "http://placehold.it/400x/400",
        "http://placehold.it/400x/400",
      ]
    }
  }
}

</script>

<style scoped lang="scss">
  .gallery-card {
    position: relative;
    overflow: hidden;
    &:before {
      display: block;
      content: "";
      width: 100%;
      padding-top: 3/4 * 100%;
    }
    .gallery-image {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
    }
    .gallery-image-hover {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
    }
  }
</style>
