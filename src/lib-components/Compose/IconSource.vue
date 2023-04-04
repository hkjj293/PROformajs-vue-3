<template>
  <g :transform="transform">
    <path d="m 5,2 l 3,3 -3,3 -3,-3 3,-3" style="fill:#00ff40;" />
  </g>
</template>

<script>
import { IconMixin } from '../Core/icon.js';
export default {
  mixins: [IconMixin]
}
</script>
