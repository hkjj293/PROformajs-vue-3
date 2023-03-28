
import MapIconTaskDebug from './lib-components/__debug__/MapIconTask.debug.vue';

<docs>
    Debug
</docs>

<template>
    <a class="btn btn-primary" data-bs-toggle="collapse" href="#collapseDebug" role="button" aria-expanded="false"
        aria-controls="collapseDebug">
        <h1>Dev Debug Mode</h1>
    </a>
    <div class="collapse" id="collapseDebug">
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
        <MapArrowDebug />
        <ReviewMapDebug />
        <ReviewDataBadgesDebug />
        <ReviewSettingsPopoverDebug />
        <ReviewhistoryAccordianDebug />
        <ReviewCompactDebug />
        <ReviewDebug />
        <ReviewFixedDebug />
        <ReviewCustomDebug />
        <ReviewMobileDebug />
        <ReviewTabbedTabsDebug />
        <ReviewTabbedDebug />
        <hr />
        <ComposeReviewDebug />
    </div>
</template>

<script>
import ReviewMapDebug from './lib-components/__debug__/ReviewMap.debug.vue'
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
import MapArrowDebug from './lib-components/__debug__/MapArrow.debug.vue';
import ReviewDataBadgesDebug from './lib-components/__debug__/ReviewDataBadges.debug.vue';
import ReviewSettingsPopoverDebug from './lib-components/__debug__/ReviewSettingsPopover.debug.vue';
import ReviewhistoryAccordianDebug from './lib-components/__debug__/ReviewhistoryAccordian.debug.vue';
import ReviewCompactDebug from './lib-components/__debug__/ReviewCompact.debug.vue';
import ReviewDebug from './lib-components/__debug__/Review.debug.vue';
import ReviewFixedDebug from './lib-components/__debug__/ReviewFixed.debug.vue';
import ReviewCustomDebug from './lib-components/__debug__/ReviewCustom.debug.vue';
import ReviewMobileDebug from './lib-components/__debug__/ReviewMobile.debug.vue';
import ReviewTabbedTabsDebug from './lib-components/__debug__/ReviewTabbedTabs.debug.vue';
import ReviewTabbedDebug from './lib-components/__debug__/ReviewTabbed.debug.vue';
import ComposeReviewDebug from './lib-components/__debug__/ComposeReview.debug.vue';

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
        MapBreadcrumbDebug,
        MapArrowDebug,
        ReviewMapDebug,
        ReviewDataBadgesDebug,
        ReviewSettingsPopoverDebug,
        ReviewhistoryAccordianDebug,
        ReviewCompactDebug,
        ReviewDebug,
        ReviewFixedDebug,
        ReviewCustomDebug,
        ReviewMobileDebug,
        ReviewTabbedTabsDebug,
        ReviewTabbedDebug,
        ComposeReviewDebug
    }
}
</script>