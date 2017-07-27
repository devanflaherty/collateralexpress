import bus from '../../../bus'
import Axios from "axios"

const FormMethods = {
  methods: {
    //
    // Form submission handling
    //
    onSubmit() {
      bus.$emit('validate'); // Validate child components
      this.$validator.validateAll(); // Validate self

      if (!this.veeErrors.any()) {
        // If there are no errors we continue
        if(this.contactQuery || this.project.contact_id || this.contactSession) {
          // Let set what Contact ID we send to contact Submission
          var cid = null
          if (this.contactQuery != null) {
            cid = this.contactQuery
          } else if (this.project.contact_id != null) {
            cid = this.project.contact_id
          } else if (this.contactSession) {
            cid = this.contactSession
          }
          // Since we found an ID we send it on and will patch that contact
          bus.$emit('postContact', cid)
        } else {
          // Else we will send nothing and create a new contact
          bus.$emit('postContact')
        }
      } // validate end
    },
    deletePrompt() {
      bus.$emit('showReveal', 'delete', this.project.title, 'Are you sure you want to delete this project?')
    },
    deleteProject() {
      var vm = this
      Axios.delete('/projects/' + this.project.id)
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

    },
    axErrors(res,req,msg) {
      var vm = this
      if (res) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        vm.errors = res.data.errors;
        for(var er in vm.errors) {
          var erArray = vm.errors[er].join("<br>");
          vm.$notify({
            title: er,
            text: erArray
          });
        }
      } else if (req) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        vm.$notify({
          title: "Error",
          text: req
        });
        console.log(req);
      } else {
        // Something happened in setting up the request that triggered an Error
        vm.$notify({
          title: "Error",
          text: msg
        });
        console.log('Error', msg);
      }
    }
  },
  mounted() {
    bus.$off('submitProjectForm')

    bus.$on('deleteRequest', () => {
      this.deleteProject()
    })

    // Once a contact has been updated/saved THEN we post the form
    // A project has to have a contact
    bus.$on('submitProjectForm', (cid) => {
      var vm = this
      var axiosConfig = {
        utf8 : "✓",
        authenticity_token: this.token,
        project : this.project
      }
      if (!this.project.id) {
        // if this is a new project
        Axios.post('/projects/', axiosConfig)
        .then(function (response) {
          // IF SUCCESFUll
          if(vm.dzUpload) {
            bus.$emit('uploadMedia', response.data.project.id)
          }
          bus.$emit('messageEmit', vm.project.title + " has been created!")
          bus.$emit('showReveal','new', response.data.project.title, 'congratulations, you just created your project.', response.data.project.id);

          bus.$emit('flashEmit', response.data.flash[0][1])

        })
        .catch(function (error) {
          // IF THERE ARE ERRORS
          bus.$emit('showReveal','error', vm.project.title, error.message);
          vm.axErrors(error.response, error.request, error.message);
        });
      } else {
        // If the project does exist let's update it
        Axios.patch('/projects/' + this.project.id, axiosConfig)
        .then(function (response) {
          // Successful

          if(vm.dzUpload) {
            bus.$emit('uploadMedia', response.data.project.id)
          }
          bus.$emit('messageEmit', vm.project.title + " has been updated!")
          // And then we will launch the Foundation Reveal
          bus.$emit('showReveal','update', vm.project.title, 'congratulations, you just updated your project.', response.data.project.id);

          // We also want to grab the flash that was sent in the response
          bus.$emit('flashEmit', response.data.flash[0][1])
        })
        .catch(function (error) {
          // If there is an error we show the Foundation Reveal
          bus.$emit('showReveal','error', vm.project.title, error.message);
          // Get the flash
          bus.$emit('flashEmit', response.data.flash[0][1])
          // and run our error function
          vm.axErrors(error.response, error.request, error.message);
        });
      }
    })
  },
  beforeDestroy() {
    bus.$off('submitProjectForm')
    bus.$off('deleteRequest')
  }
}

export default FormMethods
