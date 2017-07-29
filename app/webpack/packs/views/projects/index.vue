<template>
  <router-view
    :auth-user="authUser"
    :contact-session="contactSession">
  </router-view>
</template>

<script>
import axios from "axios"
import bus from "../../bus"

export default {
  name: 'Projects',
  props: ['authUser', 'contactSession'],
  data() {
    return {

    }
  }
}
</script>
