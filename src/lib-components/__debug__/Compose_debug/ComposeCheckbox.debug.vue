<docs>
    Debug for ComposeCheckbox
</docs>

<template>
  <div>
    <debug title="ComposeCheckbox">
      <ComposeCheckbox
        :comp="task"
        :disabled="disableAutonomous"
        att="autonomous"
        @change-attribute="updateAttribute"
      />
    </debug>
  </div>
</template>

<script>
import ComposeCheckbox from '../../Compose/ComposeCheckbox.vue'

export default {
  name: 'ComposeCheckboxDebug',
  data: function () {
    return {
      disableAutonomous: false,
      task: { autonomous: true }
    }
  },
  methods: {
    updateSourcePath(evt) {
      this.sourcePath = evt.value
      this.tabIndex = 1 // show Sources tab
    },
    relayChangeEvent(evt, idx) {
      evt.relay = 'pc-task.' + idx
      this.$emit('change-protocol', evt)
    }
  },
  components: { ComposeCheckbox }
}
</script>
