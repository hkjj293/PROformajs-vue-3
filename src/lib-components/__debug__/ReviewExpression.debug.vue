<docs>
    Debug for ReviewExpression
</docs>

<template>
    <div>
        <debug title="ReviewExpression">
            <ReviewExpression v-bind="testPRProps1" />
        </debug>
    </div>
</template>

<script>
import ReviewExpression from '../ReviewExpression.vue'
import { Enactment, Protocol } from '@openclinical/proformajs'


const testPRProps1 = {
    id: "",
    enactment: null,
    path: "",
    description: ""
}

const template = {
    class: 'Plan',
    name: 'plan',
    caption: 'Plan',
    dataDefinitions: [],
    tasks: [],
    autonomous: true,
    meta: {
        svg: {
            width: 800,
            height: 400
        }
    }
}

export default {
    name: "ReviewExpressionDebug",
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
    components: { ReviewExpression }
}
</script>