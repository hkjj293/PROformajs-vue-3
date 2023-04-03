<docs>
Provides a UI for a single task  in a proformajs Enactment.

# props

* enactment - a PROformajs enactment
* options - review settings
* debug - allows access to the "Debug expressions" functionality
* taskpath - the path of the task to be shown

# events

* change-enactment - signals the need to update the enactment
* change-option - signals an option change

</docs>

<template>
  <div v-if="indicatedTask">
    <pr-task :task="indicatedTask" :enactment="enactment" @update-enactment="updateEnactment" :options="options" @send-trigger="sendTrigger"/>
  </div>
</template>

<script>
import { ReviewMixin } from './review';

export default {
  name: 'pr-fixed',
  mixins: [ReviewMixin],
  props: ['taskpath'],
  computed: {
    indicatedTask() {
      return this.enactment && this.taskpath ? this.enactment.getComponent(this.taskpath) : null;
    }
  }
}
</script>
