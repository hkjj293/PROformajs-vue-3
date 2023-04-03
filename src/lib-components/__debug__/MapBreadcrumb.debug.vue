<docs>
    Debug for ReviewExpression
</docs>

<template>
    <div>
        <debug title="MapBreadcrumb">
            <svg ref="svg" width="100%" tabindex="0" :viewBox="viewbox">
                <g class="task draggable" @click="handleClick">
                    <MapBreadcrumb v-bind="testPRProps1" />
                </g>
            </svg>
        </debug>
    </div>
</template>

<script>
import MapBreadcrumb from '../Core/MapBreadcrumb.vue'
import { Enactment, Protocol } from '@openclinical/proformajs'

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
    plan: template,
    offset: 0,
    height: 30,
    width: 400,
    selected: true,
    review: true,
    issues: []
}

export default {
    name: 'MapBreadcrumbDebug',
    data: function () {
        return {
            testPRProps1: testPRProps1,
            protocol: new Protocol.Plan(template),
            enactmentOptions: {
                Enquiry: {
                    useDefaults: true
                }
            },
            enactment: null
        }
    },

    mounted: function () {
        let local = new Enactment({
            start: true,
            protocol: this.protocol,
            options: this.enactmentOptions
        })
        let json = JSON.stringify(local)
        this.enactment = Enactment.inflate(json)
        this.testPRProps1.plan = this.enactment.protocol.getComponent('plan:actionA')
        console.log(this.testPRProps1.plan)
    },
    components: { MapBreadcrumb }
}
</script>
