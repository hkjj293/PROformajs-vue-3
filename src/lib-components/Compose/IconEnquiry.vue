<template>
  <g :transform="transform">
    <path d="m 5,1 l 4,4 -4,4 -4,-4 4,-4" style="fill:none;stroke:#00ff40;stroke-width:1.44;stroke-linecap:square" />
  </g>
</template>

<script>
import { IconMixin } from '../Core/icon.js';
export default {
  mixins: [IconMixin]
}
</script>
