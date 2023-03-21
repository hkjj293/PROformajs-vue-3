<docs>
Provides an svg element that can be used to visualise an enactment as a map and:

* view sub-plans and navigate through the sub-plan hierarchy (double click on a plan)

# props

* protocol - a PROformajs protocol
* selectedtask - path of the currently selected task

# events

* select-task - signal selected task has changed, pass new path in event
</docs>

<template>
  <svg ref="svg" width="100%" tabindex="0" :viewBox="viewbox">
    <template v-if="plan.tasks">
      <pm-breadcrumb v-if="plan.tasks" :plan="plan" :review="true" :height="breadcrumb.height"
        :width="protocol.meta.svg.width" :offset="0" @select-task="updatePlan"
        :selected="selectedplan === selectedtask" />
      <pr-maptask v-for="task in runtimeTasks(plan)" :key="task.path" :task="task" :review="true" :state="task.state"
        :x="task.meta.pos.x" :y="task.meta.pos.y + breadcrumb.height" :stroke_width="stroke_width"
        :selected="task.path === selectedtask" :data-path="task.path" :data-fromx="ports[task.name].from.x"
        :data-fromy="ports[task.name].from.y" @select-plan="updatePlan" @select-task="updateTask" />
      <pm-arrow v-for="(dep, idx) in deps" :key="idx" :tx="dep.target.x" :ty="dep.target.y" :sx="dep.source.x"
        :sy="dep.source.y" :source="dep.source.name" :target="dep.target.name" />
    </template>
    <pr-maptask v-else :task="plan" :review="true" :state="getState(plan)" :x="taskPos(plan).x" :y="taskPos(plan).y"
      :stroke_width="stroke_width" :selected="selectedplan + ':' + plan.name === selectedtask" :data-path="plan.path()"
      :data-fromx="plan.meta.svg.width / 2 + 20" :data-fromy="plan.meta.svg.height / 2" @select-plan="updatePlan"
      @select-task="updateTask" />
  </svg>
</template>

<script>
import ReviewMapTask from './ReviewMapTask.vue'
import MapArrow from './MapArrow.vue'
import MapBreadcrumb from './MapBreadcrumb.vue'
import { TemporalConstraintMixin } from './compose.js'

export default {
  mixins: [TemporalConstraintMixin],
  props: {
    enactment: Object,
    selectedtask: String
  },
  data: function () {
    return {
      selectedplan: this.enactment.protocol.name, // default value which will change via interaction with map or breadcrumb
      stroke_width: 8,
      breadcrumb: {
        height: 30
      }
    }
  },
  components: {
    'pr-maptask': ReviewMapTask,
    'pm-breadcrumb': MapBreadcrumb,
    'pm-arrow': MapArrow
  },
  computed: {
    protocol() {
      return this.enactment.protocol
    },
    plan() {
      let plan
      try {
        // selectedplan is a runtimepath but to draw the map we refer to the design-time definition
        let designpath = this.selectedplan
          .split(':')
          .map((task) => (task.indexOf('[') > -1 ? task.substring(0, task.indexOf('[')) : task))
          .join(':')
        plan = this.protocol.getComponent(designpath)
      } catch (e) {
        this.selectedplan = this.protocol.name
        plan = this.protocol
      }
      return plan
    },
    viewbox() {
      if (this.protocol && this.protocol.meta && this.protocol.meta.svg) {
        return (
          '0 0 ' +
          this.protocol.meta.svg.width +
          ' ' +
          (this.protocol.meta.svg.height + this.breadcrumb.height)
        )
      }
    },
    ports() {
      let result = {}
      for (let task of this.plan.tasks) {
        result[task.name] = {
          to: { x: task.meta.pos.x, y: task.meta.pos.y + this.breadcrumb.height }
        }
        result[task.name].from = {
          x: task.meta.pos.x + 40,
          y: task.meta.pos.y + this.breadcrumb.height
        }
        // small adjustments
        if (task.constructor.name == 'Plan') {
          result[task.name].from.x = task.meta.pos.x + 50
        } else if (task.constructor.name == 'Task') {
          result[task.name].to.x = task.meta.pos.x + this.stroke_width / 2
          result[task.name].from.x = task.meta.pos.x + 40 - this.stroke_width / 2
        } else if (task.constructor.name == 'Action') {
          result[task.name].from.x = task.meta.pos.x + 36
        }
      }
      return result
    },
    deps() {
      // returns array of arrows that need to be drawn
      let result = []
      for (let task of this.plan.tasks) {
        for (let dep of this.getTemporalDeps(task)) {
          if (this.ports[dep]) {
            let arrow = { source: this.ports[dep].from, target: this.ports[task.name].to }
            arrow.source.name = dep
            arrow.target.name = task.name
            result.push(arrow)
          } else {
            console.log('unknown dep:', dep)
          }
        }
      }
      return result
    }
  },
  methods: {
    updatePlan(e) {
      this.selectedplan = e.value
    },
    updateTask(e) {
      this.$emit('select-task', { value: e.value })
    },
    task(taskpath) {
      return this.protocol.getComponent(taskpath)
    },
    getState(task) {
      // gets runtime state from design time task
      return this.enactment.getComponent(task.path()).state
    },
    runtimeTasks(plan) {
      return plan.tasks.map((task) =>
        this.enactment.getComponent(this.enactment.runtimeFromDesignPath(task.path()))
      )
    }
  },
  watch: {
    selectedtask: function () {
      if (this.selectedtask) {
        let names = this.selectedtask.split(':')
        names.pop()
        this.selectedplan = names.join(':')
      }
    }
  } // watch
}
</script>

<style scoped>
svg {
  font-size: 10pt;
}

svg:focus {
  outline: none;
}
</style>
