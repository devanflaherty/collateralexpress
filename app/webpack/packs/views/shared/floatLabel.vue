<template>
  <div>
    <label class="float-label" :class="{floated: float, focused: focus}">{{label}}</label>

    <textarea
      v-if="inputType == 'textarea'"
      rows="4"
      :id="inputId"
      :value="value"
      :name="label"
      @input="emitInput($event.target.value)"
      @focus="floatLabel(true); focusLabel(true)"
      @blur="floatLabel(false); focusLabel(false)">
    </textarea>

    <input
      v-else-if="inputType == 'password'"
      :id="inputId"
      :value="value"
      :name="label"
      @input="emitInput($event.target.value)"
      @focus="floatLabel(true); focusLabel(true)"
      @blur="floatLabel(false); focusLabel(false)"
      type="password">

    <input v-else-if="!inputType"
      :id="inputId"
      :value="value"
      @input="emitInput($event.target.value)"
      @focus="floatLabel(true); focusLabel(true)"
      @blur="floatLabel(false); focusLabel(false)"
      :name="label"
      type="text">

      <span v-show="hasError" class="error-message">{{errorText}}</span>
  </div>
</template>

<script>
import {emitValidationErrors} from './validation'

export default {
  name: 'floatLabel',
  // mixins: [emitValidationErrors],
  props: ['value', 'label','inputType', 'has-error', 'error-text'],
  data() {
    return {
      float: false,
      focus: false
    }
  },
  computed: {
    inputId() {
      if(this.value != null) {
        return this.value.replace(/\s+/g, '-').toLowerCase()
      }
    }
  },
  watch: {
    '$route': function() {
      this.veeErrors.clear();
    },
    value(m) {
      if(m && m.length > 0 && m != null || m != 'undefined') {
        this.floatLabel()
        this.setParentData()
      }
    }
  },
  methods: {
    setParentData() {
      // if(this.model != null && this.key != null) {
      //   if(this.label == "Other") {
      //     this.$emit('updateOther', this.model)
      //   } else if(this.obj == "contact") {
      //     this.$store.dispatch('setContactProperty', [this.key,this.model])
      //   } else {
      //     this.$store.dispatch({
      //       type: 'setProjectProperty',
      //       set: [this.key, this.model]
      //     })
      //   }
      // }
    },
    emitInput(value) {
      this.$emit('input', value);
    },
    floatLabel(f) {
      if(this.value && this.value.length > 0 || f) {
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
    this.veeErrors.clear()
    if(this.value) {
      this.floatLabel()
    }
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
