<template>
  <div id="faq" v-once>
    <HeroHeader :title="'<p>If you’ve got questions<br><strong>We\'ve got your FAQ</strong></p>'" :image="'https://unsplash.it/g/1200/720'"></HeroHeader>

    <section id="faqContainer" class="pad white-bg">
      <div class="row align-center">
        <div class="columns small-11 medium-3">
          <h2>FAQ's</h2>
          <p>Can’t find your answer here? Found a bug? Give support a shout. They’ve got your back in a big way.</p>
          <a href="mailto:hello@saltagency.co?subject=Collateral%20Express%20Support" class="button hollow">Contact Support</a>
        </div>
        <div class="columns small-11 medium-8 medium-offset-1">
          <ul id="accordion" class="accordion" data-accordion>

            <li v-for="(faq, index) in faqs" class="accordion-item" :class="{'is-active': index === 0}" data-accordion-item>
              <a href="#" class="accordion-title"><h4>{{faq.question}}</h4></a>

              <div class="accordion-content" data-tab-content v-html="faq.answer">
              </div>
            </li>

          </ul>
        </div>
      </div>
    </section>

  </div>
</template>

<script>
import HeroHeader from "../shared/heroHeader.vue"

export default {
  name: 'FAQ',
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
      faqs: [
        {
          question:'Question 1',
          answer: "<p>I am an answer to Question 1</p>",
        },
        {
          question:'Question 2',
          answer: "<p>I am an answer to Question 2</p>",
        }
      ]
    }
  },
  mounted() {
    $('#accordion').foundation();
  }
}

</script>
