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
          this.$store.dispatch("postProject").then(response => {
            // If contact posts succesfully post project
            // Post or Patch is handled in action
            this.postProject(response.data)
          }, error => {
            // If error is returned
            console.error(response.data.flash[0][1])
            this.postProject(response.data, err)
          })
        } else {
          // If there are no errors we post the contact
          this.$store.dispatch("postContact").then(response => {
            // Post project
            // Post or Patch is handled in action
            this.postContact(response.data)

            this.$store.dispatch("postProject").then(response => {
              // If contact posts succesfully post project
              // Post or Patch is handled in action
              this.postProject(response.data)
            }, error => {
              // If error is returned
              console.error(response.data.flash[0][1])
              this.postProject(response.data, err)
            })

          }, error => {
            // If error is returned for contact post
            console.error(response.data.flash[0][1])
            this.postContact(response.data, err)
          })
        }
      } else {
        this.$notify({
          title: 'There are errors in your form',
          type: 'warn',
          group: 'app'
        });
      }// validate end
    },

    postProject(data, err) {
      // IF SUCCESFUll
      if(!err) {
        if(this.dzUpload) {
          bus.$emit('uploadMedia', data.project.id)
        }

        this.$store.dispatch('setMessage', data.flash[0][1])

        this.$store.dispatch({
          type: 'setReveal',
          reveal_type: 'new',
          title: data.project.title,
          msg: data.flash[0][1],
          pid: data.project.id
        })

        this.$store.dispatch({
          type: 'setFlash',
          title:data.flash[0][1],
          group: 'app'
        })
      } else if (err) {
        // IF THERE ARE ERRORS
        this.$store.dispatch({
          type: 'setReveal',
          reveal_type: 'error',
          title: this.project.title,
          msg: error.message,
        })
        this.$store.dispatch({
          type: 'setFlash',
          title:response.data.flash[0][1],
          type: 'warn',
          group: 'app'
        })
        this.axErrors(error.response, error.request, error.message);
      }
    },

    postContact(data, err) {
      if(!err) {
        console.log(data.flash[0][1])
        // IF SUCCESFUll
        this.$emit("contactEmit", data.contact)
        this.$notify({
          title: data.flash[0][1],
          group: 'app'
        })

        if(!this.$auth.check()) {
          this.loginContact()
        }
      } else {
        // IF THERE ARE ERRORS
        this.$notify({
          title: data.flash[0][1],
          group: 'app',
          type: 'warn'
        })
      }
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
