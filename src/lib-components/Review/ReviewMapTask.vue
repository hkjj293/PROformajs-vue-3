<docs>
Draws a PROformajs task for the ReviewMap component.

# props

* task - Runtime Task Component object to be represented
* x, y - coords of bottom mid left side of task
* stroke_width - yep, border width
* selected - true if task selected in TaskMap

# events

* select-path - clicking on a task name will raise this event.
</docs>

<template>
  <g class="task draggable" @click="handleClick">
    <component
      v-bind:is="'pm-icon-' + clazz"
      :x="x"
      :y="y"
      :fill="taskFill"
      :stroke="taskStroke"
      :animate="task.state == 'in_progress'"
      :stroke_width="stroke_width"
      class="clickable"
    />
    <text
      text-anchor="middle"
      :x="x + midline"
      :y="y + 20 + 16"
      v-bind:class="{ selected: selected }"
      class="clickable"
    >
      {{ task.caption || task.name }}
    </text>
  </g>
</template>

<script>
import MapIconTask from '../Core/MapIconTask.vue'
import MapIconDecision from '../Core/MapIconDecision.vue'
import MapIconPlan from '../Core/MapIconPlan.vue'
import MapIconEnquiry from '../Core/MapIconEnquiry.vue'
import MapIconAction from '../Core/MapIconAction.vue'
import { task_colors, discarded_color } from '../Core/map.js'

export default {
  props: {
    task: Object,
    x: Number,
    y: Number,
    stroke_width: Number,
    selected: Boolean
  },
  components: {
    'pm-icon-task': MapIconTask,
    'pm-icon-decision': MapIconDecision,
    'pm-icon-plan': MapIconPlan,
    'pm-icon-enquiry': MapIconEnquiry,
    'pm-icon-action': MapIconAction
  },
  computed: {
    clazz: function () {
      return this.task.class.toLowerCase()
    },
    midline: function () {
      return this.task.constructor.name == 'Plan' ? 25 : 20
    },
    taskFill: function () {
      switch (this.task.state) {
        case 'completed':
          return task_colors[this.clazz].done
        case 'discarded':
          return discarded_color
        case 'in_progress':
          return task_colors[this.clazz].todo
        case 'dormant':
          return 'none'
      }
    },
    taskStroke: function () {
      switch (this.task.state) {
        case 'completed':
          return task_colors[this.clazz].done
        case 'discarded':
          return discarded_color
        default:
          return task_colors[this.clazz].todo
      }
    }
  },
  methods: {
    handleClick(evt) {
      if (this.task.class == 'Plan') {
        this.$emit('select-plan', { value: this.task.path })
      } else {
        this.$emit('select-task', { value: this.task.path })
      }
    }
  }
}
</script>

<style scoped>
.selected {
  font-weight: bold;
}

.clickable {
  cursor: pointer;
}
</style>
