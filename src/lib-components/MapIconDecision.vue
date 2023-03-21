<docs>
Draws a PROformajs Protocol.Decision svg "icon"

# props

* x, y - coords of bottom mid left side of task
* stroke_width - yep, border width
* stroke - color
* fill - color
* animate - flash centre of icon
</docs>

<template>
  <circle
    :cx="x + 20"
    :cy="y"
    :r="20 - stroke_width / 2"
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
  </circle>
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
