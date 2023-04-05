<docs>
    Debug for ComposeNonTemporalCondition
</docs>

<template>
    <div>
        <debug title="ComposeNonTemporalCondition">
            <ComposeNonTemporalCondition att="waitCondition" :comp="task" @change-attribute="updateAttribute"
                :issues="attributeIssues('waitCondition')" />
        </debug>
    </div>
</template >

<script>
import ComposeNonTemporalCondition from '../../Compose/ComposeNonTemporalCondition.vue'
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

export default {
    name: 'ComposeNonTemporalConditionDebug',
    data: function () {
        return {
            protocol: new Protocol.Plan(template),
            enactmentOptions: {
                Enquiry: {
                    useDefaults: true
                }
            },
            enactment: null,
            path: "plan:actionA",
            selectedtask: "plan:actionA",
            jsonValid: true
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
        attributeIssues(att) {
            return this.selectedTaskIssues.filter((issue) => issue.attribute == att);
        },
    },
    components: { ComposeNonTemporalCondition }
}
</script>
