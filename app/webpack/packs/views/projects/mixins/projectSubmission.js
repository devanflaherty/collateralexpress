import bus from '../../../bus'

let token = document.getElementsByName('csrf-token')[0].getAttribute('content')

const ProjectSubmission = {
  computed: {
    axiosConfig() {
      return {
        utf8 : "✓",
        authenticity_token: token,
        project : this.project
      }
    }
  },
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
      } else {
        this.$notify({
          title: 'There are errors in your form',
          type: 'alert',
          group: 'app'
        });
      }// validate end
    },

    postProject() {
      this.axios.post('/api/v1/projects/', this.axiosConfig)
      .then(response => {
        // IF SUCCESFUll
        if(this.dzUpload) {
          bus.$emit('uploadMedia', response.data.project.id)
        }

        this.$store.dispatch('setMessage', response.data.project.title + " has been created!")

        this.$store.dispatch({
          type: 'setReveal',
          reveal_type: 'new',
          title: response.data.project.title,
          msg: "Congratulations, you just created your project.",
          pid: response.data.project.id
        })

        this.$store.dispatch({
          type: 'setFlash',
          title:response.data.flash[0][1],
          group: 'app'
        })
      })
      .catch(error => {
        // IF THERE ARE ERRORS
        this.$store.dispatch({
          type: 'setReveal',
          reveal_type: 'error',
          title: this.project.title,
          msg: error.message,
        })
        this.axErrors(error.response, error.request, error.message);
      });
    },

    patchProject() {
      this.axios.patch('/api/v1/projects/' + this.project.id, this.axiosConfig)
      .then(response => {
        // Successful

        if(this.dzUpload) {
          bus.$emit('uploadMedia', response.data.project.id)
        }
        this.$store.dispatch('setMessage', response.data.project.title + " has been created!")
        // And then we will launch the Foundation Reveal
        this.$store.dispatch({
          type: 'setReveal',
          reveal_type: 'update',
          title: response.data.project.title,
          msg: 'congratulations, you just updated your project.',
          pid: response.data.project.id
        })

        // We also want to grab the flash that was sent in the response
        this.$store.dispatch({
          type: 'setFlash',
          title:response.data.flash[0][1],
          group: 'app'
        })
      })
      .catch(error => {
        // If there is an error we show the Foundation Reveal
        this.$store.dispatch({
          type: 'setReveal',
          type: 'error',
          title: response.data.project.title,
          msg: error.message
        })
        // Get the flash
        this.$store.dispatch({
          type: 'setFlash',
          title:response.data.flash[0][1],
          group: 'app'
        })
        // and run our error function
        this.axErrors(error.response, error.request, error.message);
      });
    },

    axErrors(res,req,msg) {
      if (res) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        this.errors = res.data.errors;
        for(var er in this.errors) {
          var erArray = this.errors[er].join("<br>");
          this.$notify({
            title: er,
            text: erArray,
            group: 'app'
          });
        }
      } else if (req) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        this.$notify({
          title: "Error",
          text: req,
          group: 'app'
        });
        console.log(req);
      } else {
        // Something happened in setting up the request that triggered an Error
        this.$notify({
          title: "Error",
          text: msg,
          group: 'app'
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
      if (!this.project.id) {
        // if this is a new project
        this.postProject()
      } else {
        // If the project does exist let's update it
        this.patchProject()
      }
    })
  },
  beforeDestroy() {
    bus.$off('submitProjectForm')
  }
}

export default ProjectSubmission
