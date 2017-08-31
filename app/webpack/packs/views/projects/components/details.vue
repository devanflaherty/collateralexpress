<template>
  <div id="projectDetails">
    <h3 style="margin-top:2rem;">Project Details</h3>

    <div class="float-input">
      <FloatLabel
        v-model="project.title"
        v-validate="'required'"
        data-vv-name="Project Title"
        :has-error="veeErrors.has('Project Title')"
        :error-text="veeErrors.first('Project Title')"
        label="*Project Title"></FloatLabel>
    </div>

    <div class="float-input">
      <FloatLabel
        v-model="project.description"
        v-validate="'required'"
        data-vv-name="Project Description"
        :has-error="veeErrors.has('Project Description')"
        :error-text="veeErrors.first('Project Description')"
        label="*Project Description"
        inputType='textarea'></FloatLabel>
    </div>

    <div class="row">
      <div class="columns small-12 medium-9 large-6">
        <div class="float-input">
          <label>*Due Date</label>
            <Datepicker
              :calendar-button="true"
              :calendar-button-icon="'fa fa-calendar'"
              :monday-first="true"
              placeholder="04 July, 2017"
              v-model="project.due_date"
              name="due_date"
              v-validate="'required'"
              data-vv-as="Due Date">
            </Datepicker>
            <span v-show="veeErrors.has('due_date') && this.fields.due_date.touched" class="error-message">{{veeErrors.first('due_date')}}</span>
        </div>
      </div>
      <div class="columns">
        <div class="float-input">
          <label>Deliverables</label>
          <select v-model="project.deliverables">
            <option disabled value="0">Select the amount</option>
            <option v-for="n in 10">{{n}}</option>
          </select>
        </div>
      </div>
    </div>

    <div class="toggle-inputs">
      <div class="check-input">
        <h5>Does this project need translation?</h5>
        <label for="projectTranslation">
          <input style="display:none" id="projectTranslation" type="checkbox" v-model="project.translation">
          <div v-if="project.translation" class="checked checked-true">
            <icon name="check"></icon>
          </div>
          <div v-else class="checked">
            <icon name="circle-thin"></icon>
          </div>
          <span>{{ project.translation ? "Project Needs Translation" : "Project doesn't need translation" }}</span>
        </label>
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
  name: "projectDetails",
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
