<docs>ComposeTask
    Debug for ComposeTask
</docs>

<template>
    <div>
        <debug title="ComposeTask">
            <ComposeTask :protocol="protocol" :path="selectedtask" :issues="selectedTaskIssues"
                @change-protocol="relayChangeEvent($event, 1)" @select-task="$emit('select-task', $event)" />
        </debug>
    </div>
</template >

<script>
import ComposeTask from '../../Compose/ComposeTask.vue'

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
            "caption": "A",
            "name": "a"
        }
    ],
    "tasks": [
        {
            "class": "Decision",
            "meta": {
                "pos": {
                    "x": 214.51445649762252,
                    "y": 127.53034646889859
                }
            },
            "caption": "Decision A",
            "name": "decisionA",
            "candidates": [
                {
                    "class": "Candidate",
                    "caption": "K",
                    "name": "k",
                    "recommendCondition": "net_support('k')>0",
                    "arguments": [
                        {
                            "class": "Argument",
                            "caption": "o",
                            "description": "l",
                            "support": 1,
                            "activeCondition": "true"
                        }
                    ]
                }
            ]
        },
        {
            "class": "Enquiry",
            "meta": {
                "pos": {
                    "x": 497.3297207586787,
                    "y": 101.24054004214884
                }
            },
            "caption": "Enquiry C",
            "name": "enquiryC",
            "sources": [
                {
                    "class": "Source",
                    "type": "df"
                }
            ]
        }
    ]
};

export default {
    name: 'ComposeTaskDebug',
    data: function () {
        return {
            protocol: new Protocol.Plan(template),
            enactmentOptions: {
                Enquiry: {
                    useDefaults: true
                }
            },
            enactment: null,
            path: "plan:enquiryC",
            selectedtask: "plan:enquiryC",
            jsonValid: true,
            issues: [],
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
    },
    computed: {
        selectedTaskIssues() {
            if (this.jsonValid) {
                let issues = this.protocol.validate().filter((issue) => issue.path.startsWith(this.selectedtask));
                return issues;
            } else {
                return [];
            }
        },
    },
    methods: {
        subComponentIssues(comp) {
            return this.issues.filter((issue) => issue.path.startsWith(comp));
        },
        relayChangeEvent(evt, idx) {
            evt.relay = "pc-task." + idx;
            this.$emit('change-protocol', evt);
        }
    },
    components: { ComposeTask }
}
</script>