<docs>
    Debug for ComposeMap
</docs>

<template>
    <div>
        <debug title="ComposeMap">
            <ComposeMap v-bind="testPRProps1" @select-task="$emit('select-task', $event)"
                @delete-task="$refs.deleteTaskModal.show()" />
            <div hidden ref="deleteTaskModal">Hi</div>
        </debug>
    </div>
</template>

<script>
import ComposeMap from '../../Compose/ComposeMap.vue'
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
    protocol: new Protocol.Plan(template),
    selectedTask: "",
    issues: []
}

export default {
    name: 'ComposeMapDebug',
    data: function () {
        return {
            testPRProps1: testPRProps1,
            protocol: new Protocol.Plan(template),
            enactmentOptions: {
                Enquiry: {
                    useDefaults: true
                }
            },
            enactment: null,
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
        this.testPRProps1.selectedTask = this.protocol.getComponent('plan:actionA')
        this.testPRProps1.issues = this.allIssues;
    },
    computed: {
        allIssues() {
            return this.jsonValid ? this.protocol.validate() : [];
        },
    },
    methods: {
        selectTask(path) {
            function parentTask(comp) {
                if (comp instanceof Protocol.Task) {
                    return comp;
                } else {
                    if (comp._parent) {
                        return parentTask(comp._parent);
                    }
                }
            }
            const task = parentTask(this.protocol.getComponent(path)).path();
            this.testPRProps1.selectedTask = task;
            this.$emit('select-task', { value: task });
        },
    },
    components: { ComposeMap }
}
</script>
