
import MapIconTaskDebug from './lib-components/__debug__/MapIconTask.debug.vue';

<docs>
    Debug
</docs>

<template>
    <h1>Dev Debug Mode</h1>
    <hr>
    <ReviewSourceDebug />
    <ReviewExpressionDebug />
    <ReviewTaskDebug />
    <debug title="MapIcons">
        <MapIconTaskDebug />
        <MapIconDecisionDebug />
        <MapIconPlanDebug />
        <MapIconEnquiryDebug />
        <MapIconActionDebug />
    </debug>
    <ReviewMapTaskDebug />
    <MapBreadcrumbDebug />
</template>

<script>
import MapIconPlanDebug from './lib-components/__debug__/MapIconPlan.debug.vue';
import MapIconDecisionDebug from './lib-components/__debug__/MapIconDecision.debug.vue';
import MapIconTaskDebug from './lib-components/__debug__/MapIconTask.debug.vue';
import ReviewExpressionDebug from './lib-components/__debug__/ReviewExpression.debug.vue';
import ReviewSourceDebug from './lib-components/__debug__/ReviewSource.debug.vue'
import ReviewTaskDebug from './lib-components/__debug__/ReviewTask.debug.vue';
import MapIconEnquiryDebug from './lib-components/__debug__/MapIconEnquiry.debug.vue';
import MapIconActionDebug from './lib-components/__debug__/MapIconAction.debug.vue';
import ReviewMapTaskDebug from './lib-components/__debug__/ReviewMapTask.debug.vue';
import MapBreadcrumbDebug from './lib-components/__debug__/MapBreadcrumb.debug.vue';

export default {
    name: "DebugApp",
    components: {
        ReviewSourceDebug,
        ReviewExpressionDebug,
        ReviewTaskDebug,
        MapIconTaskDebug,
        MapIconDecisionDebug,
        MapIconPlanDebug,
        MapIconEnquiryDebug,
        MapIconActionDebug,
        ReviewMapTaskDebug,
        MapBreadcrumbDebug
    }
}
</script>