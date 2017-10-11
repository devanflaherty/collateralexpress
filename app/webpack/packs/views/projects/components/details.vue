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
      <div class="columns small-12 medium-6 large-6">
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
          <label>Translation</label>
          <div class="row">
            <div class="columns">
              <h5 style="margin-top: .5rem; padding-bottom: .5rem; border-bottom: 1px solid #838383">Does your project need to be translated?</h5>
            </div>
            <div class="columns shrink">
              <div class="switch" style="margin-top: .25rem">
                <input class="switch-input" id="translation" type="checkbox" name="exampleSwitch" v-model="project.translation">
                <label class="switch-paddle" for="translation">
                  <span class="show-for-sr">Request Translation</span>
                  <span class="switch-active" style="color: white;" aria-hidden="true">Yes</span>
                  <span class="switch-inactive" style="color: white;" aria-hidden="true">No</span>
                </label>
              </div>
            </div>
          </div>
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
