<docs>
    Debug for ReviewExpression
</docs>

<template>
    <div>
        <debug title="MapIconEnquiry">
            <svg ref="svg" width="100%" tabindex="0" :viewBox="viewbox">
                <g class="task draggable" @click="handleClick">
                    <MapIconEnquiry v-bind="testPRProps1" />
                </g>
            </svg>
        </debug>
    </div>
</template>

<script>
import MapIconEnquiry from '../Core/MapIconEnquiry.vue'
import { task_colors, discarded_color } from '../Core/map.js'

const testPRProps1 = {
    x: 50,
    y: 50,
    stroke_width: 8,
    stroke: task_colors.enquiry.done,
    fill: task_colors.enquiry.done,
    animate: true
}

export default {
    name: 'MapIconEnquiryDebug',
    data: function () {
        return {
            testPRProps1: testPRProps1
        }
    },
    mounted: function () { },
    components: { MapIconEnquiry }
}
</script>
