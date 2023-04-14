<docs>
Provides the means to review and edit a PROformajs argument's attributes and children

# props

* protocol - a PROformajs Protocol
* path - the path to the component of interest

# events

* change-protocol - indicates need to update the protocol,
</docs>

<template>
  <div>
    <h4>Argument: {{ argument.idx }}</h4>
    <div class="mb-2">
      <button class="btn btn-outline-secondary btn-sm" @click="$emit('select-path', { value: '' })">
        &lt;&lt; Candidate: {{ parentName }}
      </button>
      <button
        class="btn btn-outline-secondary btn-sm"
        v-if="numSiblings > 1"
        :disabled="argument.idx == 0"
        @click="prevArg"
      >
        &lt; Prev
      </button>
      <button
        class="btn btn-outline-secondary btn-sm"
        v-if="numSiblings > 1"
        :disabled="argument.idx == numSiblings - 1"
        @click="nextArg"
      >
        Next &gt;
      </button>
    </div>
    <ul
      class="nav nav-tabs"
      :id="
        'pc-arg-tabs-' +
        (this.plan && this.plan.name ? this.plan.name.replaceAll(':', '-') : 'no-name')
      "
      role="tablist"
    >
      <li class="nav-item" role="presentation">
        <button
          :class="'nav-link ' + (tabIndex == 0 ? 'active' : '')"
          :id="'pc-arg-tabs'"
          data-bs-toggle="tab"
          :data-bs-target="'#pc-arg-tabs-details'"
          type="button"
          role="tab"
          :aria-controls="'pc-arg-tabs-details'"
          :aria-selected="true"
        >
          Details
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          :class="'nav-link ' + (tabIndex == 1 ? 'active' : '')"
          :id="'pc-arg-tabs'"
          data-bs-toggle="tab"
          :data-bs-target="'#pc-arg-tabs-condition'"
          type="button"
          role="tab"
          :aria-controls="'pc-arg-tabs-condition'"
          :aria-selected="true"
        >
          Condition
        </button>
      </li>
    </ul>
    <div class="tab-content mt-2">
      <div class="tab-pane active" id="pc-arg-tabs-details">
        <form>
          <pc-input att="caption" :comp="argument" @change-attribute="updateAttribute" />
          <pc-textarea att="description" :comp="argument" @change-attribute="updateAttribute" />
          <div class="mb-1 row g-3 mt-1">
            <label class="d-block" for="supportType">Support</label>
            <div id="supportType" class="input-group mb-3 col-auto">
              <template
                v-for="symbol in [
                  { value: '--', text: '--' },
                  { value: '-', text: '-' },
                  { value: '+', text: '+' },
                  { value: '++', text: '++' }
                ]"
              >
                <input
                  type="radio"
                  class="btn-check"
                  name="supportType"
                  :id="symbol.value"
                  :value="symbol.value"
                  autocomplete="off"
                  @input="supportSymbol = symbol.value"
                  :checked="supportSymbol == symbol.value"
                />
                <label class="btn btn-outline-secondary btn-sm" :for="symbol.value">{{
                  symbol.text
                }}</label>
              </template>
              <input
                type="number"
                name="supportValue"
                size="2"
                :value="Math.abs(argument.support)"
              />
            </div>
          </div>
        </form>
      </div>
      <div class="tab-pane" id="pc-arg-tabs-condition">
        <pc-condition
          att="activeCondition"
          :comp="argument"
          :description="activeConditionExample"
          :issues="attributeIssues('activeCondition')"
          @change-attribute="updateAttribute"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ComposeInput from './ComposeInput.vue'
import ComposeCondition from './ComposeCondition.vue'
import ComposeTextArea from './ComposeTextArea.vue'

export default {
  props: {
    protocol: Object,
    path: String,
    issues: Array
  },
  components: {
    'pc-input': ComposeInput,
    'pc-condition': ComposeCondition,
    'pc-textarea': ComposeTextArea
  },
  data() {
    return {
      magnitude: 1,
      tabIndex: 0
    }
  },
  computed: {
    argument() {
      let component
      try {
        component = this.protocol.getComponent(this.path)
      } catch (e) {
        component = this.protocol
      }
      return component
    },
    supportSymbol: {
      get: function () {
        if (this.argument.support == -Infinity) {
          return '--'
        } else if (this.argument.support < 0) {
          return '-'
        } else if (this.argument.support == Infinity) {
          return '++'
        } else {
          return '+'
        }
      },
      set: function (value) {
        if (value == '--') {
          this.updateAttribute({ name: 'support', value: -Infinity })
        } else if (value == '-') {
          this.updateAttribute({ name: 'support', value: -1 * this.magnitude })
        } else if (value == '++') {
          this.updateAttribute({ name: 'support', value: Infinity })
        } else {
          this.updateAttribute({ name: 'support', value: this.magnitude })
        }
      }
    },
    activeConditionExample() {
      return 'e.g. "age > 40 && sbp > 120"'
    },
    parentName() {
      return this.argument._parent ? this.argument._parent.name : ''
    },
    numSiblings() {
      return this.argument._parent ? this.argument._parent.arguments.length : -1
    }
  },
  methods: {
    updateAttribute(evt) {
      // There is no setComponent method in a PROformajs protocol so we focus on attributes instead
      let comp = this.protocol.getComponent(this.path)
      comp[evt.name] = evt.value
      this.$emit('change-protocol', { value: this.protocol, emitter: 'pc-argument' })
    },
    reset() {
      this.tabIndex = 0 // show Details tab
    },
    attributeIssues(att) {
      return this.issues.filter((issue) => issue.attribute == att)
    },
    prevArg() {
      let prevPath = this.argument._parent.arguments[this.argument.idx - 1].path()
      this.$emit('select-path', { value: prevPath })
    },
    nextArg() {
      let nextPath = this.argument._parent.arguments[this.argument.idx + 1].path()
      this.$emit('select-path', { value: nextPath })
    }
  },
  watch: {
    path: function () {
      this.reset() // if the path changes, reset the dialogues
    }
  }
}
</script>
