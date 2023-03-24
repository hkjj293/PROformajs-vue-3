<script>
import { Popover } from "bootstrap"

export default {
    name: "PopoverButton",
    emits: ['show'],
    props: {
        msg: {
            type: String,
            required: true
        },
        varient: {
            type: String,
            default: "link"
        },
        html: {
            type: Boolean,
            default: true
        },
        placements: {
            type: String,
            default: "top"
        },
        trigger: {
            type: String,
            default: "hover"
        },
        container: {
            type: String,
            default: "body"
        },
        title: {
            type: String,
            default: "Title"
        },
    },
    computed: {
        classes() {
            return "btn" + " btn-" + this.varient
        }
    },
    data() {
        return { popover: null }
    },
    mounted() {
        this.popover = new Popover(this.$el, { sanitize: false })
        this.$el.addEventListener('shown.bs.popover', this.onShown)
    },
    watch: {
        msg: function (newMsg, oldMsg) {
            if (newMsg != oldMsg) {
                this.popover.setContent({ '.popover-body': newMsg })
            }
        },
        title: function (newTitle, oldTitle) {
            this.popover.setContent({ '.popover-header': newTitle })
        }
    },
    methods: {
        onShown(evt) {
            this.$emit("show")
        }
    }
}
</script>

<template>
    <button type="button" :class="classes" :data-bs-container="container" :data-bs-trigger="trigger"
        data-bs-toggle="popover" :data-bs-placement="placements" :data-bs-html="html" :data-bs-title="title ? title : null"
        :data-bs-content="msg">
        <slot />
    </button>
</template>


<style>
p {
    margin: 0px;
    padding: 0px;
}
</style>