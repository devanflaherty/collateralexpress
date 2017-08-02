<template>
  <div id="faq" v-once>
    <HeroHeader :title="'<p>Need some help<br><strong>We\'ve got your back</strong></p>'" :image="'https://unsplash.it/g/1200/720'"></HeroHeader>

    <section id="copy" class="pad">
      <div class="row">
        <div class="columns small-5">
          <p>We understand that using tools like Collateral Express can leave you with a few questions. So rather than making you dig for answers that you may never find, or going to your coleague not wanting to sound like the tech laggard we made this page for you.</p>
        </div>

        <div class="columns small-5 small-offset-2">
          <p>If you can’t find the answer to a particular question, or if you have run across any bugs while using the application please contact us by clicking the link below.</p>
          <a href="mailto:hello@saltagency.co?subject=Collateral%20Express%20Support" class="button hollow">Contact Support</a>
        </div>
      </div>
    </section>

    <hr class="no-margin">

    <section id="faqContainer" class="pad white-bg">
      <div class="row">
        <div class="columns small-3">
          <h2>FAQ's</h2>
          <p>Click a heading to reveal the answer.</p>
        </div>
        <div class="columns small-8 small-offset-1">
          <ul class="accordion" data-accordion>

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
import bus from "../../bus"
import HeroHeader from "../shared/heroHeader.vue"

export default {
  name: 'FAQ',
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
  }
}

</script>
