<docs>
Draws a PROformajs task for the ComposeMap component.

# props

* task - Protocol Task object to be represented
* x, y - coords of mid left side of task
* stroke_width - yep, border width
* selected - true if task selected in TaskMap
* no_handle - true when handle not wanted (e.g. for single non Plan task protocols)

# events

* select-path - dbl clicking on a sub-plan will emit this event.

# notes

This component is used to draw template tasks in the TaskBar and
protocol tasks in the TaskMap.  The difference between the drawn tasks is
that:

* protocol tasks have a data-path attribute in the root g element
* template tasks hava a data-clazz attribute in the root g element

neither of which attributes are reflected in this component but are worthy of note.

Warnings and errors are signalled with (?) and [!] in the breadcrumb.  These
would be better signalled with the same icons that are used in the task details
but I cant work out how to position these correctly.  See also MapBreadcrumb.

</docs>

<template>
  <g class="task draggable" @dblclick="changePath"> <!-- v-hammer:tap="doubleTapChangePath"-->
    <component v-bind:is="'pm-icon-' + clazz" :x="x" :y="y" fill="#FFF" :stroke="taskStroke" :animate="false"
      :stroke_width="stroke_width" />
    <pm-task-handle v-if="!no_handle" :x="handleX" :y="y + 20 + 16" />
    <text text-anchor="middle" :x="x + midline + (no_handle ? 0 : 3)" :y="y + 20 + 16" class="grabbable"
      v-bind:class="{ selected: selected }" :ref="'caption_' + task.path()">
      {{ task.name }}
      <tspan v-if="hasError" fill="#E74C3C">[!]</tspan>
      <tspan v-if="hasWarning" fill="#3498DB">(?)</tspan>
    </text>
    <text v-show="task.dataDefinitions.length > 0" text-anchor="middle" :x="x + midline" :y="y + 36 + 14" class="meta">{{
      task.dataDefinitions.length }} data definition<template v-if="task.dataDefinitions.length > 1">s</template></text>
    <text v-if="clazz == 'plan'" v-for="(subtask, idx) in task.tasks" text-anchor="middle" :x="x + midline"
      :y="task.dataDefinitions.length > 0 ? y + 36 + 28 + (idx * 14) : y + 36 + 14 + (idx * 14)" class="meta">{{
        subtask.name }}</text>
    <text v-if="clazz == 'enquiry'" v-for="(source, idx) in task.sources" text-anchor="middle" :x="x + midline"
      :y="task.dataDefinitions.length > 0 ? y + 36 + 28 + idx * 14 : y + 36 + 14 + idx * 14" class="meta">{{ source.type
      }}</text>
    <template v-if="clazz == 'decision'" v-for="(candidate, idx) in task.candidates">
      <text text-anchor="middle" :x="x + midline"
        :y="task.dataDefinitions.length > 0 ? y + 36 + 28 + idx * 14 : y + 36 + 14 + idx * 14" class="meta">{{
          candidate.name }} ({{ candidate.arguments.length }} arg<template
          v-if="candidate.arguments.length != 1">s</template>)</text>
    </template>
  </g>
</template>

<script>
import MapTaskHandle from './MapTaskHandle.vue';
import MapIconTask from '../Core/MapIconTask.vue';
import MapIconDecision from '../Core/MapIconDecision.vue';
import MapIconPlan from '../Core/MapIconPlan.vue';
import MapIconEnquiry from '../Core/MapIconEnquiry.vue';
import MapIconAction from '../Core/MapIconAction.vue';
import { task_colors } from '../Core/map.js';

export default {
  props: {
    task: Object,
    x: Number,
    y: Number,
    stroke_width: Number,
    selected: Boolean,
    no_handle: Boolean,
    issues: Array
  },
  components: {
    'pm-task-handle': MapTaskHandle,
    'pm-icon-task': MapIconTask,
    'pm-icon-decision': MapIconDecision,
    'pm-icon-plan': MapIconPlan,
    'pm-icon-enquiry': MapIconEnquiry,
    'pm-icon-action': MapIconAction
  },
  data: function () {
    return {
      handleX: 0
    };
  },
  computed: {
    clazz: function () {
      console.log(this.task);
      return this.task.constructor.name.toLowerCase();
    },
    midline: function () {
      return this.task.constructor.name == "Plan" ? 25 : 20;
    },
    taskStroke: function () {
      return task_colors[this.clazz].todo;
    },
    argumentCount: function () {
      return this.task.candidates ? this.task.candidates.reduce(function (acc, cand) { return acc = acc + cand.arguments.length; }, 0) : 0;
    },
    hasError() {
      return this.issues ? this.issues.filter((issue) => issue.path.startsWith(this.task.path()) && issue.type == 'Error').length > 0 : false;
    },
    hasWarning() {
      return this.issues ? this.issues.filter((issue) => issue.path.startsWith(this.task.path()) && issue.type == 'Warning').length > 0 : false;
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      this.setHandleX();
    });
  },
  methods: {
    setHandleX() {
      let text = this.$refs['caption_' + this.task.path()];
      try {
        this.handleX = this.x + this.midline - this.$refs['caption_' + this.task.path()].getBBox().width / 2;
      } catch (e) {
        console.log('ComposeMapTask.methods.setHandleX - unable to call BBox', this.task.path())
      }
    },
    changePath(evt) {
      if (this.task.constructor.name == 'Plan') {
        this.$emit('select-plan', { value: this.task.class ? this.task.path : this.task.path() });
      }
    },
    doubleTapChangePath(evt) {
      if (evt.tapCount == 2 && this.task.constructor.name == 'Plan') {
        this.$emit('select-plan', { value: this.task.class ? this.task.path : this.task.path() });
      }
    }
  },
  watch: {
    x: function () {
      this.setHandleX();
    }
  }
}
</script>

<style scoped>
.selected {
  font-weight: bold;
}

.meta {
  font-size: smaller;
  fill: gray;
}

.grabbable {
  cursor: grab;
}
</style>
