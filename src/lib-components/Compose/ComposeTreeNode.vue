<docs>
Provides the node of an html tree, as a (possible nested) unordered list.

# props

* component - a PROformajs component
* selectedtask - path of the currently selected task
* expanded - boolean flag - show sub components?

# events

* select-task - signal selected task has changed, pass new path in event
</docs>

<template>
  <li v-if="component">
    <span class="clickable" style="color: lightgrey">
      <font-awesome-icon :icon="buttonIcon" v-if="subComponents.length > 0" size="xs" @click="openClose" />
    </span>
    <pc-icon :icon="component.constructor.name" class="mx-1" />
    <span @click="selectTask" class="clickable" v-bind:class="{ selected: isSelected }">{{
      heading(component)
    }}</span>
    <ul v-if="expandedLocal && subComponents.length > 0">
      <pc-tree-node v-for="sub in subComponents" :component="sub" :selectedtask="selectedtask" :key="sub.name"
        :expanded="expandComp(sub)" @select-task="$emit('select-task', $event)" />
    </ul>
  </li>
</template>

<script>
import { Protocol } from '@openclinical/proformajs'
import ComposeIcon from './ComposeIcon.vue'

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}

export default {
  name: 'pc-tree-node',
  props: {
    component: Object,
    selectedtask: String,
    expanded: Boolean
  },
  emits: ['select-path'],
  components: {
    'pc-icon': ComposeIcon
  },
  data: function () {
    return {
      expandedLocal: this.expanded
    }
  },
  computed: {
    isSelected() {
      return this.component.path() == this.selectedtask
    },
    subComponents() {
      let result = []
      if (this.component) {
        for (let path of this.component.subPaths()) {
          let names = path.split(':')
          if (names.length == 2 && !isNumeric(names.pop())) {
            let sub = this.component.getComponent(path)
            if (!(sub instanceof Protocol.DataDefinition)) {
              result.push(sub)
            }
          }
        }
      }
      return result
    },
    buttonIcon() {
      return this.expandedLocal ? 'minus-circle' : 'plus-circle'
    }
  },
  methods: {
    openClose() {
      this.expandedLocal = !this.expandedLocal
    },
    heading(comp) {
      if (comp.type && !comp.caption) {
        let dd = comp.allDataDefinitions().find((dd) => dd.name == comp.type)
        return dd.name
      } else {
        return comp.name
      }
    },
    selectTask() {
      if (this.component instanceof Protocol.Task) {
        this.$emit('select-task', { value: this.component.path() })
      } else {
        this.$emit('select-task', { value: this.component._parent.path() })
      }
    },
    expandComp(comp) {
      return comp instanceof Protocol.Plan
    }
  },
  watch: {
    expanded() {
      this.expandedLocal = this.expanded
    }
  }
}
</script>

<style scoped>
ul {
  list-style: none;
  padding-left: 15px;
}

.clickable {
  cursor: pointer;
}

.selected {
  font-weight: bold;
}
</style>
