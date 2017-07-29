<template>
  <div id="app">
    <NavHeader :auth-user="auth_user"></NavHeader>

  <!-- <transition name="fade" appear> -->
    <router-view
      id="main"
      :token="token"
      :auth-user="auth_user"
      :contactSession="contactSession">
    </router-view>
  <!-- </transition> -->

    <AppFooter></AppFooter>

    <notifications />
    <Reveal
      :reveal="reveal"
      :flash="flash">
    </Reveal>
    <ContactReveal></ContactReveal>
  </div>
</template>

<script>
import axios from "axios"
import bus from "./bus"

import NavHeader from "./views/shared/header/index.vue"
import AppFooter from "./views/shared/footer.vue"
import Reveal from "./views/shared/reveal.vue"
import ContactReveal from "./views/shared/contact.vue"

let token = document.getElementsByName('csrf-token')[0].getAttribute('content')
axios.defaults.headers.common['X-CSRF-Token'] = token
axios.defaults.headers.common['Accept'] = 'application/json'

export default {
  name: 'Project_App',
  props: ['links'],
  components: {
    NavHeader,
    AppFooter,
    Reveal,
    ContactReveal
  },
  data() {
    return {
      page_title: "Projects",
      message: "Update Form",
      flash: {
        title: null,
        text: null
      },
      reveal: {
        type: null,
        title: null,
        msg: null,
        project_id: null
      },
      auth_user: {
        id: null,
        role: null
      },
      contactSession: null
    }
  },
  computed: {
    token() {
      return document.getElementsByName('csrf-token')[0].getAttribute('content')
    },
  },
  watch: {
    'flash.title': function(){
      this.$notify({
        title: this.flash.title,
        text: this.flash.text
      })
    }
  },
  methods: {
    updateMessage(message) {
      this.message = message
    },
    updatePageTite(title) {
      this.page_title = title
    },
    updateFlash(title, text) {
      this.flash.title = title
      this.flash.text = text
    },
    getContactSession() {
      var cid = this.getCookie('current_contact_id')
      if (cid) {
        return parseInt(cid)
      } else {
        return null
      }
    },
    getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    },
  },
  mounted() {
    // We mount foundation after the app and DOM has mounted
    $(document).foundation();
    if(this.$route.name == 'contact') {
      $('#contactReveal').foundation('open');
    }

    //Listen on the bus for changers to the child components error bag and merge in/remove errors
    bus.$on('messageEmit', (msg) => {
      this.updateMessage(msg)
    })

    bus.$on('flashEmit', (title, text) => {
      this.updateFlash(title,text)
    })

    bus.$on('showReveal', (type, title, msg, pid) => {
      this.reveal.type = type
      this.reveal.title = title
      this.reveal.msg = msg
      this.reveal.project_id = pid
      $('#reveal').foundation('open');
    });

    bus.$on('contactReveal', () => {
      $('#contactReveal').foundation('open');
    });

    bus.$on('closeReveal', () => {
      if(this.reveal.type != null) {
        this.reveal.type = null
        this.reveal.title = null
        this.reveal.msg = null
        this.reveal.project_id = null
        $('#reveal').foundation('close');
      }
    });

    bus.$on('authEmit', (id, role) => {
      this.auth_user.id = id
      this.auth_user.role = role
    })

    bus.$on('contactSessionEmit', (id) => {
      if(id != null) {
        this.contactSession = id
      } else {
        // If no id is passed we will look to browser cookies
        this.contactSession = this.getContactSession()
      }
    })

    // If we come from external source and the router is not invoked
    // We need to set a contactSession on mount
    if(!this.contactSession) {
      this.contactSession = this.getContactSession()
    }
  }
}
</script>

<style scoped lang="scss">
.fade-enter-active, .fade-leave-active {
  transition: opacity .125s
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0
}
</style>
