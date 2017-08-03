<template>
  <section id="hero" class="full-pane-callout">
    <div class="row small-collapse">
      <div class="columns small-12 medium-6 brand-color">
        <div class="rellax-image" style="background-image: url(https://unsplash.it/g/600/900)"></div>

        <div class="hero-card-container">
          <div class="hero-card rellax"
            data-rellax-speed="1">
            <h2 class="banner white-banner">Submit a Project</h2>

            <div class="hero-copy">
              <p>Fill out a project request’s and keep up-to-date with its status until your project has been completed with your requested assets.</p>
            </div>

            <div class="hero-actions">
              <router-link :to="{name: 'new'}" class="button hollow primaryAlt">Fill out a project request</router-link>
            </div>
          </div>
        </div><!-- close card container -->
      </div>

      <div class="columns small-12 medium-6 show-for-medium">
        <div class="hero-card-container">
          <div class="hero-card rellax"
            data-rellax-speed="1">
            <h2 class="banner">How Does It Work?</h2>

            <div class="hero-copy">
              <p>Just exactly how does Collateral Express work? Well, we would love to tell you just click the links below.</p>
            </div>

            <div class="hero-actions">
              <router-link :to="{name: 'how'}" class="button hollow primaryAlt">How It Works</router-link>
              <router-link :to="{name: 'faq'}" class="button hollow primaryAlt">FAQs</router-link>
            </div>
          </div>
        </div><!-- close card container -->
      </div>
    </div>

    <section id="howForMobile" class="full-pane-callout hide-for-medium">

      <div class="row small-collapse">
        <div class="columns small-12">
          <div class="hero-card-container">
            <div class="hero-card">
              <h2 class="banner">How Does It Work?</h2>

              <div class="hero-copy">
                <p>Just exactly how does Collateral Express work? Well, we would love to tell you just click the links below.</p>
              </div>

              <div class="hero-actions">
                <router-link :to="{name: 'how'}" class="button hollow primaryAlt">How It Works</router-link>
                <router-link :to="{name: 'faq'}" class="button hollow primaryAlt">FAQs</router-link>
              </div>
            </div>
          </div><!-- close card container -->
        </div>
      </div>

    </section>
  </section>
</template>
