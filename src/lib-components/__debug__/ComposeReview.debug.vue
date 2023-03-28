<docs>
    Debug for ComposeReview
</docs>

<template>
    <div>
        <debug title="ComposeReview">
            <ComposeReview :protocol="protocol" :debug="true" :initialData="startData"
                :template="protocol && protocol.meta && protocol.meta.enact && protocol.meta.enact.template ? protocol.meta.enact.template : 'compact'" />
        </debug>
    </div>
</template>

<script>
import ComposeReview from '../ComposeReview.vue'
import { Enactment, Protocol } from '@openclinical/proformajs'

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
    name: "ComposeReviewDebug",
    data: function () {
        return {
            selectedtask: template.name, // initial value,
            tab: 'compose',
            protocol: new Protocol.Plan(template),
            initialData: {},
        }
    },
    created: function () {
        // initial data can be passed in the querystring
        // see https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
        const urlParams = new URLSearchParams(window.location.search)
        for (let entry of urlParams.entries()) {
            this.initialData[entry[0]] = JSON.parse(entry[1])
        }
    },
    computed: {
        startData() {
            let result = {}
            if (this.initialData && Object.keys(this.initialData).length > 0) {
                result[this.protocol.name] = this.initialData
            }
            return result
        }
    },
    methods: {
        updateProtocol(e) {
            checkMeta(e.value);
            this.protocol = e.value
            if (e.selected) {
                this.selectedtask = e.selected
            }
            try {
                let selected = this.protocol.getComponent(this.selectedtask);
            } catch (e) {
                // drop back to root path in case of error, assumed caused by name changes
                this.selectedtask = this.protocol.name;
            }

        },
        resetProtocol(clazz) {
            if (clazz && ['Action', 'Decision', 'Enquiry'].indexOf(clazz) > -1) {
                let proto = new Protocol[clazz]({
                    name: clazz.toLowerCase(),
                    caption: clazz,
                    meta: { svg: { width: 400, height: 200 }, pos: { x: 190, y: 100 } }
                })
                this.protocol = proto
                this.selectedtask = clazz.toLowerCase()
            } else {
                this.protocol = new Protocol.Plan(template)
                this.selectedtask = template.name
            }
        },
        updateSelectedTask(evt) {
            this.selectedtask = evt.value
        }
    },
    components: { ComposeReview }
}
</script>
