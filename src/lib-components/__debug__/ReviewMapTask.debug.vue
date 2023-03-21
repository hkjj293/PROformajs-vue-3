<docs>
    Debug for ReviewExpression
</docs>

<template>
    <div>
        <debug title="ReviewMapTask">
            <svg ref="svg" width="100%" tabindex="0" :viewBox="viewbox">
                <g class="task draggable" @click="handleClick">
                    <ReviewMapTask :key="'plan:actionA'" v-bind="testPRProps1" />
                </g>
            </svg>
        </debug>
    </div>
</template>

<script>
import ReviewMapTask from '../ReviewMapTask.vue'
import { Enactment, Protocol } from '@openclinical/proformajs'


const testPRProps1 = {
    task: { class: 'Task' },
    x: 50,
    y: 50,
    stroke_width: 8,
    selected: true
}

const template = {
    "class": "Plan",
    "meta": {
        "svg": {
            "width": 800,
            "height": 400
        }
    },
    "caption": "Plan",
    "name": "plan",
    "autonomous": true,
    "dataDefinitions": [
        {
            "class": "Integer",
            "caption": "A",
            "name": "a",
            "valueCondition": "2"
        }
    ],
    "tasks": [
        {
            "class": "Action",
            "meta": {
                "pos": {
                    "x": 135.54356301541733,
                    "y": 181.13459032695374
                }
            },
            "caption": "Action A",
            "name": "actionA"
        }
    ]
}

export default {
    name: "ReviewMapTaskDebug",
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
        };
    },

    created: function () {
        let local = new Enactment({
            start: true,
            protocol: this.protocol,
            options: this.enactmentOptions
        })
        let json = JSON.stringify(local)
        this.enactment = Enactment.inflate(json)
        this.testPRProps1.task = this.enactment.getComponent(this.enactment.runtimeFromDesignPath('plan:actionA'))
        console.log(this.testPRProps1.task)
    },
    components: { ReviewMapTask }
}
</script>