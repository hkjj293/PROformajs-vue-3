<docs>
Provides access to all the enactment data with a block of badges,
one for each data definition.  Each dd can be selected and updated by clicking
the badge and then updating the associated form field.  data definitions with
values are highlighted and shown with their value.

# props

* enactment - a PROformajs enactment
* options - for passing expression debug flags

# events

* update-enactment is emitted when a data definition is updated
</docs>

<template>
  <div>
    <template v-if="enactment && enactment.getDataDefinitions().length > 0">
      <div class="card mt-2" v-if="selected">
        <div class="card-body">
          <pr-source v-if="!selected.valueCondition" suffix="data" :source="selected" :value="value(selected)"
            @erase-source="updateSource" @update-source="updateSource" />
          <div v-else>
            <label for="name" class="col-form-label col-form-label-sm pt-0">{{ selected.caption || selected.name }}
              <span class="badge rounded-pill bg-secondary">
                dynamic
              </span>
            </label>
            <div class="text-secondary">
              <em>{{ selected.valueCondition }}</em>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-3">
        <span v-for="dd in enactment.getDataDefinitions()" :key="key(dd)"
          :class="'badge rounded-pill ' + 'bg-' + variant(dd) + ' m-1 p-1 clickable'" @click="select(dd.name)">
          {{ dd.name }}<span v-if="value(dd) != null"> = {{ badgeValue(value(dd)) }}</span>
        </span>
      </div>
      <hr class="mb-1" />
      <div class="float-end">
        <small>Key:</small>
        <span class="badge rounded-pill bg-light">unknown</span>
        <span class="badge rounded-pill bg-dark">known</span>
        <span class="badge rounded-pill bg-info">selected</span>
      </div>
    </template>
    <p v-else class="text-muted">No data definitions available</p>
    <pr-expression v-if="options.debug" :enactment="enactment" :path="enactment.protocol.name"
      description="Evaluate expression from the context of the root task" class="mt-2" id="data" />
  </div>
</template>

<script>
import ReviewSource from './ReviewSource.vue'
import ReviewExpression from './ReviewExpression.vue'
import moment from 'moment'

export default {
  props: ['enactment', 'options'],
  components: {
    'pr-source': ReviewSource,
    'pr-expression': ReviewExpression
  },
  data() {
    return {
      selectedName: null // name of selected data definition
    }
  },
  computed: {
    selected() {
      if (this.selectedName) {
        return this.enactment.getDataDefinitions().find((dd) => dd.name == this.selectedName)
      } else {
        if (this.enactment && this.enactment.getDataDefinitions().length > 0) {
          let dd = this.enactment.getDataDefinitions()[0]
          this.selectedName = dd.name
          return dd
        }
      }
    }
  },
  methods: {
    key(dd) {
      return 'accordian' + dd.path.replace('[', '').replace(']', '').replace(':', '')
    },
    updateSource(evt) {
      evt.path = this.enactment.runtimeFromDesignPath(this.enactment.protocol.name)
      this.$emit('update-enactment', evt)
    },
    value(dd) {
      let path = this.enactment.runtimeFromDesignPath(this.enactment.protocol.name)
      return this.enactment.get(path, dd.name)
    },
    badgeValue(value) {
      return value
        ? value.toString().length > 12
          ? value.toString().substr(0, 12) + '...'
          : value.toString()
        : value
    },
    variant(dd) {
      return this.selectedName && dd.name == this.selectedName
        ? 'info'
        : dd.value != null
          ? 'dark'
          : 'light'
    },
    select(name) {
      this.selectedName = name
    }
  }
}
</script>
