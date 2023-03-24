<docs>
    Debug for ReviewExpression
</docs>

<template>
    <div>
        <debug title="ReviewSettingsPopover">
            <ReviewSettingsPopover v-bind="testPRProps1" @change-option="updateOption" />
        </debug>
    </div>
</template>

<script>
import ReviewSettingsPopover from '../ReviewSettingsPopover.vue'

const reviewOptions = {
    Decision: {
        showInactiveArguments: true,
        showExpressions: true,
        allowDownloads: true
    },
    Enquiry: {
        useDefaults: true
    },
    Candidate: {
        autoConfirmRecommended: true
    },
    debug: true
}

const testPRProps1 = {
    options: reviewOptions,
    id: 'task-settings',
    debug: true,
    restart: true,
    placement: 'left'
}

export default {
    name: "ReviewSettingsPopoverDebug",
    data: function () {
        return {
            testPRProps1: testPRProps1,
        };
    },
    components: { ReviewSettingsPopover },
    methods: {
        updateOption(evt) {
            console.log(evt)
            if (evt.category) {
                this.testPRProps1.options[evt.category][evt.option] = evt.value
            } else {
                this.testPRProps1.options[evt.option] = evt.value
            }
            // a change in eqnuiry options requires restarting the enactment
            // if (evt.category == 'Enquiry') {
            //     this.resetEnactment()
            // }
        }
    }
}
</script>