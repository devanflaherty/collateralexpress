import bus from '../../../bus'
import axios from "axios"

const ProjectSubmission = {
  methods: {
    //
    // Form submission handling
    //
    onSubmit() {
      bus.$emit('validate'); // Validate child components
      this.$validator.validateAll(); // Validate self

      if (!this.veeErrors.any()) {
        if(this.$route.name == "show") {
          bus.$emit('submitProjectForm')
        } else {
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
        }
      } // validate end
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

    // Once a contact has been updated/saved THEN we post the form
    // A project has to have a contact
    bus.$on('submitProjectForm', () => {
      var vm = this
      var axiosConfig = {
        utf8 : "✓",
        authenticity_token: this.token,
        project : this.project
      }
      if (!this.project.id) {
        // if this is a new project
        axios.post('/projects/', axiosConfig)
        .then(function (response) {
          // IF SUCCESFUll
          if(vm.dzUpload) {
            bus.$emit('uploadMedia', response.data.project.id)
          }

          vm.$store.dispatch('setMessage', response.data.project.title + " has been created!")

          vm.$store.dispatch({
            type: 'setReveal',
            reveal_type: 'new',
            title: response.data.project.title,
            msg: "Congratulations, you just created your project.",
            pid: response.data.project.id
          })

          vm.$store.dispatch({
            type: 'setFlash',
            title:response.data.flash[0][1],
            group: 'app'
          })
        })
        .catch(function (error) {
          // IF THERE ARE ERRORS
          vm.$store.dispatch({
            type: 'setReveal',
            reveal_type: 'error',
            title: vm.project.title,
            msg: error.message,
          })
          vm.axErrors(error.response, error.request, error.message);
        });
      } else {
        // If the project does exist let's update it
        axios.patch('/projects/' + this.project.id, axiosConfig)
        .then(function (response) {
          // Successful

          if(vm.dzUpload) {
            bus.$emit('uploadMedia', response.data.project.id)
          }
          vm.$store.dispatch('setMessage', response.data.project.title + " has been created!")
          // And then we will launch the Foundation Reveal
          vm.$store.dispatch({
            type: 'setReveal',
            reveal_type: 'update',
            title: response.data.project.title,
            msg: 'congratulations, you just updated your project.',
            pid: response.data.project.id
          })

          // We also want to grab the flash that was sent in the response
          vm.$store.dispatch({
            type: 'setFlash',
            title:response.data.flash[0][1],
            group: 'app'
          })
        })
        .catch(function (error) {
          // If there is an error we show the Foundation Reveal
          vm.$store.dispatch({
            type: 'setReveal',
            type: 'error',
            title: response.data.project.title,
            msg: error.message
          })
          // Get the flash
          vm.$store.dispatch({
            type: 'setFlash',
            title:response.data.flash[0][1],
            group: 'app'
          })
          // and run our error function
          vm.axErrors(error.response, error.request, error.message);
        });
      }
    })
  },
  beforeDestroy() {
    bus.$off('submitProjectForm')
  }
}

export default ProjectSubmission
