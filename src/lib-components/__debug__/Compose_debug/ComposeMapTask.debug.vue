<docs>
    Debug for ComposeMapTask
</docs>

<template>
    <div>
        <debug title="ComposeMapTask">
            <svg width="100%" tabindex="0" :viewBox="viewbox">
                <ComposeMapTask v-bind="testPRProps1" />
            </svg>
        </debug>
    </div>
</template>

<script>
import ComposeMapTask from '../../Compose/ComposeMapTask.vue'
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
            preCondition: "is_completed('actionA')",
            waitCondition: "is_finished('actionA')",
            autonomous: true
        }
    ]
}

const testPRProps1 = {
    task: { class: 'Task', constructor: { name: 'Task' } },
    x: 50,
    y: 50,
    stroke_width: 5,
    selected: true,
    no_handle: false,
    issues: [],
}

export default {
    name: 'ComposeMapTaskDebug',
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
        this.testPRProps1.task = this.protocol.getComponent('plan:actionA')
    },
    components: { ComposeMapTask }
}
</script>
