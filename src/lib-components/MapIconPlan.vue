<docs>
Draws a PROformajs Protocol.Plan svg "icon"

# props

* x, y - coords of bottom mid left side of task
* stroke_width - yep, border width
* stroke - color
* fill - color
* animate - flash centre of icon
</docs>

<template>
  <rect
    :x="x + stroke_width / 2"
    :y="y - 20 + stroke_width / 2"
    :width="50 - stroke_width"
    :height="40 - stroke_width"
    :rx="stroke_width"
    :ry="stroke_width"
    :fill="fill"
    :stroke="stroke"
    :stroke-width="stroke_width"
  >
    <animate
      v-if="animate"
      attributeName="fill"
      dur="1s"
      begin="0s"
      repeatCount="indefinite"
      :values="stroke + ';#FFF;' + stroke"
    />
  </rect>
</template>

<script>
export default {
  props: {
    x: Number,
    y: Number,
    stroke_width: Number,
    stroke: String,
    fill: String,
    animate: Boolean
  }
}
</script>
