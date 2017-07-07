import bus from '../../../bus'
const ProgressMixin = {
  watch: {
    currentSteps(i) {
      this.setProg(i)
    },
  },
  computed: {
    requiredSteps() {
      var {title, description, status} = this.project
      return [title, description, status ]
    },
    currentSteps() {
      var i = 0
      var vm = this
      Object.keys(this.requiredSteps).forEach(function (key) {
        let obj = vm.requiredSteps[key];
        if(obj != "" && obj != null) {
          i++
        }
      });
      return i
    },
    totalSteps() {
      return Object.keys(this.requiredSteps).length
    }
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
    bus.$on('progressEmit', (val) => {
      this.set(val);
    })
  }
}

export default ProgressMixin
