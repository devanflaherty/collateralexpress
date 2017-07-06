<template>
  <div class="reveal" :class="reveal.type" id="reveal" data-reveal>
    <h1 v-if="reveal.type == 'new'">{{flash}}</h1>
    <h1 v-else-if="reveal.type == 'update'">{{flash}}</h1>
    <h1 v-else-if="reveal.type == 'delete'">Are you sure you want to delete {{reveal.title}}!</h1>
    <h1 v-else>{{reveal.title}} Error</h1>

    <div v-if="reveal.msg">
      <p>{{reveal.msg}}</p>
    </div>
    <div v-else>
      <p class="lead">Some text</p>
      <p>I'm a cool paragraph that lives inside of an even cooler modal. Wins!</p>
    </div>

    <button v-if="reveal.type == 'delete'" @click="deleteEmit" class="button alert">Delete</button>

    <button class="close-button" data-close aria-label="Close modal" type="button">
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
    props: ['reveal', 'flash'],
    methods: {
      deleteEmit() {
        bus.$emit('deleteRequest')
      }
    }
  }
</script>

<style scoped lang="scss">
</style>
