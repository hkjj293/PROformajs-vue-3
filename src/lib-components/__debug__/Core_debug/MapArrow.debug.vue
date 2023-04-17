<docs>
    Debug for ReviewExpression
</docs>

<template>
  <div>
    <debug title="MapArrow">
      <svg width="100%" tabindex="0" :viewBox="viewbox">
        <g class="task draggable" @click="handleClick">
          <MapArrow v-bind="testPRProps1" />
        </g>
      </svg>
    </debug>
  </div>
</template>

<script>
import MapArrow from '../../Core/MapArrow.vue'

const testPRProps1 = {
  sx: 50.54356301541733,
  sy: 50.13459032695374,
  tx: 100.14920905916057,
  ty: 100.92286216470376,
  source: 'actionA',
  target: 'planC',
  selected: true
}

export default {
  name: 'MapArrowDebug',
  data: function () {
    return {
      testPRProps1: testPRProps1
    }
  },
  components: { MapArrow }
}
</script>
