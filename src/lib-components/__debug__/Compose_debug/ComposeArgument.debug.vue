<docs>
    Debug for ComposeArgument
</docs>

<template>
  <div>
    <debug title="ComposeArgument">
      <ComposeArgument
        :protocol="protocol"
        :path="argumentPath"
        @change-protocol="$emit('change-protocol', $event)"
        @select-path="updateArgumentPath"
        ref="argumentEditor"
        :issues="subComponentIssues(argumentPath)"
      />
    </debug>
  </div>
</template>

<script>
import ComposeArgument from '../../Compose/ComposeArgument.vue'

import { Enactment, Protocol } from '@openclinical/proformajs'

const template1 = {
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
  tasks: [
    {
      class: 'Decision',
      meta: {
        pos: {
          x: 214.51445649762252,
          y: 127.53034646889859
        }
      },
      caption: 'Decision A',
      name: 'decisionA',
      candidates: [
        {
          class: 'Candidate',
          caption: 'K',
          name: 'k',
          recommendCondition: "net_support('k')>0",
          arguments: [
            {
              class: 'Argument',
              caption: 'o',
              description: 'l',
              support: -1,
              activeCondition: 'true'
            }
          ]
        }
      ]
    }
  ]
}

export default {
  name: 'ComposeArgumentDebug',
  data: function () {
    return {
      protocol: new Protocol.Plan(template1),
      enactmentOptions: {
        Enquiry: {
          useDefaults: true
        }
      },
      enactment: null,
      path: 'plan:decisionA',
      argumentPath: 'plan:decisionA:k:0',
      selectedtask: 'plan:decisionA',
      jsonValid: true,
      issues: []
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
  computed: {
    task() {
      let component
      try {
        component = this.protocol.getComponent(this.path)
      } catch (e) {
        component = this.protocol
      }
      return component
    },
    selectedTaskIssues() {
      if (this.jsonValid) {
        let issues = this.protocol
          .validate()
          .filter((issue) => issue.path.startsWith(this.selectedtask))
        return issues
      } else {
        return []
      }
    }
  },
  methods: {
    updateArgumentPath(evt) {
      this.argumentPath = evt.value
      this.tabIndex = 1 // show Arguments tab
    },
    updateAttribute(evt) {
      // There is no setComponent method in a PROformajs protocol so we focus on attributes instead
      let comp = this.protocol.getComponent(this.path)
      if (evt.name == 'name') {
        // update temporal constraints of tasks that depend on this one
        if (evt.value != null && evt.value.length > 0) {
          for (let depname of this.getForwardDeps(comp)) {
            let dep = this.protocol.getComponent(comp._parent.path() + ':' + depname)
            dep.waitCondition = dep.waitCondition.replace(comp.name, evt.value)
            dep.preCondition = dep.preCondition.replace(comp.name, evt.value)
          }
        }
      }
      let newevt = { value: this.protocol }
      if (evt.value == null || evt.value.length == 0) {
        comp[evt.name] = null
      } else {
        comp[evt.name] = evt.value
      }
      if (evt.name == 'name') {
        // changing the name will change the path, so the selectedtask path needs updating
        newevt.selected = comp.path()
      }
      newevt.emitter = 'pc-task.0'
      this.$emit('change-protocol', newevt)
    },
    subComponentIssues(comp) {
      return this.issues.filter((issue) => issue.path.startsWith(comp))
    }
  },
  components: { ComposeArgument }
}
</script>
