<template>
  <svg
     xmlns:svg="http://www.w3.org/2000/svg"
     xmlns="http://www.w3.org/2000/svg"
     :width="width"
     :height="height">
     <component v-bind:is="iconComponent" :scale="scale"/>
  </svg>
</template>

<script>
  import IconCandidate from './IconCandidate.vue';
  import IconDecision from './IconDecision.vue';
  import IconEnquiry from './IconEnquiry.vue';
  import IconPlan from './IconPlan.vue';
  import IconSource from './IconSource.vue';
  import IconTask from './IconTask.vue';
  import IconAction from './IconAction.vue';

  export default {
    name: 'pc-icon',
    props: {
      icon: {
        type: String, // "Candidate", "Decision", ...
      },
      scale: {
        type: Number,
        default: 1
      }
    },
    components: {
      IconCandidate, IconDecision, IconEnquiry, IconPlan, IconSource, IconTask, IconAction
    },
    computed: {
      iconComponent() {
        return "Icon"+this.icon;
      },
      width() {
        return this.icon==="Plan" ?  12*this.scale : 10*this.scale;
      },
      height() {
        return 10*this.scale;
      }
    }
  }
</script>
