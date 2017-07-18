import bus from '../bus'
import Axios from "axios"

// for parents
const onValidation = {
  mounted() {
    bus.$on('errors-changed', (errors) => {
      this.veeErrors.clear();
      this.$validator.validateAll();

      var errs = [...this.veeErrors.errors, ...errors.errors]
      var filtered = errs.filter((err, index, self) => self.findIndex((e) => {return e.field === err.field && e.msg === err.msg; }) === index)

      this.veeErrors.errors = filtered
    });

    // //Listen on the bus for the parent component running validation
    this.$validator.validateAll();
    // bus.$on('validate', this.onValidate)
  }
}

// for children
const emitValidationErrors = {
  watch: {
    'veeErrors.errors': {
      handler(errors){
        bus.$emit('errors-changed', this.veeErrors)
      },
      deep: true
    }
  },
  methods: {
    onValidate() {
      this.$validator.validateAll();
      if (this.veeErrors.any()) {
        bus.$emit('errors-changed', this.veeErrors)//errors
      }
    },
  },
  mounted() {
    //Listen on the bus for the parent component running validation
    this.$validator.validateAll();
    bus.$on('validate', this.onValidate)
  }
}

export { emitValidationErrors, onValidation}
