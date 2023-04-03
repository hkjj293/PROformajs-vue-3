<docs>
    Debug for ReviewSource
</docs>

<template>
    <div>
        <debug title="ReviewSource">
            <ReviewSource v-bind="testPRSource1" />
            <ReviewSource v-bind="testPRSource2" />
        </debug>
    </div>
</template>

<script>
import ReviewSource from '../ReviewSource.vue'

const testPRSource1 = {
    source: {
        class: 'Integer',
        caption: 'Age',
        description: '<b>Description of Age</b>',
        name: 'Age',
        defaultValue: 71,
        multiValued: false,
        value: 71,
        type: 'Age',
        requestCondition: "!is_known('Age')",
        path: 'EDACS7:Registration:Age',
        design: 'EDACS7:Registration:Age',
        requested: false
    },
    disabled: false,
    value: 0,
    suffix: '',
    showDescriptionInline: false,
    hideEraser: false,
    useButtons: false,
    hideCaption: false
}

const testPRSource2 = {
    source: {
        class: 'Text',
        caption: 'Age',
        description: '<b>Description of Age</b>',
        name: 'Age',
        defaultValue: "71",
        multiValued: false,
        value: "71",
        type: 'Age',
        requestCondition: "!is_known('Age')",
        path: 'EDACS7:Registration:Age2',
        design: 'EDACS7:Registration:Age2',
        requested: false
    },
    disabled: false,
    value: 0,
    suffix: '',
    showDescriptionInline: false,
    hideEraser: false,
    useButtons: false,
    hideCaption: false
}

export default {
    name: "ReviewSourceDebug",
    data: function () {
        return {
            testPRSource1: testPRSource1,
            testPRSource2: testPRSource2,
        };
    },
    components: { ReviewSource }
}
</script>