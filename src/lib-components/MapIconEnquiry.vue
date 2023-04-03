<docs>
Draws a PROformajs Protocol.Enquiry svg "icon"

# props

* x, y - coords of bottom mid left side of task
* stroke_width - yep, border width
* stroke - color
* fill - color
* animate - flash centre of icon
</docs>

<template>
  <path
    :d="taskPath"
    :stroke-width="stroke_width"
    stroke-linecap="square"
    :fill="fill"
    :stroke="stroke"
  >
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
        (this.x + this.stroke_width / 2) +
        ' ' +
        this.y +
        ' L ' +
        (this.x + 20) +
        ' ' +
        (this.y - 20 + this.stroke_width / 2) +
        ' L ' +
        (this.x + 40 - this.stroke_width / 2) +
        ' ' +
        this.y +
        ' L ' +
        (this.x + 20) +
        ' ' +
        (this.y + 20 - this.stroke_width / 2) +
        ' L ' +
        (this.x + this.stroke_width / 2) +
        ' ' +
        this.y
      )
    }
  }
}
</script>
