import bus from '../../../bus'
const ProgressMixin = {
  computed: {
    validFields() {
      return Object.keys(this.fields).filter(key => this.fields[key].required && this.fields[key].valid ).length;
    },
    totalSteps() {
      return Object.keys(this.fields).filter(key => this.fields[key].required).length
    }
  },
  watch: {
    validFields(i) {
      this.setProg(i)
    },
  },
  methods: {
    //Progress Bar Methods
    setProg(i) {
      var total = 100 / this.totalSteps
      var prog = i * total;
      this.set(prog);
    },
    set (num) {
      this.$Progress.set(num)
    }
  },
  mounted() {
    // Allows other components to set prog to 0
    bus.$on('progressEmit', (val) => {
      this.set(val);
    })
  }
}

export default ProgressMixin
