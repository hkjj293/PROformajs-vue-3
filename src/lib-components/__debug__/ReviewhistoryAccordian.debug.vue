<docs>
    Debug for ReviewHistoryAccordian
</docs>

<template>
    <div>
        <debug title="ReviewHistoryAccordian">
            <ReviewHistoryAccordian v-bind="testPRProps1" />
        </debug>
    </div>
</template>

<script>
import ReviewHistoryAccordian from '../ReviewHistoryAccordian.vue'
import { Enactment, Protocol } from '@openclinical/proformajs'


const testPRProps1 = {
    enactment: { _audit: "" }
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
    name: "ReviewHistoryAccordianDebug",
    data: function () {
        return {
            testPRProps1: testPRProps1,
            protocol: new Protocol.Plan(template),
            enactmentOptions: {
                Enquiry: {
                    useDefaults: true
                }
            }
        };
    },

    mounted: function () {
        let local = new Enactment({
            start: true,
            protocol: this.protocol,
            options: this.enactmentOptions
        })
        let json = JSON.stringify(local)
        this.testPRProps1.enactment = Enactment.inflate(json)
    },
    components: { ReviewHistoryAccordian }
}
</script>