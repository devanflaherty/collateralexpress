<template>
  <div>
    <label class="float-label" :class="{floated: float}">{{label}}</label>
    <textarea v-if="textArea" :id="propKey" v-model="model" @focus="floatLabel" @blur="descendLabel"></textarea>
    <input v-else :id="propKey" v-model="model" @focus="floatLabel" @blur="descendLabel" type="text">
  </div>
</template>

<script>
import bus from '../../../bus'

export default {
  name: 'floatLabel',
  props: ['attr', 'label', 'propKey', 'textArea'],
  data() {
    return {
      float: false,
      model: ''
    }
  },
  watch: {
    model(val) {
      if(val.length > 0) {
        this.float = true
        bus.$emit('projectPropSet', this.propKey, this.model)
      }
    }
  },
  methods: {
    floatLabel() {
      this.float = true
    },
    descendLabel() {
      this.float = false
    }
  },
  created() {
    this.model = this.attr
  }
}

</script>

<style scoped lang="scss">

.float-label {
  position: absolute;
  z-index: 5;
  transition: all 0.3s ease;
  transform: translateY(2rem);
}
.floated {
  transform: translate(-4px, 0) scale(.9);
}
.float-input input, .float-input textarea {
  position: relative;
  z-index: 10;
  margin-top: 1.5rem;
}

// .float-label {
//   display: block;
//   position: absolute;
//   font-size: .9rem;
//   transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
// }
// .float-label-enter-active {
//   opacity: 1;
// }
// .float-label-enter-to, .float-label-leave {
//   transform: translateY(0px) scale(1);
// }
// .float-label-enter, .float-label-leave-to
// /* .slide-fade-leave-active for <2.1.8 */ {
//   transform: translateY(2rem) scale(1.175);
//   opacity: 0;
// }
</style>
