<template></template>

<script>
import { Popover } from 'bootstrap'
import { nextTick } from 'vue'

const props = {
    target: {
        type: String,
        require: true
    },
    html: {
        type: Boolean,
        default: true
    },
    placement: {
        type: String,
        default: 'top'
    },
    trigger: {
        type: String,
        default: 'hover'
    },
    container: {
        type: String,
        default: 'body'
    },
    title: {
        type: String,
        default: 'Title'
    },
    noTitle: {
        type: Boolean,
        default: false
    }
}

export default {
    name: 'PopoverComp',
    props: props,
    data() {
        return {
            popover: null
        }
    },
    mounted() {
        document.addEventListener('click', this.onClick);
        nextTick(() => {
            this.configTargetbutton()
            this.popover = new Popover(document.getElementById(this.target), { sanitize: false })
            console.log(this.$slots.default())
            let content = {
                '.popover-body': 'l',
                '.popover-header': this.noTitle ? null : this.title
            }
            this.popover.setContent(content)
        })
    },
    beforeUnmount() {
        document.removeEventListener('click', this.onClick)
    },
    methods: {
        configTargetbutton: function () {
            const target = document.getElementById(this.target)
            target.setAttribute('data-bs-container', this.container)
            target.setAttribute('data-bs-trigger', this.trigger)
            target.setAttribute('data-bs-toggle', 'popover')
            target.setAttribute('data-bs-placement', this.placement)
            target.setAttribute('data-bs-html', this.html)
            target.setAttribute('data-bs-title', this.noTitle ? null : this.title)
            target.setAttribute('data-bs-content', 'Content')
        },
        onClick: function (event) {
            if (this.popover.tip &&
                !(document.getElementById(this.popover.tip.id).contains(event.target))) {
                this.popover.hide();
            }
        }
    }
}
</script>