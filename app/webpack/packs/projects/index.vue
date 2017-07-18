<template>
  <div id="projectApp">
    <transition name="fade" appear>
      <router-view
        :auth="auth"
        :reveal-type="reveal.type"
        :contactSession="contactSession"
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
import Reveal from "./components/reveal.vue"

export default {
  name: 'Project_Form',
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
        msg: null
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
    updateFlash(flash) {
      this.flash = flash
    },
    showReveal(type) {
      $('#reveal').foundation('open');
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
  mounted() {
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
      this.showReveal()
    });
    bus.$on('authEmit', (id) => {
      this.auth = id
    })
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      axios.get('/authenticate.json')
      .then(function (response) {
        if (response.data.user.id) {
          vm.auth = response.data.user.id
        } else {
          vm.auth = null
        }
      }).catch(function (error) {
        vm.auth = null
      })
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
