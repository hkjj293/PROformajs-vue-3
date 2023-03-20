<script>
import { Popover } from "bootstrap";

export default {
    name: "PopoverButton",
    props: {
        msg: {
            type: String,
            required: true
        },
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
    <button type="button" class="btn btn-link" data-bs-container="body" data-bs-trigger="hover focus"
        data-bs-toggle="popover" data-bs-placement="top" data-bs-html='true' :data-bs-content="msg">
        <slot />
    </button>
</template>


<style>
p {
    margin: 0px;
    padding: 0px;
}
</style>