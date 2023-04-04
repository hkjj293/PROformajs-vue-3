<template>
  <g :transform="transform">
    <rect x="2" y="2" width="6" height="6" style="fill:none;stroke:#3BD2FF;stroke-width:2" />
  </g>
</template>

<script>
import { IconMixin } from '../Core/icon.js';
export default {
  mixins: [IconMixin]
}
</script>
