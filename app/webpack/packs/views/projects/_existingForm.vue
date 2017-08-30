<template>

  <form v-on:submit.prevent="onSubmit" id="existingForm">
    <div id="formContainer" class="row expand align-center">
      <div class="form-panel small-12 columns" :class="{'medium-8 large-7': $route.name == 'edit', 'medium-10 large-10': $route.name == 'new' }">
        <header v-if="project && project.id" class="row">
          <div class="columns">
            <h5>{{project.title}}</h5>
          </div>
        </header>

        <!-- <Status :projectStatus="project.status" :projectFlag="project.flag" :projectArchive="project.archive"></Status> -->
        <div class="row">
          <div class="columns">
            <div class="fieldset">
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

              <div class="tactics">
                <h5 style="margin-top: 1rem">Tactics</h5>

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
                        v-model="other"
                        data-vv-name="other"
                        label="Other"
                        @updateOther="setTactics"></FloatLabel>
                    </div>
                  </div>
                </div>
                <!-- close other field -->
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

              <div class="float-input">
                <FloatLabel
                  v-model="project.reference"
                  v-validate="'url'"
                  data-vv-name="Asset Reference"
                  :has-error="veeErrors.has('Asset Reference')"
                  :error-text="veeErrors.first('Asset Reference')"
                  label="Asset Reference"></FloatLabel>
                <p class="hint">http://tmap.com/link/to/asset</p>
              </div>

              <h3 style="margin-top:2rem;">Who is this for?</h3>

              <div class="float-input">
                <FloatLabel
                  v-model="project.business_unit"
                  v-validate=""
                  data-vv-name="Business Unit"
                  :has-error="veeErrors.has('Business Unit')"
                  :error-text="veeErrors.first('Business Unit')"
                  label="Business Unit"></FloatLabel>
              </div>

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
      </div><!-- form panel part 1 -->

      <div v-if="$route.params.id" id="infoPanel" class="small-12 medium-8 large-3 columns show-for-medium">
        <aside id="projectSidebar">
          <nav v-if="$auth.check()">
            <router-link class="button expanded" :to="{ name: 'show', params: { id: $route.params.id} }">View Project</router-link>
            <router-link class="button hollow expanded" :to="{name: 'list'}">All Projects</router-link>
            <router-link class="button hollow secondary expanded" :to="{name: 'new'}">Add New Project</router-link>
          </nav>
        </aside>
        <a v-if="project && project.id"
          id="deleteProject"
          style="float: right"
          class="delete-project"
          @click="deletePrompt(project.id)">
          <icon name="trash"></icon>
          Delete
        </a>
      </div><!-- close sidebar -->

      <div class="form-panel small-12 columns" style="padding: 0;">
        <div id="fileUploader" class="row align-center">
          <div class="small-12 large-10 column">
            <MediaUploader :project-id="project.id" :token="token"></MediaUploader>
          </div>
        </div>

        <div class="row align-center" id="contactForm">
          <div class="small-12 large-10 column">
            <div class="fieldset">
              <contact
                :contact-query="contactQuery"
                :project-id="project.id"
                @contactEmit="updateContact"
              ></contact>
            </div>
          </div>
        </div>

        <div class="row align-center">
          <div class="small-12 large-10 columns">
            <div class="fieldset">
              <div class="callout" v-show="veeErrors.any()">
                <p>Please make sure all 'required' fields have been filled out and there are no errors.</p>
                <ul class="error-list">
                  <li v-for="err in veeErrors.errors">
                    <span class="error-message">{{veeErrors.first(err.field)}}</span>
                  </li>
                </ul>

              </div>
              <input type="submit" value="Submit" :disabled="veeErrors.any()" class="button gradient expanded">
            </div>
          </div>
        </div>

      </div><!-- close column-->
    </div><!--close form container-->
  </form>

</template>
<script>
import { mapGetters } from 'vuex'
import bus from '../../bus'

import Datepicker from 'vuejs-datepicker';
import FloatLabel from "../shared/floatLabel.vue"

import ProjectSubmission from "./mixins/projectSubmission.js"

import MediaUploader from "./components/mediaUploader.vue"
import Contact from "./components/contact.vue"

export default {
  name: "existingForm",
  data: () => ({

  })
}
</script>
<style lang="scss" scoped>
</style>
