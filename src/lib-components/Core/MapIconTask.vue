<docs>
Draws a PROformajs Protocol.Task svg "icon"

# props

* x, y - coords of bottom mid left side of task
* stroke_width - yep, border width
* stroke - color
* fill - color
* animate - flash centre of icon
</docs>

<template>
  <path :d="taskPath" :stroke-width="stroke_width" :stroke="stroke" :fill="fill">
    <animate
      v-if="animate"
      attributeName="fill"
      dur="1s"
      begin="0s"
      repeatCount="indefinite"
      :values="stroke + ';#FFF;' + stroke"
    />
  </path>
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
  },
  computed: {
    taskPath: function () {
      return (
        'M ' +
        (this.x + this.stroke_width + this.stroke_width / 2) +
        ' ' +
        (this.y - 20 + this.stroke_width / 2) +
        ' L ' +
        (this.x + 40 - this.stroke_width / 2) +
        ' ' +
        (this.y - 20 + this.stroke_width / 2) +
        ' L ' +
        (this.x + 32 - this.stroke_width / 2) +
        ' ' +
        (this.y + 20 - this.stroke_width / 2) +
        ' L ' +
        (this.x + 8 + this.stroke_width / 2) +
        ' ' +
        (this.y + 20 - this.stroke_width / 2) +
        ' L ' +
        (this.x + this.stroke_width / 2) +
        ' ' +
        (this.y - 20 + this.stroke_width / 2) +
        ' L ' +
        (this.x + this.stroke_width + this.stroke_width / 2) +
        ' ' +
        (this.y - 20 + this.stroke_width / 2)
      )
    }
  }
}
</script>
