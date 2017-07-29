<template>
  <header id="header">
    <div class="row expanded">
      <div class="columns flex align-middle">
        <a href="/" id="logo"><img src="/assets/logo.png"></a>
      </div>
      <div class="small-3 medium-9 columns" id="navBar">
        <nav id="links" class="show-for-navbreak">
          <router-link v-for="link in links" class="" :to="{name: link.url}" :key="link.url">{{link.name}}</router-link>
          <a href="#launchContact" @click.prevent="launchContact">Contact</a>
        </nav>
        <toggle class="hide-for-navbreak" @toggleNav="toggleNav()"></toggle>
        <MobileNav :links="links" :toggleState="nav_visible" class="hide-for-navbreak"></MobileNav>
      </div>
    </div>
  </header>
</template>

<script>
import bus from "../../../bus"
import Toggle from './components/navToggle.vue'
import MobileNav from './components/mobileNav.vue'

export default {
  name: 'header',
  components: {
    Toggle,
    MobileNav
  },
  props: ['authUser'],
  data() {
    return {
      nav_visible: false,
      default_links: [
        {
          name: "Home",
          url: "home"
        },
        {
          name: "Create Project Request",
          url: "new"
        },
        {
          name: "How It Works",
          url: "how"
        },
        {
          name: "Gallery",
          url: "gallery"
        },
        {
          name: "FAQ",
          url: "faq"
        }
      ],
      links: []
    }
  },
  watch: {
    'authUser.id': function(){
      this.updateLinks()
    }
  },
  methods: {
    launchContact() {
      bus.$emit('contactReveal')
    },
    toggleNav() {
      this.nav_visible = !this.nav_visible
    },
    updateLinks() {
      if(this.authUser.role == 'admin') {
        var admin_links = [...this.default_links]
        admin_links.splice(2, 0, { name: "All Projects", url: "list" })
        admin_links.push( { name: "Profile", url: "account"})
        this.links = admin_links
      } else if (this.authUser.role == 'contact') {
        var contact_links = [...this.default_links]
        contact_links.splice(2, 0, { name: "All Projects", url: "list" })
        contact_links.push( { name: "Profile", url: "contact-profile"})
        this.links = contact_links
      }
    }
  },
  mounted() {
    bus.$on('updateLinks', () => {
      this.updateLinks()
    })
  }
}
</script>

<style scoped lang="scss">
  p {
    font-size: 12em;
    text-align: center;
  }
</style>
