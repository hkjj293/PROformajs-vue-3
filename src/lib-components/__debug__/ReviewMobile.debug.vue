<docs>
    Debug for ReviewMobile
</docs>

<template>
  <div>
    <debug title="ReviewMobile">
      <ReviewMobile
        v-bind="testPRProps1"
        @change-enactment="updateEnactment"
        @restart-enactment="resetEnactment"
        @change-option="updateOption"
      />
    </debug>
  </div>
</template>

<script>
import ReviewMobile from '../Review/ReviewMobile.vue'
import { Enactment, Protocol } from '@openclinical/proformajs'

const reviewOptions = {
  Decision: {
    showInactiveArguments: true,
    showExpressions: true,
    allowDownloads: true
  },
  Enquiry: {
    useDefaults: true
  },
  Candidate: {
    autoConfirmRecommended: true
  },
  debug: true
}

const testPRProps1 = {
  debug: true,
  enactment: null,
  options: reviewOptions
}

const template = {
  class: 'Plan',
  meta: {
    svg: {
      width: 800,
      height: 400
    },
    enact: {
      template: 'mobile',
      ui: {
        cols: [
          {
            contents: [
              {
                component: 'fixed',
                path: 'plan:enquiryB'
              }
            ],
            width: '2'
          }
        ]
      }
    }
  },
  caption: 'Plan',
  name: 'plan',
  autonomous: true,
  dataDefinitions: [
    {
      class: 'Integer',
      caption: ' B',
      name: 'B'
    }
  ],
  tasks: [
    {
      class: 'Decision',
      meta: {
        pos: {
          x: 270.04226258851673,
          y: 137.24439206971024
        }
      },
      caption: 'Decision A',
      name: 'decisionA',
      candidates: [
        {
          class: 'Candidate',
          caption: 'A',
          name: 'a',
          recommendCondition: "net_support('a')>0",
          arguments: [
            {
              class: 'Argument',
              caption: 'random() > 0.2',
              description: 'Description 0',
              support: 1,
              activeCondition: 'random() > 0.2'
            },
            {
              class: 'Argument',
              caption: ' random() > 0.4',
              description: 'Description 1',
              support: 1,
              activeCondition: ' random() > 0.4'
            }
          ]
        }
      ]
    },
    {
      class: 'Enquiry',
      meta: {
        pos: {
          x: 114.93010398272196,
          y: 132.0448634423179
        }
      },
      caption: 'Enquiry B',
      name: 'enquiryB',
      sources: [
        {
          class: 'Source',
          type: 'B'
        }
      ]
    },
    {
      class: 'Action',
      meta: {
        pos: {
          x: 197.58842645773524,
          y: 32.22691806539074
        }
      },
      caption: 'Action C',
      name: 'actionC',
      preCondition: 'index()==2'
    },
    {
      class: 'Plan',
      meta: {
        pos: {
          x: 173.52608901109784,
          y: 251.02243172115897
        }
      },
      caption: 'Plan D',
      name: 'planD',
      autonomous: true
    }
  ]
}

export default {
  name: 'ReviewMobileDebug',
  data: function () {
    return {
      testPRProps1: testPRProps1,
      protocol: new Protocol.Plan(template),
      reviewOptions: reviewOptions,
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
  methods: {
    updateEnactment(evt) {
      let json = JSON.stringify(evt.value)
      this.testPRProps1.enactment = json ? Enactment.inflate(json) : null
    },
    resetEnactment() {
      if (this.protocol && this.protocol.isValid()) {
        try {
          let local = null
          if (this.initialData && Object.keys(this.initialData).length > 0) {
            local = new Enactment({
              start: false,
              protocol: this.protocol,
              options: this.enactmentOptions
            })
            local.setData(this.initialData)
          } else {
            local = new Enactment({
              start: true,
              protocol: this.protocol,
              options: this.enactmentOptions
            })
          }
          let json = JSON.stringify(local)
          this.testPRProps1.enactment = Enactment.inflate(json)
        } catch (e) {
          this.exception = e.message
        }
      }
    },
    updateOption(evt) {
      if (evt.category) {
        this.testPRProps1.options[evt.category][evt.option] = evt.value
      } else {
        this.testPRProps1.options[evt.option] = evt.value
      }
      // a change in eqnuiry options requires restarting the enactment
      if (evt.category == 'Enquiry') {
        this.resetEnactment()
      }
    },
    sendTrigger(trigger) {
      let enactment = this.testPRProps1.enactment
      enactment.sendTrigger(trigger)
      this.$emit('change-enactment', { value: enactment, action: 'trigger', trigger: trigger })
      this.testPRProps1.enactment = enactment
    }
  },
  components: { ReviewMobile }
}
</script>
