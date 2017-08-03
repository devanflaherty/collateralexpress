<template>
  <div id="app">
    <NavHeader></NavHeader>

  <!-- <transition name="fade" appear> -->
    <router-view
      id="main"
      :token="token"
      :auth-user="authUser"
      :contactSession="contactSession">
    </router-view>
  <!-- </transition> -->

    <AppFooter></AppFooter>

    <notifications group="auth" classes="auth-notice" position="top center"/>
    <notifications group="app" classes="app-notice" position="bottom right"/>
    <Reveal></Reveal>
    <ContactReveal></ContactReveal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import bus from "./bus"

import NavHeader from "./views/shared/header/index.vue"
import AppFooter from "./views/shared/footer.vue"
import Reveal from "./views/shared/reveal.vue"
import ContactReveal from "./views/shared/contact.vue"

export default {
  name: 'Project_App',
  components: {
    NavHeader,
    AppFooter,
    Reveal,
    ContactReveal
  },
  data() {
    return {
      page_title: "Projects",
    }
  },
  computed: {
    ...mapGetters({
      authUser: 'authUser',
      message: 'message',
      reveal: 'reveal',
      flash: 'flash',
      contactSession: 'contactSession'
    }),
    token() {
      return document.getElementsByName('csrf-token')[0].getAttribute('content')
    }
  },
  watch: {
    flash(flash){
      var key = flash.length - 1
      var f = flash[key]

      this.$notify({
        title: f.title,
        text: f.text,
        type: f.flash_type,
        group: f.group
      })
    }
  },
  methods: {
    updatePageTite(title) {
      this.page_title = title
    }
  },
  mounted() {
    // We mount foundation after the app and DOM has mounted
    $(document).foundation();
  }
}
</script>

<style lang="scss">
.fade-enter-active, .fade-leave-active {
  transition: opacity .125s
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0
}
.auth-notice {
  border-radius: 6px;
  padding: 10px;
  margin: 5px 5px 5px;

  font-size: 12px;

  color: #ffffff;
  background: rgba(0,0,0,0.9);

  &.warn {
    background: #ffb648;
  }

  &.error {
    background: #E54D42;
  }

  &.success {
    background: #68CD86;
  }
}
.app-notice {
  padding: 10px;
  margin: 0 5px 5px;

  font-size: 12px;

  color: #ffffff;
  background: rgba(0,0,0,0.9);
  border-left: 5px solid #EB0183;

  &.warn {
    background: #ffb648;
    border-left-color: #f48a06;
  }

  &.error {
    background: #E54D42;
    border-left-color: #B82E24;
  }

  &.success {
    background: #68CD86;
    border-left-color: #42A85F;
  }
}
</style>
