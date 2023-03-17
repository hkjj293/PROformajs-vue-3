<script>
import { Popover } from "bootstrap";

export default {
    name: "PopoverButton",
    props: {
        msg: {
            type: String,
            required: true
        },
        targetId: {
            type: String,
            required: false
        }
    },
    mounted() {
        new Popover(this.$el)
    },
    watch: {
        msg: function (newMsg, oldMsg) {
            (new Popover(this.$el)).setContent({ '.popover-body': '<div>Hello world</div>' })
        }
    }
}
</script>

<template>
    <button type="button" class="btn btn-link" data-bs-container="body" data-bs-trigger="hover focus"
        data-bs-toggle="popover" data-bs-placement="top" data-bs-html='true' :data-bs-content="msg">
        <slot />
    </button>
</template>
