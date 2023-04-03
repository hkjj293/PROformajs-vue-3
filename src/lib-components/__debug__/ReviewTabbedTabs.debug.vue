<docs>
    Debug for ReviewTabbedTabs
</docs>

<template>
  <div>
    <debug title="ReviewTabbedTabs">
      <ReviewTabbedTabs :plan="root" :selected="path" @select-task="updatePath" />
    </debug>
  </div>
</template>

<script>
import { Enactment, Protocol } from '@openclinical/proformajs'
import ReviewTabbedTabs from '../Review/ReviewTabbedTabs.vue'

const template = {
  class: 'Plan',
  meta: {
    svg: {
      width: 800,
      height: 400
    },
    enact: {
      template: 'development'
    }
  },
  caption: 'Plan',
  name: 'plan',
  autonomous: true,
  dataDefinitions: [
    {
      class: 'Integer',
      caption: ' A',
      name: 'A'
    }
  ],
  tasks: [
    {
      class: 'Plan',
      meta: {
        pos: {
          x: 98.8780622123229,
          y: 83.18739263811813
        }
      },
      caption: 'Plan A',
      name: 'planA',
      autonomous: true,
      tasks: [
        {
          class: 'Action',
          meta: {
            pos: {
              x: 320.716609710278,
              y: 99.74715251144079
            }
          },
          caption: 'Action B',
          name: 'actionB',
          preCondition: "is_completed('enquiryC')",
          waitCondition: "is_finished('enquiryC')"
        },
        {
          class: 'Enquiry',
          meta: {
            pos: {
              x: 124.18618361760224,
              y: 103.13430334545578
            }
          },
          caption: 'Enquiry C',
          name: 'enquiryC',
          sources: [
            {
              class: 'Source',
              type: 'A'
            }
          ]
        }
      ]
    }
  ]
}

export default {
  name: 'ReviewTabbedTabsDebug',
  data: function () {
    return {
      path: 'plan',
      protocol: new Protocol.Plan(template),
      enactmentOptions: {
        Enquiry: {
          useDefaults: true
        }
      },
      enactment: null
    }
  },
  computed: {
    root() {
      return this.enactment
        ? this.enactment.getComponent(
            this.enactment.runtimeFromDesignPath(this.enactment.protocol.name)
          )
        : null
    }
  },
  mounted: function () {
    let local = new Enactment({
      start: true,
      protocol: this.protocol,
      options: this.enactmentOptions
    })
    let json = JSON.stringify(local)
    this.enactment = Enactment.inflate(json)
  },
  methods: {
    updatePath(evt) {
      this.path = evt.value
    }
  },
  components: { ReviewTabbedTabs }
}
</script>
