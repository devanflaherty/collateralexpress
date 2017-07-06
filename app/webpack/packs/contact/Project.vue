<template>
  <div id="project">
    <div v-for="project in projects">
      {{project.id}}
      {{project.title}}
      {{project.description}}
    </div>
  </div>
</template>

<script>

export default {
  name: 'project',
  data() {
    return {}
  },
  props: ['projects'],
}
</script>
