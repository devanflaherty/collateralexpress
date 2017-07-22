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

      // If there are no errors
      if (!this.veeErrors.any()) {

        // Let's go on with the submission!
        // Let's set up some configurations

        if(this.contactQuery || this.project.contact_id || this.contactSession) {
          var cid = null
          if (this.contactQuery != null) {
            cid = this.contactQuery
          } else if (this.project.contact_id != null) {
            cid = this.project.contact_id
          } else if (this.contactSession) {
            cid = this.contactSession
          }
          console.log(cid)
          bus.$emit('postContact', cid)
        } else {
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

        for(var f in response.data.flash) {
          var flash = response.data.flash[f]
          if(flash[0] == 'notice') {
            bus.$emit('flashEmit', flash[1])
          }
        }
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
    bus.$on('deleteRequest', () => {
      this.deleteProject()
    })

    bus.$on('submitProjectForm', (cid) => {
      var vm = this
      var axiosConfig = {
        utf8 : "✓",
        authenticity_token: this.token,
        project : this.project
      }
      if (!this.project.id) {
        // ** if this is a new project
        console.log('submitted')
        // ** if is a new project but contact exist
        Axios.post('/projects/', axiosConfig)
        .then(function (response) {
          // IF SUCCESFUll
          if(vm.dzUpload) {
            bus.$emit('uploadMedia', response.data.project.id)
          }
          bus.$emit('messageEmit', vm.project.title + " has been created!")
          bus.$emit('showReveal','new', response.data.project.title, 'congratulations, you just created your project.', response.data.project.id);

          for(var f in response.data.flash) {
            var flash = response.data.flash[f]
            if(flash[0] == 'notice') {
              bus.$emit('flashEmit', flash[1])
            }
          }

        })
        .catch(function (error) {
          // IF THERE ARE ERRORS
          bus.$emit('showReveal','error', vm.project.title, error.message);
          vm.axErrors(error.response, error.request, error.message);
        });
      } else {
        // ** If the project does exist let's update it
        Axios.patch('/projects/' + this.project.id, axiosConfig)
        .then(function (response) {
          if(vm.dzUpload) {
            bus.$emit('uploadMedia', response.data.project.id)
          }
          bus.$emit('messageEmit', vm.project.title + " has been updated!")
          // And then we will launch the Foundation Reveal
          bus.$emit('showReveal','update', vm.project.title, 'congratulations, you just updated your project.', response.data.project.id);


          // We also want to grab the flash that was sent in the response
          for(var f in response.data.flash) {
            var flash = response.data.flash[f]
            // for each flash message that matches notice
            if(flash[0] == 'notice') {
              // We will update the parents flash data
              bus.$emit('flashEmit', flash[1])
            }
          }
        })
        .catch(function (error) {
          // If there is an error we show the Foundation Reveal
          bus.$emit('showReveal','error', vm.project.title, error.message);
          // Get the flash
          for(var f in response.data.flash) {
            var flash = response.data.flash[f]
            // for each flash message that matches notice
            if(flash[0] == 'notice') {
              // We will update the parents flash data
              bus.$emit('flashEmit', flash[1])
            }
          }
          // and run our error function
          vm.axErrors(error.response, error.request, error.message);
        });
      }
    })
  }
}

export default FormMethods
