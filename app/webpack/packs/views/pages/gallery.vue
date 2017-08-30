<template>
  <section id="gallery">

    <HeroHeader
      :title="'<p>Believe your eyes<br><strong>We made all this here</strong></p>'"
      :image="'http://collateralexpress.s3.amazonaws.com/img/slide-4.jpg'">
    </HeroHeader>

    <div class="row pad-small">
      <div class="column">
        <h2>Gallery</h2>
        <p>Things of beauty--crushing sales targets.</p>

        <div class="row small-up-2 medium-up-3">

          <div class="column" v-for="image in gallery">
            <div class="card gallery-card">
              <a href="#" @click.prevent="openModal(image.thumb)">
                <img :src="image.thumb" class="gallery-image">
                <div class="gallery-image-hover text-center">
                  <div class="gallery-ui">
                    <icon name="arrows-alt" ></icon><br>
                    <span>View Real Pixels</span>
                  </div>
                </div>
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>

    <div class="reveal" id="galleryReveal" data-reveal data-animation-in="fade-in" data-animation-out="fade-out">
      <img :src="modalImage">

      <button class="close-button" data-close aria-label="Close modal" type="button">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  </section>
</template>

<script>
import HeroHeader from "../shared/heroHeader.vue"

export default {
  name: 'Gallery',
  metaInfo() {
    return {
      title: this.$route.meta.title
    }
  },
  components: {
    HeroHeader
  },
  data() {
    return {
      modalImage: '',
      gallery: [
        {
          thumb: 'https://collateralexpress.s3.amazonaws.com/gallery/thumbs/1.jpg',
          full: ''
        },
        {
          thumb: 'https://collateralexpress.s3.amazonaws.com/gallery/thumbs/2.jpg',
          full: ''
        },
        {
          thumb: 'https://collateralexpress.s3.amazonaws.com/gallery/thumbs/3.jpg',
          full: ''
        },
        {
          thumb: 'https://collateralexpress.s3.amazonaws.com/gallery/thumbs/4.jpg',
          full: ''
        },
        {
          thumb: 'https://collateralexpress.s3.amazonaws.com/gallery/thumbs/5.jpg',
          full: ''
        },
        {
          thumb: 'https://collateralexpress.s3.amazonaws.com/gallery/thumbs/6.jpg',
          full: ''
        }
      ]
    }
  },
  methods: {
    openModal(image) {
      this.modalImage = image
      if(this.modalImage) {
        $('#galleryReveal').foundation('open');
      }
    }
  },
  mounted() {
    $('#galleryReveal').foundation();
  }
}

</script>

<style scoped lang="scss">
@import '../../../../assets/stylesheets/util/colors';

  .gallery-card {
    position: relative;
    overflow: hidden;
    border-radius: 6px;
    &:before {
      display: block;
      content: '';
      width: 100%;
      padding-top: 3/4 * 100%;
    }
    &:hover {
      .gallery-image-hover {
        opacity: 1;
        .gallery-ui {
          .fa-icon {
            transform: scale(1);
          }
        }
      }
    }
    .gallery-image {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
    }
    .gallery-image-hover {
      opacity: 0;
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba($primaryColor, 0.9);
      transition: all 0.5s ease;
      .gallery-ui {
        flex: 1 0 auto;
        .fa-icon {
          width: auto;
          height: 2em;
          color: white;
          transform: scale(.5);
          transition: all 0.5s cubic-bezier(0.41, 0.08, 0.43, 1.53);
        }
        span {
          display: block;
          position: absolute;
          width: 100%;
          color: white;
          font-size: .75rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          text-align: center;
          bottom: 2rem;
        }
      }
    }
  }
</style>
