<template>
  <section id="projectSelector" class="pad-small gradient-bg" :class="{'minimize' : projectType}">
    <div class="text-center">
      <h2 v-if="$route.name == 'new'">{{pageTitle}}</h2><h2 v-else>Create a Project</h2>
      <p v-if="!projectType" class="text-center">Select one of the options below to get started.</p>
    </div>

    <div class="select-cards row align-center align-middle" style="margin-bottom: 1rem;">
      <div class="select-col text-center">
        <router-link class="card space-between" :to="{ name: 'new', query: { type: 'existing'}}">
          <div class="select-image">
            <img src="/assets/icons/modify.png" >
          </div>
          <div v-if="!projectType">
            <h4>Modify Existing Asset</h4>
            <p>
              Share with us the existing asset and we'll make your requested modifications.
            </p>
          </div>
        </router-link>
        <span v-if="projectType">Existing</span>
      </div>

      <div class="select-col text-center">
        <router-link class="card space-between" :to="{ name: 'new', query: { type: 'template'}}">
          <div class="select-image">
            <img src="/assets/icons/template.png" >
          </div>
          <div v-if="!projectType">
            <h4>Create from Template</h4>
            <p>Fill us in on the details and choose from a template.</p>
          </div>
        </router-link>
        <span v-if="projectType">Template</span>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  name: "projectSelector",
  props: ['projectType', 'pageTitle'],
  data: () => ({
  }),
  methods: {
    showForm(type) {
      this.$emit('typeEmit', type)
      this.$router.push({name: 'new', query: { type: type}})

      if(type == "existing") {
        this.$store.dispatch({
          type: 'setProjectProperty',
          project: { existing: 1 }
        })
      } else if(type == "template") {
        this.$store.dispatch({
          type: 'setProjectProperty',
          project: { existing: 0 }
        })
      }
    },
  },
  mounted() {
    if(this.$route.query.type) {
      this.showForm(this.$route.query.type)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
