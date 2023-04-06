<docs>
    Debug for ComposeIcon
</docs>

<template>
    <div>
        <debug title="ComposeIcon">
            <svg v-for="icon in testPRProps1.icons" width="100%" tabindex="0" :viewBox="viewbox">
                <ComposeIcon :icon="icon" />
            </svg>
        </debug>
    </div>
</template>

<script>
import ComposeIcon from '../../Compose/ComposeIcon.vue'


const testPRProps1 = {
    icons: ['Candidate', 'Decision', 'Enquiry', 'Plan', 'Source', 'Task', 'Action']
}

export default {
    name: 'ComposeIconDebug',
    data: function () {
        return {
            testPRProps1: testPRProps1,
        }
    },
    components: { ComposeIcon }
}
</script>
