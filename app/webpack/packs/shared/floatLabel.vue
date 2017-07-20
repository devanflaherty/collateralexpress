<template>
  <div>
    <label class="float-label" :class="{floated: float, focused: focus}">{{label}}</label>

    <textarea v-if="inputType == 'textarea'"
      rows="4"
      :id="propKey"
      v-validate="validation"
      v-model.lazy="model"
      :name="propKey"
      @focus="floatLabel(true); focusLabel(true)"
      @blur="floatLabel(false); focusLabel(false)">
    </textarea>

    <input v-else
      :id="propKey"
      v-validate="validation"
      v-model.lazy="model"
      @focus="floatLabel(true); focusLabel(true)"
      @blur="floatLabel(false); focusLabel(false)"
      :name="propKey"
      type="text">
  </div>
</template>

<script>
import bus from '../bus'
import {emitValidationErrors} from './validation'

export default {
  name: 'floatLabel',
  mixins: [emitValidationErrors],
  props: ['attr', 'label', 'propKey', 'obj', 'inputType', 'validation'],
  data() {
    return {
      float: false,
      focus: false,
      model: '',
      key: ''
    }
  },
  watch: {
    attr(a) {
      this.model = a
    },
    model(m) {
      if(m && m.length > 0 && m != null || m != 'undefined') {
        this.floatLabel()
        this.setParentData()
      }
    }
  },
  methods: {
    setParentData() {
      if(this.model != null && this.key != null) {
        console.log(this.key + " | " + this.model)
        if(this.label == "Other") {
          this.$emit('updateOther', this.model)
        } else if(this.obj == "contact") {
          bus.$emit('contactPropSet', this.key, this.model)
        } else {
          bus.$emit('projectPropSet', this.key, this.model)
        }
      }
    },
    floatLabel(f) {
      if(this.model && this.model.length > 0 || f) {
        // console.log(this.model + 'floating')
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
    },
  },
  mounted() {
    this.key = this.propKey
    this.model = this.attr

    bus.$on('emptyFloats', () => {
      this.model = ""
    })

    // Validation listeners are in onValidation Mixin
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
