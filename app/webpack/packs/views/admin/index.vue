<template>
  <section id="admin" class="pad" v-if="$auth.ready()">
    <div class="row align-center">
      <div class="columns small-11 medium-12 large-6">
        <router-view>
        </router-view>
      </div>
      <aside class="columns small-11 medium-12 large-4"  v-if="$auth.check()">
        <h3 v-if="$auth.check('admin')">Admin Actions</h3>
        <h3 v-else>Contact Actions</h3>

        <hr class="no-margin">
        <a v-if="$auth.check()" style="float: right" @click.prevent="logout">logout</a>

        <nav v-if="$auth.check('admin')">
          <div class="flex">
            <router-link :to="{name: 'account'}" class="button expanded" v-if="$route.name != 'account'">Edit Account</router-link>
            <router-link :to="{name: 'new-admin'}" class="button expanded secondary" v-if="$route.name != 'new-admin'">Add New Admin</router-link>
          </div>
          <router-link :to="{name: 'list-admin'}" class="button expanded hollow">View All Admin Users</router-link>
          <a v-if="$auth.check()" style="float: right" @click.prevent="logout">logout</a>
        </nav>
      </aside>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

import { onValidation } from '../shared/validation'
import FloatLabel from "../shared/floatLabel.vue"

export default {
  name: 'Admin_Form',
  mixins: [onValidation],
  components: {
    FloatLabel
  },
  computed: {
    ...mapGetters({
      authUser: 'authUser'
    }),
    token() {
      return document.getElementsByName('csrf-token')[0].getAttribute('content')
    }
  },
  methods: {
    logout() {
      this.$auth.logout({
        success: function () {},
        error: function () {},
        redirect: '/',
      })

      this.$store.dispatch('setToken', '')

      this.$store.dispatch({
        type: 'setFlash',
        title: "Succefully signed out.",
        group: 'auth'
      })
    }
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
h3 {
  margin-top: .5rem;
  margin-bottom: .5rem;
}
</style>
