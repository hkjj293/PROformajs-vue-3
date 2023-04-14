<docs>
Provides a breadcrumb trail of the parent plan(s) to the currently selected plan
for the TaskMap component.  The parent plans are all clickable.

# props

* plan - the currently selected PROformajs plan
* height - height of the breadcrumb box
* width - width of the breadcrumb box
* offset - left-hand position of breadcrumb box
* selected - whether plan is also the currently selected task

# events

* select-task - when the current plan is clicked, value: plan path

# Notes

Warnings and errors are signalled with (?) and [!] in the breadcrumb.  These
would be better signalled with the same icons that are used in the task details
but I cant work out how to position these correctly.  See also ComposeMapTask.

</details>
</docs>

<template>
  <g id="breadcrumb">
    <text :x="offset + 10" y="20">
      <tspan v-for="crumb in crumbs()" class="clickable" @click="changePath" :data-path="crumb.path" :key="crumb.path">
        {{ crumb.caption }} :
      </tspan>
      <tspan @click="selectTask" class="clickable" v-bind:class="{ selected: selected }">
        {{ plan.name }}
      </tspan>
      <tspan v-if="hasError" fill="#E74C3C">[!]</tspan>
      <tspan v-if="hasWarning" fill="#3498DB">(?)</tspan>
      <line :x1="offset" :y1="height" :x2="width" :y2="height" stroke="gray"></line>
      <tspan v-show="!review && plan.dataDefinitions.length > 0" style="font-size: 10pt" fill="gray">
        {{ plan.dataDefinitions.length }} data definition<template v-if="plan.dataDefinitions.length > 1">s</template>
      </tspan>
    </text>
    <line :x1="offset" :y1="height" :x2="width" :y2="height" stroke="gray"></line>
  </g>
</template>

<script>
export default {
  props: {
    plan: Object,
    offset: Number,
    height: Number,
    width: Number,
    selected: Boolean,
    review: Boolean,
    issues: Array
  },
  emits: ['select-task'],
  computed: {
    hasError() {
      return this.issues ? this.issues.filter((issue) => issue.type == 'Error').length > 0 : false
    },
    hasWarning() {
      return this.issues ? this.issues.filter((issue) => issue.type == 'Warning').length > 0 : false
    }
  },
  methods: {
    crumbs() {
      let result = []
      let localplan = this.plan
      while (localplan._parent) {
        localplan = localplan._parent
        result.unshift({ caption: localplan.name, path: localplan.path() })
      }
      return result
    },
    changePath(evt) {
      this.$emit('select-task', { value: evt.target.dataset.path })
    },
    selectTask(evt) {
      this.$emit('select-task', { value: this.plan.path() })
    }
  }
}
</script>

<style scoped>
.clickable {
  cursor: pointer;
}

.selected {
  font-weight: bold;
}

g {
  font-size: 16pt;
}
</style>
