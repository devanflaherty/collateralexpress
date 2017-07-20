<template>
  <div id="projectApp">
    <transition name="fade" appear>
      <router-view
        :auth="auth"
        :contactSession="contactSession"
        :reveal-type="reveal.type"
        :flash="flash">
      </router-view>
    </transition>

    <notifications />

    <Reveal
      :reveal="reveal"
      :flash="flash">
    </Reveal>
    <!-- @deleteRequest="deleteProject" -->
  </div>
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
      flash: "",
      reveal: {
        type: null,
        title: null,
        msg: null,
        project_id: null
      },
      auth: null
    }
  },
  computed: {
    contactSession() {
      var cid = this.getCookie('current_contact_id')
      if (cid) {
        return parseInt(cid)
      } else {
        return null
      }
    },
  },
  watch: {
    flash: function(flash) {
      this.$notify({
        title: this.flash
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
    updateFlash(flash) {
      this.flash = flash
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
    if(window.location.hash == '#new') {
      this.$router.push({name: 'new'})
    }
    if(window.location.hash == '#all') {
      this.$router.push({name: 'list'})
    }
  },
  mounted() {
    $(document).foundation();
    //Listen on the bus for changers to the child components error bag and merge in/remove errors
    bus.$on('messageEmit', (msg) => {
      this.updateMessage(msg)
    })
    bus.$on('flashEmit', (flash) => {
      this.updateFlash(flash)
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
  }
}
</script>

<style scoped lang="scss">
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0
}
</style>
