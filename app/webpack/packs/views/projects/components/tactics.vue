<template>
  <div id="projectTactics">
    <h3 style="margin-top:2rem;">Project Tactics</h3>

    <div class="tactics">
      <div class="row small-up-2 large-up-3">
        <div class="column" v-for="tactic in availableTactics" v-bind:key="tactic" >
          <input type="checkbox" :id="tactic" :value="tactic" v-model="project.tactic">
          <label :for="tactic">
            {{tactic}}
          </label>
        </div>
      </div>

      <!-- other field-->
      <div class="row" v-if="project.tactic.includes('Other')">
        <div class="columns small-6">
          <div class="float-input">
            <FloatLabel
              v-model="tactic_other"
              data-vv-name="other"
              label="Other"
              @updateOther="setTactics"></FloatLabel>
          </div>
        </div>
      </div>
      <!-- close other field -->
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
  name: "projectDetails",
  mixins: [emitValidationErrors, ProgressMixin],
  components: {
    FloatLabel,
    Datepicker
  },
  data: () => ({
    tactic_other: '',
  }),
  computed: {
    ...mapGetters(['project', 'availableTactics']),
  },
  watch: {
    'project.tactic': function() {
      // Find the count of the tactic array
      var count = this.project.tactic.length
      if(this.project.tactic.includes('Other')) {
        // If Other is selected let's not count "other" as a deliverable
        --count
      } else {
        // If other is unselected let's make sure the field is empty
        this.tactic_other = ''
      }
      // Dispatch Deliverable count to store
      this.$store.dispatch({
        type: 'setProjectProperty',
        project: { deliverables: count }
      })
    },
    tactic_other(other) {
      // When the other_input field has been updated
      // Run the setTactics Method passing in the other_input's value
      this.setTactics(other)
    }
  },
  methods: {
    setTactics(tactic) {
      this.$store.dispatch('pushTactic', tactic)
    }
  },
  mounted() {
    // We grab the tactics
    this.$store.dispatch('setAvailableTactics')
  }
}
</script>
<style lang="scss" scoped>
</style>
