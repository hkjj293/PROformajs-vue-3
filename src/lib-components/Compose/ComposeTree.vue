<docs>
Provides an html tree, as drawn as a nested series of unordered lists.

# props

* protocol - a PROformajs protocol
* selectedtask - path of the currently selected task

# events

* select-task - signal selected task has changed, pass new path in event
</docs>

<template>
  <div class="tree">
    <ul>
      <pc-tree-node
        :component="protocol"
        :expanded="true"
        @select-task="$emit('select-task', $event)"
        :selectedtask="selectedtask"
      />
    </ul>
  </div>
</template>

<script>
import ComposeTreeNode from './ComposeTreeNode.vue'

export default {
  name: 'pc-tree',
  props: {
    protocol: Object,
    selectedtask: String
  },
  components: {
    'pc-tree-node': ComposeTreeNode
  }
}
</script>

<style scoped>
ul {
  list-style: none;
  padding-left: 0px;
}
</style>
