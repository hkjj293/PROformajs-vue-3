<docs>
Draws a TaskMap caption handle to suggest dragability

# props

* x, y - coords of the bottom right of the handle
</docs>

<template>
  <g class="grabbable">
    <circle color="lightgray" fill="lightgray" :cy="y - 9" :cx="x - 1" r="1"></circle>
    <circle color="lightgray" fill="lightgray" :cy="y - 5" :cx="x - 1" r="1"></circle>
    <circle color="lightgray" fill="lightgray" :cy="y - 1" :cx="x - 1" r="1"></circle>
    <circle color="lightgray" fill="lightgray" :cy="y - 9" :cx="x - 4" r="1"></circle>
    <circle color="lightgray" fill="lightgray" :cy="y - 5" :cx="x - 4" r="1"></circle>
    <circle color="lightgray" fill="lightgray" :cy="y - 1" :cx="x - 4" r="1"></circle>
  </g>
</template>

<script>
export default {
  props: {
    x: Number,
    y: Number
  }
}
</script>

<style scoped>
.grabbable {
  cursor: grab;
}
</style>
