<docs>
    Debug for ComposeCandidate
</docs>

<template>
    <div>
        <debug title="ComposeCandidate">
            <ComposeCandidate :protocol="protocol" :path="candidatePath" @change-protocol="relayChangeEvent($event, 2)"
                @select-path="updateCandidatePath" ref="candidateEditor" :issues="subComponentIssues(candidatePath)" />
        </debug>
    </div>
</template >

<script>
import ComposeCandidate from '../../Compose/ComposeCandidate.vue'

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
            name: 'a'
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
            name: 'actionA',
            cyclic: true
        },
        {
            class: "Enquiry",
            meta: {
                pos: {
                    x: 372.6915158116656,
                    y: 101.34660723319621
                }
            },
            caption: "Enquiry B",
            name: "enquiryB",
            sources: [
                {
                    class: "Source",
                    type: "a"
                }
            ],
            cyclic: true
        },
        {
            "class": "Decision",
            "meta": {
                "pos": {
                    "x": 366.8865885462589,
                    "y": 151.96591271848806
                }
            },
            "caption": "Decision A",
            "name": "decisionA",
            "candidates": [
                {
                    "class": "Candidate",
                    "caption": "I",
                    "name": "i",
                    "recommendCondition": "net_support('i')>0",
                    "arguments": [
                        {
                            "class": "Argument",
                            "caption": "k",
                            "support": 1,
                            "activeCondition": "k"
                        }
                    ]
                }
            ]
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

export default {
    name: 'ComposeCandidateDebug',
    data: function () {
        return {
            protocol: new Protocol.Plan(template),
            enactmentOptions: {
                Enquiry: {
                    useDefaults: true
                }
            },
            enactment: null,
            path: "plan:decisionA",
            candidatePath: "plan:decisionA:i",
            selectedtask: "plan:decisionA",
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
        task() {
            let component;
            try {
                component = this.protocol.getComponent(this.path);
            } catch (e) {
                component = this.protocol;
            }
            return component;
        },
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
        updateCandidatePath(evt) {
            this.argumentPath = evt.value;
            this.tabIndex = 1; // show Arguments tab
        },
        updateAttribute(evt) {
            // There is no setComponent method in a PROformajs protocol so we focus on attributes instead
            let comp = this.protocol.getComponent(this.path);
            if (evt.name == "name") {
                // update temporal constraints of tasks that depend on this one
                if (evt.value != null && evt.value.length > 0) {
                    for (let depname of this.getForwardDeps(comp)) {
                        let dep = this.protocol.getComponent(comp._parent.path() + ":" + depname);
                        dep.waitCondition = dep.waitCondition.replace(comp.name, evt.value);
                        dep.preCondition = dep.preCondition.replace(comp.name, evt.value);
                    };
                }
            }
            let newevt = { value: this.protocol };
            if (evt.value == null || evt.value.length == 0) {
                comp[evt.name] = null;
            } else {
                comp[evt.name] = evt.value;
            }
            if (evt.name == "name") {
                // changing the name will change the path, so the selectedtask path needs updating
                newevt.selected = comp.path();
            }
            newevt.emitter = "pc-task.0";
            this.$emit('change-protocol', newevt);
        },
        subComponentIssues(comp) {
            return this.issues.filter((issue) => issue.path.startsWith(comp));
        },
        relayChangeEvent(evt, idx) {
            evt.relay = "pc-task." + idx;
            this.$emit('change-protocol', evt);
        }
    },
    components: { ComposeCandidate }
}
</script>