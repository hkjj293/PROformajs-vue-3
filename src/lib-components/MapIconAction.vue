<docs>
Draws a PROformajs Protocol.Action svg "icon"

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
    :y="y - 18 + stroke_width / 2"
    :width="36 - stroke_width"
    :height="36 - stroke_width"
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
