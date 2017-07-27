import bus from '../../bus'
const ProgressMixin = {
  watch: {
    currentSteps(i) {
      this.setProg(i)
    },
  },
  computed: {
    requiredSteps() {
      // var {title, description, status} = this.project
      // return [title, description, status ]
      return this.getSelectFields('required')
    },
    currentSteps() {
      var required = this.getSelectFields('valid')
      var reqCount = required.length
      return reqCount
    },
    totalSteps() {
      return Object.keys(this.requiredSteps).length
    }
  },
  methods: {
    //Progress Bar Methods
    getSelectFields(type) {
      var vm = this

      var i = 0
      var array = []
      Object.keys(this.fields).forEach(function (key) {
        let field = vm.fields[key];
        Object.keys(field).forEach(function (key) {
          let fVal = field[key]

            if (key == type && fVal == true) {
              array.push(field)
            }

        });
      });

      return array
    },
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
