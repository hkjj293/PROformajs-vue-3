<docs>
    Debug for ReviewExpression
</docs>

<template>
  <div>
    <debug title="ReviewMap" v-if="testPRProps1.enactment">
      <svg ref="svg" width="100%" tabindex="0" :viewBox="viewbox">
        <g class="task draggable" @click="handleClick">
          <ReviewMap v-bind="testPRProps1" />
        </g>
      </svg>
    </debug>
  </div>
</template>

<script>
import ReviewMap from '../Review/ReviewMap.vue'
import { Enactment, Protocol } from '@openclinical/proformajs'

const template = {
  class: 'Plan',
  meta: {
    svg: {
      width: 800,
      height: 400
    }
  },
  caption: 'Plan',
  name: 'plan',
  autonomous: true,
  dataDefinitions: [
    {
      class: 'Integer',
      caption: 'A',
      name: 'a',
      valueCondition: '2'
    }
  ],
  tasks: [
    {
      class: 'Action',
      meta: {
        pos: {
          x: 135.54356301541733,
          y: 181.13459032695374
        }
      },
      caption: 'Action A',
      name: 'actionA'
    },
    {
      class: 'Plan',
      meta: {
        pos: {
          x: 257.14920905916057,
          y: 217.92286216470376
        }
      },
      caption: 'Plan C',
      name: 'planC',
      preCondition: "is_completed('actionA')",
      waitCondition: "is_finished('actionA')",
      autonomous: true
    }
  ]
}

const testPRProps1 = {
  enactment: null,
  selectedtask: 'plan'
}

export default {
  name: 'ReviewMapDebug',
  data: function () {
    return {
      testPRProps1: testPRProps1,
      protocol: new Protocol.Plan(template),
      enactmentOptions: {
        Enquiry: {
          useDefaults: true
        }
      }
    }
  },

  mounted: function () {
    let local = new Enactment({
      start: true,
      protocol: this.protocol,
      options: this.enactmentOptions
    })
    let json = JSON.stringify(local)
    this.testPRProps1.enactment = Enactment.inflate(json)
    this.testPRProps1.selectedtask = 'plan'
    //console.log(this.testPRProps1.plan)
  },
  components: { ReviewMap }
}
</script>
