<docs>
    Debug for MapTaskHandle
</docs>

<template>
  <div>
    <debug title="MapTaskHandle">
      <svg width="100%" tabindex="0" :viewBox="viewbox">
        <g class="task draggable" @click="handleClick">
          <MapTaskHandle v-bind="testPRProps1" />
        </g>
      </svg>
    </debug>
  </div>
</template>

<script>
import MapTaskHandle from '../../Compose/MapTaskHandle.vue'
import { task_colors, discarded_color } from '../../Core/map.js'

const testPRProps1 = {
  x: 50,
  y: 50
}

export default {
  name: 'MapTaskHandleDebug',
  data: function () {
    return {
      testPRProps1: testPRProps1
    }
  },
  mounted: function () {},
  components: { MapTaskHandle }
}
</script>
