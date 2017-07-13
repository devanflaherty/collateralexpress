<template>
  <div>
    <label class="float-label" :class="{floated: float, focused: focus}">{{label}}</label>
    <textarea rows="4" v-if="inputType == 'textarea'" :id="propKey" v-model.lazy="model" @focus="floatLabel(true)" @blur="floatLabel(false)"></textarea>
    <input v-else :id="propKey" v-model.lazy="model" @focus="floatLabel(true); focusLabel(true)" @blur="floatLabel(false); focusLabel(false)" type="text">
  </div>
</template>

<script>
import bus from '../../../bus'

export default {
  name: 'floatLabel',
  props: ['attr', 'label', 'propKey', 'obj', 'inputType'],
  data() {
    return {
      float: false,
      focus: false,
      model: ''
    }
  },
  watch: {
    attr(a) {
      this.model = a
    },
    model(m) {
      if(m && m.length > 0) {
        this.floatLabel()
        if(this.label == "Other") {
          this.$emit('updateOther', this.model)
        } else if(this.obj == "contact") {
          bus.$emit('contactPropSet', this.propKey, this.model)
        } else {
          bus.$emit('projectPropSet', this.propKey, this.model)
        }
      }
    }
  },
  methods: {
    floatLabel(f) {
      if(this.model && this.model.length > 0 || f) {
        this.float = true
      } else {
        this.float = false
      }
    },
    focusLabel(f) {
      if(f) {
        this.focus = true
      } else {
        this.focus = false
      }
    }
  },
  created() {
    this.model = this.attr
  },
  mounted() {
    bus.$on('emptyFloats', () => {
      this.model = ""
    })
  }
}

</script>

<style scoped lang="scss">
.float-label {
  position: absolute;
  z-index: 5;
  transition: all 0.3s ease;
  transform: translateY(.5rem);
}
.floated {
  transform: translate(-4px, -1rem) scale(.9);
}
.float-input input, .float-input textarea {
  position: relative;
  z-index: 10;
  margin-top: 1.5rem;
}
</style>
