<template>
  <div id="projectApp">
    <div class="row">
      <div class="columns">
        <h2>{{page_title}}</h2>
        <hr>
        <nav>
          <router-link :to="{name: 'list'}">All Projects</router-link>
          <router-link :to="{name: 'new'}">New</router-link>
        </nav>
      </div>
    </div>

    <transition name="fade" appear>
      <router-view
        :reveal-type="reveal.type"
        :contactSession="contactSession"
        @visibleEmit="updateVisibility"
        :flash="flash"
        v-show="visible">
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
import bus from "../bus"
import Reveal from "./components/reveal.vue"

// Import Plugins
let contactEl = document.getElementById('cid')
let cid = contactEl ? contactEl.dataset.cid : ''

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
      visible: true,
      reveal: {
        type: null,
        title: null,
        msg: null
      }
    }
  },
  computed: {
    contactSession() {
      if (cid) {
        return parseInt(cid)
      } else {
        return null
      }
    }
  },
  watch: {
    flash: function(flash) {
      this.$notify({
        title: this.flash
      })
    },
    // reveal_type: function(type){
    //   this.reveal_type = type
    // }
  },
  methods: {
    updateVisibility(visibility) {
      this.visible = visibility
    },
    updateMessage(message) {
      this.message = message
    },
    updateFlash(flash) {
      this.flash = flash
    },
    showReveal(type) {
      $('#reveal').foundation('open');
    },
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
  },
}
</script>

<style scoped lang="scss">
#formContainer {
  //height: 100vh;
  #infoPanel {
    background-image: linear-gradient(-180deg, #EB0183 0%, #FF3068 100%);
  }
  #formPanel {
    //height: 100vh;
    overflow-y: scroll;
  }
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0
}
</style>
