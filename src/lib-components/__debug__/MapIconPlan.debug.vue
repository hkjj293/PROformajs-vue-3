<docs>
    Debug for ReviewExpression
</docs>

<template>
    <div>
        <debug title="MapIconPlan">
            <svg ref="svg" width="100%" tabindex="0" :viewBox="viewbox">
                <g class="task draggable" @click="handleClick">
                    <MapIconPlan v-bind="testPRProps1" />
                </g>
            </svg>
        </debug>
    </div>
</template>

<script>
import MapIconPlan from '../MapIconPlan.vue'
import { task_colors, discarded_color } from '../map.js'

const testPRProps1 = {
    x: 50,
    y: 50,
    stroke_width: 8,
    stroke: task_colors.plan.done,
    fill: task_colors.plan.done,
    animate: true
}

export default {
    name: "MapIconPlanDebug",
    data: function () {
        return {
            testPRProps1: testPRProps1,
        };
    },
    mounted: function () {

    },
    components: { MapIconPlan }
}
</script>