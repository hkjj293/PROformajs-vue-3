<template>
  <g :transform="transform">
    <path
      d="m 5,1 l 4,0 -2,8 -4,0 -2,-8 4,0"
      style="fill: none; stroke: #feed2e; stroke-width: 1.44; stroke-linecap: square"
    />
  </g>
</template>

<script>
import { IconMixin } from '../Core/icon.js'
export default {
  mixins: [IconMixin]
}
</script>
