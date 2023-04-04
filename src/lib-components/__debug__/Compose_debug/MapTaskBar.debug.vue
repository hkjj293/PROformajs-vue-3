<docs>
    Debug for MapTaskBar
</docs>

<template>
    <div>
        <debug title="MapTaskBar">
            <svg ref="svg" width="100%" :height="testPRProps1.height" tabindex="0" :viewBox="viewbox">
                <MapTaskBar v-bind="testPRProps1" />
            </svg>
        </debug>
    </div>
</template>

<script>
import MapTaskBar from '../../Compose/MapTaskBar.vue'


const testPRProps1 = {
    layout: {
        //          Task: {x: 15, y: 25},
        Action: { x: 17, y: 25 },
        Enquiry: { x: 15, y: 100 },
        Decision: { x: 15, y: 175 },
        Plan: { x: 10, y: 250 },
        //          Action: {x: 17, y: 325}
    },
    stroke_width: 5,
    width: 80,
    height: 300,
}

export default {
    name: 'MapTaskBarDebug',
    data: function () {
        return {
            testPRProps1: testPRProps1,
        }
    },
    components: { MapTaskBar }
}
</script>
