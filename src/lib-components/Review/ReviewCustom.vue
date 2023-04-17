<docs>
Provides a custom UI for a proformajs Enactment. Looks to the root task meta to organise the UI.

status: alpha - used in the shortness of breath example

The goal is to be able to re-create the existing review UIs and create your own custom view that uses the following components:
* Fixed
* SettingsModal
* Tabs (TODO)
* Map (TODO)
* Data (TODO)
* AvailableTaskButtons (TODO)
* AvailableTriggerButtons (TODO)
* HistoryAccordian (TODO)
* SelectedTask (TODO)
* Choice (TODO)
* ChoiceButton (TODO)
* RestartButton (TODO)

# props

* enactment - a PROformajs enactment
* options - review settings
* debug - allows access to the "Debug expressions" functionality

# events

* change-enactment - signals the need to update the enactment
* change-option - signals an option change

# meta

The shortness of breath example uses this meta:

```json
"enact": {
  "ui": {
    "cols": [
      {
        "width": 6,
        "contents": [
          {
            "component": "fixed",
            "path": "shortness_of_breath:enquiry"
          }
        ]
      },
      {
        "width": 6,
        "contents": [
          { "component": "settings" },
          {
            "component": "fixedTask",
            "path": "shortness_of_breath:diagnosis"
          }
        ]
      }
    ]
  },
  "template": "custom"
}
```
</docs>

<template>
  <div v-if="enactment">
    <div class="row">
      <div v-for="(col, index) of cols" :class="'col-' + col.width">
        <template v-for="(comp, index) of col.contents">
          <pr-fixed v-if="comp.component == 'fixed'" :enactment="enactment" :options="options" :debug="debug"
            :taskpath="comp.path" @changes-enactment="$emit('change-enactment', $event)" />
          <pr-settings :id="'popover-reivew-custom'" class="float-end" v-if="comp.component == 'settings'"
            :options="options" @restart-enactment="$emit('restart-enactment')"
            @change-option="$emit('change-option', $event)" />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { ReviewMixin } from './review'
import ReviewFixed from './ReviewFixed.vue'

export default {
  mixins: [ReviewMixin],
  props: ['meta'],
  emits: ['change-enactment', 'restart-enactment', 'change-option'],
  components: {
    'pr-fixed': ReviewFixed
  },
  computed: {
    cols() {
      let meta = this.enactment.protocol.meta
      return meta && meta.enact && meta.enact.ui && meta.enact.ui.cols ? meta.enact.ui.cols : []
    }
  }
}
</script>
