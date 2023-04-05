import MapIconTaskDebug from './lib-components/__debug__/MapIconTask.debug.vue';

<docs>
    Debug
</docs>

<template>
  <a class="btn btn-primary" data-bs-toggle="collapse" href="#collapseDebugReview" role="button" aria-expanded="false"
    aria-controls="collapseDebugReview">
    <h1>Dev Debug Mode (Reivew)</h1>
  </a>
  <div class="collapse" id="collapseDebugReview">
    <hr />
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
  <br />
  <br />
  <a class="btn btn-primary" data-bs-toggle="collapse" href="#collapseDebugCompose" role="button" aria-expanded="false"
    aria-controls="collapseDebugCompose">
    <h1>Dev Debug Mode (Compose)</h1>
  </a>
  <div class="collapse" id="collapseDebugCompose">
    <hr />
    <MapTaskHandleDebug />
    <ComposeMapTaskDebug />
    <MapTaskBarDebug />
    <ComposeMapDebug />
    <ComposeIconDebug />
    <ComposeTreeDebug />
    <ComposeNonTemporalConditionDebug />
    <ComposeSourceDebug />
    <ComposeCheckboxDebug />
    <ComposeConditionDebug />
  </div>
</template>

<script>
import ReviewMapDebug from './lib-components/__debug__/Review_debug/ReviewMap.debug.vue'
import MapIconPlanDebug from './lib-components/__debug__/Core_debug/MapIconPlan.debug.vue'
import MapIconDecisionDebug from './lib-components/__debug__/Core_debug/MapIconDecision.debug.vue'
import MapIconTaskDebug from './lib-components/__debug__/Core_debug/MapIconTask.debug.vue'
import ReviewExpressionDebug from './lib-components/__debug__/Review_debug/ReviewExpression.debug.vue'
import ReviewSourceDebug from './lib-components/__debug__/Review_debug/ReviewSource.debug.vue'
import ReviewTaskDebug from './lib-components/__debug__/Review_debug/ReviewTask.debug.vue'
import MapIconEnquiryDebug from './lib-components/__debug__/Core_debug/MapIconEnquiry.debug.vue'
import MapIconActionDebug from './lib-components/__debug__/Core_debug/MapIconAction.debug.vue'
import ReviewMapTaskDebug from './lib-components/__debug__/Review_debug/ReviewMapTask.debug.vue'
import MapBreadcrumbDebug from './lib-components/__debug__/Core_debug/MapBreadcrumb.debug.vue'
import MapArrowDebug from './lib-components/__debug__/Core_debug/MapArrow.debug.vue'
import ReviewDataBadgesDebug from './lib-components/__debug__/Review_debug/ReviewDataBadges.debug.vue'
import ReviewSettingsPopoverDebug from './lib-components/__debug__/Review_debug/ReviewSettingsPopover.debug.vue'
import ReviewhistoryAccordianDebug from './lib-components/__debug__/Review_debug/ReviewhistoryAccordian.debug.vue'
import ReviewCompactDebug from './lib-components/__debug__/Review_debug/ReviewCompact.debug.vue'
import ReviewDebug from './lib-components/__debug__/Review_debug/Review.debug.vue'
import ReviewFixedDebug from './lib-components/__debug__/Review_debug/ReviewFixed.debug.vue'
import ReviewCustomDebug from './lib-components/__debug__/Review_debug/ReviewCustom.debug.vue'
import ReviewMobileDebug from './lib-components/__debug__/Review_debug/ReviewMobile.debug.vue'
import ReviewTabbedTabsDebug from './lib-components/__debug__/Review_debug/ReviewTabbedTabs.debug.vue'
import ReviewTabbedDebug from './lib-components/__debug__/Review_debug/ReviewTabbed.debug.vue'
import ComposeReviewDebug from './lib-components/__debug__/Review_debug/ComposeReview.debug.vue'
import MapTaskHandleDebug from './lib-components/__debug__/Compose_debug/MapTaskHandle.debug.vue'
import ComposeMapTaskDebug from './lib-components/__debug__/Compose_debug/ComposeMapTask.debug.vue'
import MapTaskBarDebug from './lib-components/__debug__/Compose_debug/MapTaskBar.debug.vue'
import ComposeMapDebug from './lib-components/__debug__/Compose_debug/ComposeMap.debug.vue'
import ComposeIconDebug from './lib-components/__debug__/Compose_debug/ComposeIcon.debug.vue'
import ComposeTreeDebug from './lib-components/__debug__/Compose_debug/ComposeTree.debug.vue'
import ComposeNonTemporalConditionDebug from './lib-components/__debug__/Compose_debug/ComposeNonTemporalCondition.debug.vue'
import ComposeSourceDebug from './lib-components/__debug__/Compose_debug/ComposeSource.debug.vue'
import ComposeCheckboxDebug from './lib-components/__debug__/Compose_debug/ComposeCheckbox.debug.vue'
import ComposeConditionDebug from './lib-components/__debug__/Compose_debug/ComposeCondition.debug.vue'

export default {
  name: 'DebugApp',
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
    ComposeReviewDebug,
    MapTaskHandleDebug,
    ComposeMapTaskDebug,
    MapTaskBarDebug,
    ComposeMapDebug,
    ComposeIconDebug,
    ComposeTreeDebug,
    ComposeNonTemporalConditionDebug,
    ComposeSourceDebug,
    ComposeCheckboxDebug,
    ComposeConditionDebug
  }
}
</script>
