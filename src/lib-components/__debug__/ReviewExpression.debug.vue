<docs>
    Debug for ReviewExpression
</docs>

<template>
  <div>
    <debug title="ReviewExpression">
      <ReviewExpression v-bind="testPRProps1" />
    </debug>
  </div>
</template>

<script>
import ReviewExpression from '../Review/ReviewExpression.vue'
import { Enactment, Protocol } from '@openclinical/proformajs'

const testPRProps1 = {
  id: '',
  enactment: null,
  path: 'plan:actionA',
  description: ''
}

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
    }
  ]
}

export default {
  name: 'ReviewExpressionDebug',
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
  },
  components: { ReviewExpression }
}
</script>
