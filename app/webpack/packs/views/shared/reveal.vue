<template>
  <div class="reveal" :class="reveal.reveal_type" id="reveal" data-reveal data-close-on-click="false" data-animation-in="fade-in" data-animation-out="fade-out">
    <h1 v-if="reveal.reveal_type == 'new'">Project '{{reveal.title}}' saved!</h1>
    <h1 v-else-if="reveal.reveal_type == 'update'">Project '{{reveal.title}}' Updated!</h1>
    <h1 v-else-if="reveal.reveal_type == 'notice'">{{reveal.title}}</h1>
    <h1 v-else-if="reveal.reveal_type == 'delete'">Are you sure you want to delete {{reveal.title}}!</h1>
    <h1 v-else>{{reveal.title}} Error</h1>

    <div v-if="reveal.msg">
      <p>{{reveal.msg}}</p>
    </div>
    <div v-else>
      <p class="lead">An error has occured.</p>
      <p>We're sorry, looks like you found a bug we have yet to have squashed.</p>
    </div>

    <div v-if="reveal.reveal_type == 'new' || reveal.reveal_type == 'update'">
      <router-link :to="{name: 'show', params: { id: reveal.project_id}}" class="button" data-close>View Project</router-link>
      <router-link :to="{name: 'list'}" class="button" data-close>All Projects</router-link>
    </div>

    <button v-if="reveal.reveal_type == 'delete'" @click="deleteRequest(reveal.project_id)" class="button alert">Delete</button>


    <button v-if="!reveal.project_id" class="close-button" data-close aria-label="Close modal" type="button">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'Reveal',
    computed: {
      ...mapGetters({
        reveal: 'reveal'
      })
    },
    methods: {
      deleteRequest(id) {
        this.$store.dispatch('deleteProject', id)
      }
    }
  }
</script>

<style scoped lang="scss">
</style>
