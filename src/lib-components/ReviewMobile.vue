<docs>
Provides a very simple mobile UI for a proformajs Enactment.

# props

* enactment - a PROformajs enactment
* options - review settings
* debug - allows access to the "Debug expressions" functionality

# events

* change-enactment - signals the need to update the enactment
* change-option - signals an option change

todo:
* mobile view
* single task mode
</docs>

<template>
  <div v-if="enactment">
    <div class="row">
      <div class="col">
        <div class="progress">
          <div class="progress-bar" role="progressbar" aria-label="Progress" :aria-valuenow="progress.toString()"
            aria-valuemin="0" :aria-valuemax="taskCount.toString()" :style="{
              width: (progress * 100 / taskCount).toString() + '%'
            }">
          </div>
        </div>
        <div v-if="status.finished">
          <slot name="finished">
            <h3>Completed</h3>
            <button class="btn btn-outline-secondary btn-block d-block" @click="restartEnactment">
              <font-awesome-icon icon="redo-alt" /> Restart
            </button>
          </slot>
        </div>
        <div v-else>
          <pr-task :task="activeTask" :enactment="enactment" @update-enactment="updateEnactment" :options="options"
            @send-trigger="sendTrigger" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ReviewMixin } from './review';

export default {
  mixins: [ReviewMixin],
  emits: ['restart-enactment'],
  computed: {
    taskCount() {
      console.log('total: ' + (this.enactment ? this.enactment.getTasks().length : 1))
      return this.enactment ? this.enactment.getTasks().length : 1;
    },
    progress() {
      console.log('finished: ' + (this.enactment ? this.enactment.getTasks().filter((task) => task.state == "discarded" || task.state == "completed").length : 0))
      return this.enactment ? this.enactment.getTasks().filter((task) => task.state == "discarded" || task.state == "completed").length : 0;
    }
  },
  methods: {
    restartEnactment() {
      this.view = 'task';
      this.$emit('restart-enactment');
    }
  }
}
</script>
