<docs>
    Debug for ReviewExpression
</docs>

<template>
    <div>
        <debug title="MapIconTask">
            <svg ref="svg" width="100%" tabindex="0" :viewBox="viewbox">
                <g class="task draggable" @click="handleClick">
                    <MapIconTask v-bind="testPRProps1" />
                </g>
            </svg>
        </debug>
    </div>
</template>

<script>
import MapIconTask from '../../Core/MapIconTask.vue'
import { task_colors, discarded_color } from '../../Core/map.js'

const testPRProps1 = {
    x: 50,
    y: 50,
    stroke_width: 8,
    stroke: task_colors.task.done,
    fill: task_colors.task.done,
    animate: true
}

export default {
    name: 'MapIconTaskDebug',
    data: function () {
        return {
            testPRProps1: testPRProps1
        }
    },
    mounted: function () { },
    components: { MapIconTask }
}
</script>
