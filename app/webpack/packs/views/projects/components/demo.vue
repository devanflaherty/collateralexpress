<template>
  <div id="projectDemo">
    <h3 style="margin-top:2rem;">Who is it for?</h3>
    <div class="row">
      <div class="columns small-12 medium-6">
        <div class="float-input">
          <FloatLabel
            v-model="project.business_unit"
            v-validate=""
            data-vv-name="Business Unit"
            :has-error="veeErrors.has('Business Unit')"
            :error-text="veeErrors.first('Business Unit')"
            label="Business Unit"></FloatLabel>
        </div>
      </div>
      <div class="columns small-12 medium-6">
        <div class="float-input">
          <FloatLabel
            v-model="project.target"
            v-validate=""
            data-vv-name="Target Audience"
            :has-error="veeErrors.has('Target Audience')"
            :error-text="veeErrors.first('Target Audience')"
            label="Target Audience"></FloatLabel>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

import FloatLabel from "../../shared/floatLabel.vue"
import Datepicker from 'vuejs-datepicker'

import ProgressMixin from "../mixins/progressMixin.js"
import {emitValidationErrors} from '../../shared/validation.js'

export default {
  name: "projectDemo",
  mixins: [emitValidationErrors, ProgressMixin],
  components: {
    FloatLabel,
    Datepicker
  },
  data: () => ({

  }),
  computed: {
    ...mapGetters(['project']),
  }
}
</script>
<style lang="scss" scoped>
</style>
