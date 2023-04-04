<docs>
Provides a toolbar of draggable Task archetypes for the TaskMap component.

# props

* width - width of the bar
* height - the height of the bar (i.e. the height of the protocol map)
* layout - a data object that specifies the position of the TaskBar tasks
* stroke_width - yep, the width of the task borders

# notes

Passing the data-clazz attribute to the Task component indicates to the
TaskMap that these tasks are templates that create new tasks when dragged.
</docs>

<template>
  <g id="taskbar">
    <line :x1="width" y1="0" :x2="width" :y2="height" stroke="gray"></line>
    <pm-task v-for="(pos, clazz) in layout" :key="clazz" :task="task(clazz)" :x="pos.x" :y="pos.y" :stroke_width="stroke_width" :data-clazz="clazz" />
  </g>
</template>

<script>
import MapTask from './ComposeMapTask.vue';
import { Protocol } from '@openclinical/proformajs';

export default {
  props: {
    width: Number,
    height: Number,
    layout: Object,
    stroke_width : Number
  },
  components: {
    'pm-task': MapTask
  },
  methods: {
    task(clazz) {
      return new Protocol[clazz]({name: clazz});
    }
  }
}
</script>
