<docs>
    Debug for ReviewExpression
</docs>

<template>
  <div>
    <debug title="MapIconDecision">
      <svg width="100%" tabindex="0" :viewBox="viewbox">
        <g class="task draggable" @click="handleClick">
          <MapIconDecision v-bind="testPRProps1" />
        </g>
      </svg>
    </debug>
  </div>
</template>

<script>
import MapIconDecision from '../../Core/MapIconDecision.vue'
import { task_colors, discarded_color } from '../../Core/map.js'

const testPRProps1 = {
  x: 50,
  y: 50,
  stroke_width: 8,
  stroke: task_colors.decision.done,
  fill: task_colors.decision.done,
  animate: true
}

export default {
  name: 'MapIconDecisionDebug',
  data: function () {
    return {
      testPRProps1: testPRProps1
    }
  },
  mounted: function () {},
  components: { MapIconDecision }
}
</script>
