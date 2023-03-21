<docs>
Draws a temporal dependency between two tasks on the map.

# props

* sx, sy - source x, y
* tx, ty - target x, y
</docs>

<template>
  <g class="arrow" :data-source="source" :data-target="target"
    @dblclick="$emit('delete-arrow', { source: source, target: target })">
    <path :d="shaftPath" :stroke="arrowColor" stroke-width="3" />
    <path :d="headPath" :stroke="arrowColor" :fill="arrowColor" />
    <!--circle v-if="selected" :cx="sx" :cy="sy" r="4" fill="none" stroke="black"/-->
    <!--circle v-if="selected" :cx="tx" :cy="ty" r="4" fill="none" stroke="black"/-->
  </g>
</template>

<script>
export default {
  props: ['sx', 'sy', 'tx', 'ty', 'source', 'target', 'selected'],
  data: function () {
    return {
      arrowsize: 10
    }
  },
  computed: {
    shaftPath: function () {
      return 'M ' + this.sx + ' ' + this.sy + ' L ' + this.tx + ' ' + this.ty
    },
    headPath: function () {
      let theta = Math.atan2(this.ty - this.sy, this.tx - this.sx)
      let alpha = theta + (5 * Math.PI) / 6
      let beta = theta + (7 * Math.PI) / 6
      let a1 = {
        x: this.tx + this.arrowsize * Math.cos(alpha),
        y: this.ty + this.arrowsize * Math.sin(alpha)
      }
      let a2 = {
        x: this.tx + this.arrowsize * Math.cos(beta),
        y: this.ty + this.arrowsize * Math.sin(beta)
      }
      return (
        'M ' +
        this.tx +
        ' ' +
        this.ty +
        ' L ' +
        a1.x +
        ' ' +
        a1.y +
        ' L ' +
        a2.x +
        ' ' +
        a2.y +
        ' L ' +
        this.tx +
        ' ' +
        this.ty
      )
    },
    arrowColor: function () {
      return this.selected ? 'grey' : 'lightgrey'
    }
  },
  methods: {
    handleDoubleTap(evt) {
      if (evt.tapCount == 2) {
        this.$emit('delete-arrow', { source: this.source, target: this.target })
      }
    }
  }
}
</script>
