<docs>
    Debug for ReviewTask
</docs>

<template>
    <div>
        <debug title="ReviewTask">
            <ReviewTask v-bind="testPRProps1" @update-enactment="updateEnactment" @send-trigger="sendTrigger" />
        </debug>
    </div>
</template>

<script>
import ReviewTask from '../ReviewTask.vue'
import { Enactment, Protocol } from '@openclinical/proformajs'


const reviewOptions = {
    Decision: {
        showInactiveArguments: true,
        showExpressions: true,
        allowDownloads: true
    },
    Enquiry: {
        useDefaults: true
    },
    Candidate: {
        autoConfirmRecommended: true
    },
    debug: true
}

const testPRProps1 = {
    task: "",
    enactment: null,
    options: reviewOptions
}

const task = "plan:enquiryB"

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
            "caption": " B",
            "name": "B"
        }
    ],
    "tasks": [
        {
            "class": "Decision",
            "meta": {
                "pos": {
                    "x": 270.04226258851673,
                    "y": 137.24439206971024
                }
            },
            "caption": "Decision A",
            "name": "decisionA",
            "candidates": [
                {
                    "class": "Candidate",
                    "caption": "A",
                    "name": "a",
                    "recommendCondition": "net_support('a')>0",
                    "arguments": [
                        {
                            "class": "Argument",
                            "caption": "random() > 0.2",
                            "description": "Description 0",
                            "support": 1,
                            "activeCondition": "random() > 0.2"
                        },
                        {
                            "class": "Argument",
                            "caption": " random() > 0.4",
                            "description": "Description 1",
                            "support": 1,
                            "activeCondition": " random() > 0.4"
                        }
                    ]
                }
            ]
        },
        {
            "class": "Enquiry",
            "meta": {
                "pos": {
                    "x": 114.93010398272196,
                    "y": 132.0448634423179
                }
            },
            "caption": "Enquiry B",
            "name": "enquiryB",
            "sources": [
                {
                    "class": "Source",
                    "type": "B"
                }
            ]
        },
        {
            "class": "Action",
            "meta": {
                "pos": {
                    "x": 197.58842645773524,
                    "y": 32.22691806539074
                }
            },
            "caption": "Action C",
            "name": "actionC",
            "preCondition": "index()==2"
        },
        {
            "class": "Plan",
            "meta": {
                "pos": {
                    "x": 173.52608901109784,
                    "y": 251.02243172115897
                }
            },
            "caption": "Plan D",
            "name": "planD",
            "autonomous": true
        }
    ]
}

export default {
    name: "ReviewTaskDebug",
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
        this.testPRProps1.task = this.testPRProps1.enactment.getComponent(task)
    },
    methods: {
        updateEnactment(evt) {
            let enactment = this.testPRProps1.enactment
            // Debug pre complete states
            console.log(JSON.stringify(enactment._state))
            let update = {}
            console.log("Path to complete " + evt.path)
            switch (evt.action) {
                case 'complete':
                    enactment.complete(evt.path)
                    break
                case 'set':
                    update[evt.source] = evt.value
                    enactment.set(evt.path, update)
                    break
                case 'unset':
                    enactment.unset(evt.path, evt.source)
                    break
                case 'confirm':
                    enactment.confirm(evt.path)
                    break
                case 'unconfirm':
                    enactment.unconfirm(evt.path)
                    break
            }
            this.testPRProps1.enactment = enactment
            this.testPRProps1.task = this.testPRProps1.enactment.getComponent(task)
            // Debug post complete states
            console.log(JSON.stringify(enactment._state))
            console.log(enactment)
        },
        sendTrigger(trigger) {
            let enactment = this.testPRProps1.enactment
            enactment.sendTrigger(trigger)
            this.$emit('change-enactment', { value: enactment, action: 'trigger', trigger: trigger })
            this.testPRProps1.enactment = enactment
            this.testPRProps1.task = this.testPRProps1.enactment.getComponent(task)
        }
    },
    components: { ReviewTask }
}
</script>