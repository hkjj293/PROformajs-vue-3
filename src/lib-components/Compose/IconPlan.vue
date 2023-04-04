<template>
  <g :transform="transform">
    <rect x="1" y="1" width="10" height="8" rx="2" ry="2" style="fill:none;stroke:#ffbf00;stroke-width:2" />
  </g>
</template>

<script>
import { IconMixin } from '../Core/icon.js';
export default {
  mixins: [IconMixin]
}
</script>
