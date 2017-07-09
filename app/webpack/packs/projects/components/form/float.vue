<template>
  <div>
    <transition name="float-label">
      <label class="float-label" v-if="attr">{{label}}</label>
    </transition>
  </div>
</template>

<script>

export default {
  name: 'floatLabel',
  props: ['attr','label'],
  data() {
    return {
    }
  },
}

</script>

<style scoped lang="scss">
.float-label {
  display: block;
  position: absolute;
  font-size: .9rem;
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.float-label-enter-active {
  opacity: 1;
}
.float-label-enter-to, .float-label-leave {
  transform: translateY(0px) scale(1);
}
.float-label-enter, .float-label-leave-to
/* .slide-fade-leave-active for <2.1.8 */ {
  transform: translateY(2rem) scale(1.175);
  opacity: 0;
}
</style>
