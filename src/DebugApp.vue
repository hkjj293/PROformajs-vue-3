<docs>
    Debug
</docs>

<template>
    <h1>Dev Debug Mode</h1>
    <hr>
    <ReviewSourceDebug />
    <ReviewExpressionDebug />
</template>

<script>
import ReviewExpressionDebug from './lib-components/__debug__/ReviewExpression.debug.vue';
import ReviewSourceDebug from './lib-components/__debug__/ReviewSource.debug.vue'

export default {
    name: "DebugApp",
    components: {
        ReviewSourceDebug,
        ReviewExpressionDebug
    }
}
</script>