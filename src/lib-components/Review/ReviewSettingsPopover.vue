<docs>
Provides a UI settings button that opens a popover form.

# props

* options - review settings
* debug - show debug option
* restart - show restart option
* placement - control placement of popover

# events

* change-option - signals an option change
* restart-enactment
</docs>

<template>
  <div>
    <PopoverButton :id="id" :msg="message" :targetId="'target:' + id" :placement="placement" varient="outline-secondary"
      trigger="click" :title="title">
      <font-awesome-icon icon="cog" />
    </PopoverButton>
    <div :id="'target:' + id">
      <label class="mt-2" v-if="debug">
        <input type="checkbox" @click="$emit('change-option', { option: 'debug', value: !options.debug })" />
        Debug expressions
      </label>
      <div class=" fw-bold mt-2">Decisions
      </div>
      <label class="mt-2">
        <input type="checkbox" :checked="options.Decision.showInactiveArguments"
          @click="$emit('change-option', { category: 'Decision', option: 'showInactiveArguments', value: !options.Decision.showInactiveArguments })" />
        Show inactive arguments
      </label>
      <label class="mt-2">
        <input type="checkbox" :checked="options.Decision.showExpressions"
          @click="$emit('change-option', { category: 'Decision', option: 'showExpressions', value: !options.Decision.showExpressions })" />
        Show expressions
      </label>
      <label class="mt-2">
        <input type="checkbox" :checked="options.Candidate.autoConfirmRecommended"
          @click="$emit('change-option', { category: 'Candidate', option: 'autoConfirmRecommended', value: !options.Candidate.autoConfirmRecommended })" />
        Auto-confirm candidates
      </label>
      <label class="mt-2">
        <input type="checkbox" :checked="options.Decision.allowDownloads"
          @click="$emit('change-option', { category: 'Decision', option: 'allowDownloads', value: !options.Decision.allowDownloads })" />
        Allow Downloads
      </label>
      <div class="fw-bold mt-2">Enquiries</div>
      <label class="mt-2">
        <input type="checkbox" :checked="options.Enquiry.useDefaults"
          @click="$emit('change-option', { category: 'Enquiry', option: 'useDefaults', value: !options.Enquiry.useDefaults })" />
        Use defaults
      </label>
      <button type="button" :name="'target:' + id + ':send:restart'" v-if="restart"
        class="btn btn-outline-secondary btn-sm d-block mt-2" @click="sendRestart" block>
        <font-awesome-icon icon="redo-alt" /> Restart
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: Object,
    id: {
      type: String,
      default: 'task-settings'
    },
    debug: {
      type: Boolean,
      default: true
    },
    restart: {
      type: Boolean,
      default: true
    },
    placement: {
      type: String,
      default: 'left'
    }
  },
  emits: ['restart-enactment', 'close', 'change-option'],
  data() {
    return {
      message: 'Loading Options...',
      title: 'Review Settings'
    }
  },
  methods: {
    sendRestart() {
      this.$emit('restart-enactment')
      //this.$refs[this.id].$emit('close')
    },
    fn() {

    }
  }
}
</script>
