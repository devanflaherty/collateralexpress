<template>
  <div id="updateStatus">
    <div class="white-bg" style="padding:1rem">
      <h4>Update the project status</h4>
      <p>
        Inform {{contact.full_name}} on the status of the project.
        <br>Once the status has changed and the project has been saved they will be notified via their email<br>
      </p>
      <button class="button gradient" @click.prevent="updateReveal">Set Status</button>

    </div>
    <div class="reveal" id="adminUpdateReveal" data-reveal>
      <h2>Update {{project.title}}</h2>
      <form v-on:submit.prevent="onSubmit" id="formGuts">
        <Status :projectStatus="project.status" :projectFlag="project.flag" :projectArchive="project.archive"></Status>

        <div id="legal">
          <h3>Legal</h3>
          <textarea v-model="project.legal_review" rows="6" placeholder="Please enter in the legal copy for review."></textarea>
        </div>

        <input type="submit" value="Submit" class="button expanded gradient">
      </form>

      <button class="close-button" data-close aria-label="Close modal" type="button">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  </div>
</template>

<script>
import Axios from "axios"
import bus from "../../../../bus.js"
import Status from "./status.vue"
import ProjectSubmission from "../../mixins/projectSubmission.js"

export default {
  name: 'AdminUpdates',
  mixins: [ProjectSubmission],
  props: ['project', 'contact'],
  components: {
    Status
  },
  data() {
    return {
    }
  },
  methods: {
    updateReveal() {
      $("#adminUpdateReveal").foundation('open')
    },
    addFileModal() {
      $('#uploader').foundation('open');
    }
  },
  mounted() {
    $("#adminUpdateReveal").foundation()
  }
}
</script>

<style scoped lang="scss">
  #legal {
    margin: 2rem 0;
  }
</style>
