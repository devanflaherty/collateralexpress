<template>
  <main id="projectApp">
    <!-- <transition name="fade" appear> -->
      <router-view
        :auth="auth"
        :contactSession="contactSession"
        :reveal-type="reveal.type"
        :flash="flash">
      </router-view>
    <!-- </transition> -->

    <notifications />

    <Reveal
      :reveal="reveal"
      :flash="flash">
    </Reveal>
    <!-- @deleteRequest="deleteProject" -->
  </main>
</template>

<script>
import axios from "axios"
import bus from "../bus"
import Reveal from "../shared/reveal.vue"

export default {
  name: 'Project_App',
  components: {
    Reveal
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
      auth: null,
      contactSession: null
    }
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
    }
  },
  beforeCreate() {
    // When hitting vue app outside of Vue Router
    if(window.location.hash == '#new') {
      this.$router.push({name: 'new'})
    }
    if(window.location.hash == '#all') {
      this.$router.push({name: 'list'})
    }
  },
  mounted() {
    // We mount foundation after the app and DOM has mounted
    $(document).foundation();

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

    bus.$on('closeReveal', () => {
      if(this.reveal.type != null) {
        this.reveal.type = null
        this.reveal.title = null
        this.reveal.msg = null
        this.reveal.project_id = null
        $('#reveal').foundation('close');
      }
    });

    bus.$on('authEmit', (id) => {
      this.auth = id
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
