<template>
  <div class="reveal" :class="reveal.type" id="reveal" data-reveal data-close-on-click="false" data-animation-in="fade-in" data-animation-out="fade-out">
    <h1 v-if="reveal.type == 'new'">Project '{{reveal.title}}' saved!</h1>
    <h1 v-else-if="reveal.type == 'update'">Project '{{reveal.title}}' Updated!</h1>
    <h1 v-else-if="reveal.type == 'notice'">{{reveal.title}}</h1>
    <h1 v-else-if="reveal.type == 'delete'">Are you sure you want to delete {{reveal.title}}!</h1>
    <h1 v-else>{{reveal.title}} Error</h1>

    <div v-if="reveal.msg">
      <p>{{reveal.msg}}</p>
    </div>
    <div v-else>
      <p class="lead">An error has occured.</p>
      <p>We're sorry, looks like you found a bug we have yet to have squashed.</p>
    </div>

    <div v-if="reveal.type == 'new' || reveal.type == 'update'">
      <router-link :to="{name: 'show', params: { id: reveal.project_id}}" class="button">View Project</router-link>
      <router-link :to="{name: 'list'}" class="button">All Projects</router-link>
    </div>

    <button v-if="reveal.type == 'delete'" @click="deleteEmit" class="button alert">Delete</button>


    <button v-if="!reveal.project_id" class="close-button" data-close aria-label="Close modal" type="button">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
</template>

<script>
  import bus from '../../bus'

  export default {
    name: 'Reveal',
    data() {
      return {}
    },
    props: ['reveal'],
    methods: {
      deleteEmit() {
        bus.$emit('deleteRequest')
      }
    },
  }
</script>

<style scoped lang="scss">
</style>
