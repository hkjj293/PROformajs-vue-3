<docs>
Provides the means to review and edit a PROformajs candidates's attributes and children

# props

* protocol - a PROformajs Protocol
* path - the path to the component of interest- the path to the component of interest

# events

* change-protocol - indicates need to update the protocol,e-protocol - indicates need to update the protocol,
</docs>

<template>
  <div>
    <pc-argument v-if="argumentPath != ''" :protocol="protocol" :path="argumentPath"
      @change-protocol="$emit('change-protocol', $event)" @select-path="updateArgumentPath" ref="argumentEditor"
      :issues="subComponentIssues(argumentPath)" />
    <div :class="argumentPath == '' ? 'd-block' : 'd-none'">
      <h4>Candidate: {{ candidate.name }}</h4>
      <div class="mb-2">
        <button type="button" class="btn btn-outline-secondary btn-sm" @click="$emit('select-path', { value: '' })">
          &lt;&lt; Decision: {{ parentName }}
        </button>
        <button type="button" class="btn btn-outline-secondary btn-sm" v-if="numSiblings > 1" :disabled="candIdx == 0"
          @click="prevCand">
          &lt; Prev
        </button>
        <button type="button" class="btn btn-outline-secondary btn-sm" size="sm" v-if="numSiblings > 1"
          :disabled="candIdx == numSiblings - 1" @click="nextCand">
          Next &gt;
        </button>
      </div>
      <ul class="nav nav-tabs small" :id="
        'pc-arg-tabs-' +
        (this.plan && this.plan.name ? this.plan.name.replaceAll(':', '-') : 'no-name')
      " role="tablist">
        <li class="nav-item" role="presentation">
          <button :class="'nav-link ' + (tabIndex == 0 ? 'active' : '')" :id="'pc-cand-tabs-details'" data-bs-toggle="tab"
            :data-bs-target="'#pc-cand-tabs-details-p'" type="button" role="tab" :aria-controls="'pc-cand-tabs-details-p'"
            :aria-selected="true">
            Details
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button :class="'nav-link ' + (tabIndex == 1 ? 'active' : '')" :id="'pc-cand-tabs-argument'"
            data-bs-toggle="tab" :data-bs-target="'#pc-cand-tabs-argument-p'" type="button" role="tab"
            :aria-controls="'pc-cand-tabs-argument-p'" :aria-selected="true">
            <span class="d-block d-sm-none">
              Args
              <span class="badge rounded-pill text-bg-secondary"
                v-if="candidate.arguments && candidate.arguments.length > 0">{{ candidate.arguments.length }}</span>
            </span>
            <span class="d-none d-sm-block">Arguments
              <span class="badge rounded-pill text-bg-secondary"
                v-if="candidate.arguments && candidate.arguments.length > 0">{{ candidate.arguments.length }}</span>
            </span>
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button :class="'nav-link ' + (tabIndex == 2 ? 'active' : '')" :id="'pc-cand-tabs-recommend'"
            data-bs-toggle="tab" :data-bs-target="'#pc-cand-tabs-recommend-p'" type="button" role="tab"
            :aria-controls="'pc-cand-tabs-recommend-p'" :aria-selected="true">
            Recommend
          </button>
        </li>
      </ul>
      <div class="tab-content mt-2">
        <div class="tab-pane active" id="pc-cand-tabs-details-p">
          <pc-name :comp="candidate" @change-attribute="updateAttribute" />
          <pc-input att="caption" :comp="candidate" @change-attribute="updateAttribute" />
          <pc-textarea att="description" :comp="candidate" @change-attribute="updateAttribute" />
        </div>
        <div class="tab-pane" id="pc-cand-tabs-argument-p">
          <div>
            <input type="text" class="form-control form-control-sm" id="newargument" @change="addArgument"
              placeholder="Enter argument caption" />
            <table class="table table-sm mt-3" v-show="candidate.arguments && candidate.arguments.length > 0">
              <tbody>
                <!-- existing candidates -->
                <tr v-for="(arg, idx) in candidate.arguments" :key="idx">
                  <td class="clickable" @click="selectArgument(idx)">
                    {{ arg.caption }}
                  </td>
                  <td>
                    <button type="button" class="btn btn-light btn-sm float-sm-end" @click="deleteArgument(idx)">
                      &times;
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="tab-pane" id="pc-cand-tabs-recommend-p">
          <pc-condition att="recommendCondition" :comp="candidate" :description="example"
            @change-attribute="updateAttribute" :issues="attributeIssues('recommendCondition')" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Protocol } from '@openclinical/proformajs'
import ComposeArgument from './ComposeArgument.vue'
import ComposeCondition from './ComposeCondition.vue'
import ComposeName from './ComposeName.vue'
import ComposeInput from './ComposeInput.vue'
import ComposeTextArea from './ComposeTextArea.vue'

export default {
  props: {
    protocol: Object,
    path: String,
    issues: Array
  },
  emits: ['select-path', 'change-protocol'],
  components: {
    'pc-argument': ComposeArgument,
    'pc-name': ComposeName,
    'pc-input': ComposeInput,
    'pc-textarea': ComposeTextArea,
    'pc-condition': ComposeCondition
  },
  data() {
    return {
      argumentPath: '',
      threshold: false,
      thresholdValue: 0,
      tabIndex: 0
    }
  },
  computed: {
    candidate() {
      let component
      try {
        component = this.protocol.getComponent(this.path)
      } catch (e) {
        component = this.protocol
      }
      return component
    },
    example() {
      return 'e.g. "net_support(\'' + this.candidate.name + '\')>0"'
    },
    parentName() {
      return this.candidate._parent ? this.candidate._parent.name : ''
    },
    candIdx() {
      return this.candidate._parent ? this.candidate._parent.candidates.indexOf(this.candidate) : -1
    },
    numSiblings() {
      return this.candidate._parent ? this.candidate._parent.candidates.length : -1
    }
  },
  methods: {
    updateAttribute(evt) {
      // There is no setComponent method in a PROformajs protocol so we focus on attributes instead
      let comp = this.protocol.getComponent(this.path)
      comp[evt.name] = evt.value
      this.$emit('change-protocol', { value: this.protocol, emitter: 'pc-candidate.0' })
      // changing the name will change the path, so the path needs updating
      if (evt.name == 'name') {
        this.$emit('select-path', { value: comp.path() })
      }
    },
    updateArgumentPath(evt) {
      this.argumentPath = evt.value
      this.tabIndex = 1 // show Arguments tab
    },
    selectArgument(idx) {
      let argument = this.candidate.arguments[idx]
      this.argumentPath = argument.path()
    },
    addArgument(evt) {
      let arg = new Protocol.Argument({
        caption: evt.target.value,
        support: '+',
        activeCondition: evt.target.value
      })
      this.candidate.addArgument(arg)
      this.$emit('change-protocol', { value: this.protocol, emitter: 'pc-candidate.1' })
      evt.target.value = ''
    },
    deleteArgument(idx) {
      this.candidate.arguments.splice(idx, 1)
      this.$emit('change-protocol', { value: this.protocol, emitter: 'pc-candidate.2' })
      return false
    },
    reset() {
      this.tabIndex = 0 // show Details tab
    },
    attributeIssues(att) {
      return this.issues.filter((issue) => issue.attribute == att)
    },
    subComponentIssues(comp) {
      return this.issues.filter((issue) => issue.path.startsWith(comp))
    },
    prevCand() {
      let prevPath = this.candidate._parent.candidates[this.candIdx - 1].path()
      this.$emit('select-path', { value: prevPath })
    },
    nextCand() {
      let nextPath = this.candidate._parent.candidates[this.candIdx + 1].path()
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

<style scoped>
.clickable {
  cursor: pointer;
}
</style>
