import bus from '../../../bus'
import axios from "axios"

const DeleteProject = {
  methods: {
    deletePrompt() {
      bus.$emit('showReveal', 'delete', this.project.title, 'Are you sure you want to delete this project?')
    },
    deleteProject() {
      var vm = this
      axios.delete('/projects/' + this.project.id)
      .then(function (response) {
        bus.$emit('closeReveal')

        bus.$emit('flashEmit', response.data.flash[0][1])
        // If Delete is succesfull we route to the list page
        vm.$router.push({ name: 'list' })
      })
      .catch(function (error) {
        // if it fails we just console log an error for now
        console.log(error)
      });

    }
  },
  mounted() {
    bus.$on('deleteRequest', () => {
      this.deleteProject()
    })
  },
  beforeDestroy() {
    bus.$off('deleteRequest')
  }
}

export default DeleteProject
