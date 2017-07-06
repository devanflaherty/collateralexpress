<template>
  <div class="row">
    <div class="columns">

      <Status :project="project"></Status>

      <div class="form-card">
        <div class="card-content">
          <h3>{{this.$route.params}}</h3>
          <h3>{{project.title}}</h3>
          <p>{{project.description}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Axios from "axios"

  import Status from "./components/form/status.vue"

  export default {
    name: 'Show',
    components: {
      Status
    },
    data() {
      return {
        project: {}
      }
    },
    methods: {
      getProject() {
        if (this.$route.params.id) {
          var pid = this.$route.params.id
          var vm = this

          Axios.get('/api/v1/projects/' + pid + '.json')
            .then( response => {
              var {id, title, description, status, contact_id, user_id, flag} = response.data;
                this.project = Object.assign({}, this.project, response.data)

                document.title = this.project.title + " | Collateral Express"
            }).catch(error => {
              console.log(error)
            })
        }
      }
    },
    created(){
      this.getProject()
    },
    beforeRouteUpdate (to, from, next) {
      this.getProject()
      next()
    }
  }
</script>

<style scoped lang="scss">
  @mixin aspect-ratio($width, $height) {
    position: relative;
    &:before {
      display: block;
      content: "";
      width: 100%;
      padding-top: ($height / $width) * 100%;
    }
  }
  .form-card {
    background: white;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.20);
    border-radius: 6px;
    @include aspect-ratio(4,5);
    .card-content {
      position: absolute;
      top: 0; left: 0;
    }
  }
</style>
