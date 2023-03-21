<script>
import { placements } from "@popperjs/core";
import { Popover } from "bootstrap";

export default {
    name: "PopoverButton",
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
        }
    },
    computed: {
        classes() {
            return "btn" + " btn-" + this.varient
        }
    },
    data() {
        return { popover: null };
    },
    mounted() {
        this.popover = new Popover(this.$el)
    },
    watch: {
        msg: function (newMsg, oldMsg) {
            this.popover.setContent({ '.popover-body': newMsg })
        }
    }
}
</script>

<template>
    <button type="button" :class="classes" :data-bs-container="container" :data-bs-trigger="trigger"
        data-bs-toggle="popover" :data-bs-placement="placements" :data-bs-html="html" :data-bs-content="msg">
        <slot />
    </button>
</template>


<style>
p {
    margin: 0px;
    padding: 0px;
}
</style>