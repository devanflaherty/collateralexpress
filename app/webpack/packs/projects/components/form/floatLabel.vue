<template>
  <div>
    <label class="float-label" :class="{floated: float}">{{label}}</label>
    <textarea v-if="inputType == 'textarea'" :id="propKey" v-model="model" @focus="floatLabel" @blur="floatLabel"></textarea>
    <input v-else :id="propKey" v-model="model" @focus="floatLabel(true)" @blur="floatLabel" type="text">
  </div>
</template>

<script>
import bus from '../../../bus'

export default {
  name: 'floatLabel',
  props: ['attr', 'label', 'propKey', 'inputType'],
  data() {
    return {
      float: false,
      model: ''
    }
  },
  watch: {
    model(m) {
      if(m && m.length > 0) {
        this.floatLabel()
        bus.$emit('projectPropSet', this.propKey, this.model)
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
  transform: translate(-4px, -.75rem) scale(.9);
}
.float-input input, .float-input textarea {
  position: relative;
  z-index: 10;
  margin-top: 1.5rem;
}
</style>
