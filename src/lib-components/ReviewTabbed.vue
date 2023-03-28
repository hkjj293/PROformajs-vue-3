<docs>
Provides a tabbed UI for a proformajs Enactment.

# props

* enactment - a PROformajs enactment
* options - review settings
* debug - allows access to the "Debug expressions" functionality

# events

* change-enactment - signals the need to update the enactment
* change-option - signals an option change
* restart-enactment
</docs>

<template>
  <div v-if="enactment">
    <div class="row" style="margin-bottom: 80px">
      <div class="col">
        <div v-if="status.finished">
          <slot name="finished">
            <div class="float-end">
              <pr-settings :options="options" id="popover-finished" @restart-enactment="$emit('restart-enactment')"
                @change-option="$emit('change-option', $event)" />
            </div>
            <slot name="finished">
              <h3>All done!</h3>
            </slot>
            <hr />
            <div class="row">
              <div class="col-sm">
                <h3>History</h3>
                <pr-history :enactment="enactment" />
              </div>
              <div class="col-sm">
                <h3>Data</h3>
                <div class="mt-3">
                  <span
                    :class="'badge rounded-pill ' + 'bg-' + variant(dd) + (variant(dd) == 'light' ? ' text-dark' : '') + ' m-1 p-1 clickable'"
                    v-for="dd in enactment.getDataDefinitions()" :key="key(dd)">
                    {{ dd.name }}<span v-if="value(dd)"> = {{ value(dd) }}</span>
                  </span>
                </div>
                <hr class="mb-1" />
                <div class="float-end">
                  <small>Key:</small>
                  <span class="badge rounded-pill bg-light text-dark m-1">unknown</span>
                  <span class="badge rounded-pill bg-dark m-1">known</span>
                  <span class="badge rounded-pill bg-info m-1">selected</span>
                </div>
              </div>
            </div>
          </slot>
        </div>
        <template v-else>
          <div class="card">
            <pr-tabbed-tabs :plan="root" :selected="path" @select-task="updatePath" />
            <div class="card-body">
              <div class="float-end">
                <pr-settings :options="options" :id="'popover-' + root.path"
                  @restart-enactment="$emit('restart-enactment')" @change-option="$emit('change-option', $event)" />
              </div>
              <pr-task :task="activeTask" :enactment="enactment" @update-enactment="updateEnactment" :options="options"
                @send-trigger="sendTrigger" />
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { ReviewMixin } from './review';
import ReviewTabbedTabs from './ReviewTabbedTabs.vue';

export default {
  mixins: [ReviewMixin],
  components: {
    'pr-tabbed-tabs': ReviewTabbedTabs
  },
  computed: {
    root() {
      return this.enactment.getComponent(this.enactment.runtimeFromDesignPath(this.enactment.protocol.name));
    }
  },
  methods: {
    key(dd) {
      return "accordian" + dd.path.replace("[", "").replace("]", "").replace(":", "");
    },
    value(dd) {
      switch (dd.class) {
        case "Date":
          return dd.value ? moment(dd.value).format('DD/MM/YYYY') : '';
        default:
          return dd.value != undefined ? dd.value.toString() : undefined;
      }
    },
    variant(dd) {
      return dd.value != null ? "dark" : "light";
    }
  }
}
</script>
