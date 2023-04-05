<docs>
    Debug for ComposeSource
</docs>

<template>
    <div>
        <debug title="ComposeSource">
            <ComposeSource :protocol="protocol" :path="sourcePath" @change-protocol="relayChangeEvent($event, 1)"
                @select-path="updateSourcePath" ref="sourceEditor" />
        </debug>
    </div>
</template>

<script>
import ComposeSource from '../../Compose/ComposeSource.vue'
import { Protocol } from '@openclinical/proformajs'

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
            name: 'actionA'
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
    name: 'ComposeSourceDebug',
    data: function () {
        return {
            protocol: new Protocol.Plan(template),
            sourcePath: "plan:enquiryB:a",
            tabIndex: 0
        }
    },
    methods: {
        updateSourcePath(evt) {
            this.sourcePath = evt.value;
            this.tabIndex = 1; // show Sources tab
        },
        relayChangeEvent(evt, idx) {
            evt.relay = "pc-task." + idx;
            this.$emit('change-protocol', evt);
        }
    },
    components: { ComposeSource }
}
</script>
