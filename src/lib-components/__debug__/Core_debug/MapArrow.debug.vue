<docs>
    Debug for ReviewExpression
</docs>

<template>
    <div>
        <debug title="MapArrow">
            <svg ref="svg" width="100%" tabindex="0" :viewBox="viewbox">
                <g class="task draggable" @click="handleClick">
                    <MapArrow v-bind="testPRProps1" />
                </g>
            </svg>
        </debug>
    </div>
</template>

<script>
import MapArrow from '../../Core/MapArrow.vue'

const template = {
    class: 'Plan',
    meta: {
        svg: {
            width: 800,
            height: 400
        }
    },
    caption: 'Plan',
    name: 'plan',
    autonomous: true,
    dataDefinitions: [
        {
            class: 'Integer',
            caption: 'A',
            name: 'a',
            valueCondition: '2'
        }
    ],
    tasks: [
        {
            class: 'Action',
            meta: {
                pos: {
                    x: 135.54356301541733,
                    y: 181.13459032695374
                }
            },
            caption: 'Action A',
            name: 'actionA'
        },
        {
            class: 'Plan',
            meta: {
                pos: {
                    x: 257.14920905916057,
                    y: 217.92286216470376
                }
            },
            caption: 'Plan C',
            name: 'planC',
            autonomous: true
        }
    ]
}

const testPRProps1 = {
    sx: 50.54356301541733,
    sy: 50.13459032695374,
    tx: 100.14920905916057,
    ty: 100.92286216470376,
    source: 'actionA',
    target: 'planC',
    selected: true
}

export default {
    name: 'MapArrowDebug',
    data: function () {
        return {
            testPRProps1: testPRProps1
        }
    },
    components: { MapArrow }
}
</script>
