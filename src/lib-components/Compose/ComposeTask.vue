<docs>
Provides the means to review and edit a PROformajs task's attributes and children

# props

* protocol - a PROformajs Protocol
* path - the path to the task of interest

# events

* change-protocol - indicates need to update the protocol, optionally with an update to the selectedtask path
* delete-task - indicates desire to delete this task
</docs>

<template>
  <div>
    <pc-data v-if="dataDefinitionPath" :protocol="protocol" :path="dataDefinitionPath"
      :issues="subComponentIssues(dataDefinitionPath)" @change-protocol="relayChangeEvent($event, 0)"
      @select-path="updateDataDefinitionPath" ref="dataDefinitionEditor" />
    <pc-source v-if="sourcePath" :protocol="protocol" :path="sourcePath" @change-protocol="relayChangeEvent($event, 1)"
      @select-path="updateSourcePath" ref="sourceEditor" />
    <pc-candidate v-if="candidatePath" :protocol="protocol" :path="candidatePath"
      @change-protocol="relayChangeEvent($event, 2)" @select-path="updateCandidatePath" ref="candidateEditor"
      :issues="subComponentIssues(candidatePath)" />
    <div v-show="!dataDefinitionPath && !sourcePath && !candidatePath">
      <h4><pc-icon :icon="task.constructor.name" :scale="2" class="mb-1" /> {{ task.name }}</h4>
      <ul class="nav nav-tabs small" :id="'pc-task-tabs'" role="tablist">
        <li class="nav-item" role="presentation">
          <button :class="'nav-link ' + (tabIndex == 0 ? 'active' : '')" :id="'pc-task-tabs-details'" data-bs-toggle="tab"
            :data-bs-target="'#pc-task-tabs-details-p'" type="button" role="tab" :aria-controls="'pc-task-tabs-details-p'"
            :aria-selected="true" @click.prevent="tabIndex = 0">
            Details
          </button>
        </li>
        <li class="nav-item" role="presentation" v-if="!task._parent">
          <button :class="'nav-link ' + (tabIndex == 1 ? 'active' : '')" :id="'pc-task-tabs-data'" data-bs-toggle="tab"
            :data-bs-target="'#pc-task-tabs-data-p'" type="button" role="tab" :aria-controls="'pc-task-tabs-data-p'"
            :aria-selected="true" @click.prevent="tabIndex = 1">
            <span class="d-block d-sm-none">
              Data
              <span class="badge rounded-pill text-bg-secondary"
                v-if="task.dataDefinitions && task.dataDefinitions.length > 0">
                {{ task.dataDefinitions.length }}
              </span>
            </span>
            <span class="d-none d-sm-block">Data Definitions
              <span class="badge rounded-pill text-bg-secondary"
                v-if="task.dataDefinitions && task.dataDefinitions.length > 0">
                {{ task.dataDefinitions.length }}
              </span>
            </span>
          </button>
        </li>
        <li class="nav-item" role="presentation" v-if="task.constructor.name == 'Enquiry'">
          <button :class="'nav-link ' + (tabIndex == 2 ? 'active' : '')" :id="'pc-task-tabs-source'" data-bs-toggle="tab"
            :data-bs-target="'#pc-task-tabs-source-p'" type="button" role="tab" :aria-controls="'pc-task-tabs-source-p'"
            :aria-selected="true" @click.prevent="tabIndex = 2">
            Sources
            <span class="badge rounded-pill text-bg-secondary" v-if="task.sources && task.sources.length > 0">
              {{ task.sources.length }}
            </span>
          </button>
        </li>
        <li class="nav-item" role="presentation" v-if="task.constructor.name == 'Decision'">
          <button :class="'nav-link ' + (tabIndex == 3 ? 'active' : '')" :id="'pc-task-tabs-candidates'"
            data-bs-toggle="tab" :data-bs-target="'#pc-task-tabs-candidates-p'" type="button" role="tab"
            :aria-controls="'pc-task-tabs-candidates-p'" :aria-selected="true" @click.prevent="tabIndex = 3">
            <span class="d-block d-sm-none">
              Cands
              <span class="badge rounded-pill text-bg-secondary" v-if="task.candidates && task.candidates.length > 0">
                {{ task.candidates.length }}
              </span>
            </span>
            <span class="d-none d-sm-block">
              Candidates
              <span class="badge rounded-pill text-bg-secondary" v-if="task.candidates && task.candidates.length > 0">
                {{ task.candidates.length }}
              </span>
            </span>
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button :class="'nav-link ' + (tabIndex == 4 ? 'active' : '')" :id="'pc-task-tabs-constraints'"
            data-bs-toggle="tab" :data-bs-target="'#pc-task-tabs-constraints-p'" type="button" role="tab"
            :aria-controls="'pc-task-constraints-p'" :aria-selected="true" @click.prevent="tabIndex = 4">
            constraints
          </button>
        </li>
      </ul>
      <div class="tab-content mt-2">
        <div :class="'tab-pane ' + (tabIndex == 0 ? 'active' : '')" id="pc-task-tabs-details-p">
          <form>
            <pc-name class="mb-3" :comp="task" @change-attribute="updateAttribute" v-if="protocol.tasks" />
            <pc-input class="mb-3" att="caption" :comp="task" @change-attribute="updateAttribute" />
            <pc-textarea class="mb-3" att="description" :comp="task" @change-attribute="updateAttribute" />
            <div>
              <pc-checkbox class="form-check-inline" :comp="task" :disabled="disableAutonomous" att="autonomous"
                @change-attribute="updateAttribute" />
              <pc-checkbox class="form-check-inline" v-if="task._parent" :comp="task" att="optional"
                @change-attribute="updateAttribute" />
              <pc-checkbox class="form-check-inline" :comp="task" :disabled="disableCyclic" att="cyclic"
                @change-attribute="updateAttribute" />
            </div>
            <button v-if="task._parent" class="btn btn-outline-danger btn-sm d-block float-end"
              @click.prevent="deleteTask">
              Delete
            </button>
          </form>
          <ul class="list-unstyled">
            <li v-for="(issue, idx) in issues" :key="idx" v-bind:class="{
              'text-danger': issue.type == 'Error',
              'text-info': issue.type == 'Warning'
            }">
              <font-awesome-icon :icon="issue.type == 'Warning' ? 'info-circle' : 'exclamation-triangle'" />
              <span v-if="issue.path != path" class="clickable text-primary" @click="selectTask(issue.path)">{{
                localPath(issue) }}:</span>
              {{ issue.msg
              }}<span v-if="issue.attribute && issue.msg.indexOf(issue.attribute) == -1">
                ({{ issue.attribute }})</span>
            </li>
          </ul>
        </div>
        <div :class="'tab-pane ' + (tabIndex == 1 ? 'active' : '')" id="pc-task-tabs-data-p" v-if="!task._parent">
          <div class="form-group">
            <input type="text" class="form-control form-control-sm" id="newcdatadef" @change="handleDDText"
              placeholder="Enter data definition name" autocapitalize="off" />
            <table class="table table-sm mt-2" v-if="task.dataDefinitions.length > 0">
              <tbody>
                <tr v-for="(def, idx) in dataDefinitions" :key="idx">
                  <td class="clickable" @click="selectDef(idx)">{{ def.name }}</td>
                  <td class="clickable" @click="selectDef(idx)">
                    <span class="badge rounded-pill text-bg-secondary">{{
                      def.constructor.name
                    }}</span>
                    <span class="badge rounded-pill text-bg-secondary" v-if="def.multiValued">Multi-valued</span>
                    <span class="badge rounded-pill text-bg-secondary" v-if="def.range">Ranged</span>
                    <span class="badge rounded-pill text-bg-secondary" v-if="def.valueCondition">Dynamic</span>
                    <span class="badge rounded-pill text-bg-secondary" v-if="def.defaultValue">Default value</span>
                  </td>
                  <td>
                    <button class="btn btn-light btn-sm float-sm-end" @click="deleteDef(idx)">
                      &times;
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div :class="'tab-pane ' + (tabIndex == 2 ? 'active' : '')" id="pc-task-tabs-source-p"
          v-if="task.constructor.name == 'Enquiry'">
          <form>
            <template v-if="sourceDataDefs().length > 0">
              <template v-if="availableDataDefs().length > 0">
                <div class="form-row">
                  <div class="col">
                    <select class="form-control form-control-sm" ref="newSourceType">
                      <option v-for="dd in availableDataDefs()" :key="dd.path()">
                        {{ dd.name }}
                      </option>
                    </select>
                  </div>
                  <div class="col">
                    <button class="btn btn-outline-secondary btn-sm d-block float-sm-end" @click="addSource" block>
                      New Source
                    </button>
                  </div>
                </div>
              </template>
              <template v-else> No more available data definitions </template>
              <table class="table table-sm mt-2" v-show="task.sources.length > 0">
                <tbody>
                  <!-- existing sources -->
                  <tr v-for="(src, idx) in task.sources" :key="idx">
                    <td class="clickable" @click="selectSource(idx)">
                      {{ src.type }}
                    </td>
                    <td class="clickable" @click="selectSource(idx)">
                      {{ renderCondition(src) }}
                    </td>
                    <td>
                      <button class="btn btn-light btn-sm float-sm-end" @click="deleteSource(idx)">
                        &times;
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </template>
            <p v-else>
              You need to add at least one manual data definition to the root plan before being able
              to source it in this enquiry.
            </p>
          </form>
        </div>
        <div :class="'tab-pane ' + (tabIndex == 3 ? 'active' : '')" id="pc-task-tabs-candidates-p"
          v-if="task.constructor.name == 'Decision'">
          <div class="form-group">
            <input type="text" class="form-control form-control-sm" id="newcandidate" @change="addCandidate"
              placeholder="Enter candidate name" autocapitalize="off" />
            <table class="table table-sm mt-2" v-show="task.candidates.length > 0">
              <tbody>
                <!-- existing candidates -->
                <tr v-for="(cand, idx) in task.candidates" :key="idx">
                  <td class="clickable" @click="selectCandidate(idx)">
                    {{ cand.caption || cand.name }}
                  </td>
                  <td class="clickable" @click="selectCandidate(idx)">
                    <span class="badge rounded-pill text-bg-secondary" pill>
                      {{ cand.arguments.length }} Argument{{
                        cand.arguments.length != 1 ? 's' : ''
                      }}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-light btn-sm float-sm-end" @click="deleteCandidate(idx)">
                      &times;
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div :class="'tab-pane ' + (tabIndex == 4 ? 'active' : '')" id="pc-task-tabs-constraints-p">
          <form>
            <pc-nt-condition att="waitCondition" :comp="task" @change-attribute="updateAttribute"
              :issues="attributeIssues('waitCondition')" />
            <pc-nt-condition att="preCondition" :comp="task" @change-attribute="updateAttribute"
              :issues="attributeIssues('preCondition')" />
            <pc-input att="eventTrigger" :comp="task" @change-attribute="updateAttribute" />
            <pc-condition att="cycleUntil" :comp="task" @change-attribute="updateAttribute" :disabled="!task.cyclic"
              description="e.g. index()==2" :issues="attributeIssues('cycleCondition')" />
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Protocol } from '@openclinical/proformajs'
import ComposeData from './ComposeData.vue'
import ComposeSource from './ComposeSource.vue'
import ComposeCandidate from './ComposeCandidate.vue'
import ComposeName from './ComposeName.vue'
import ComposeInput from './ComposeInput.vue'
import ComposeTextArea from './ComposeTextArea.vue'
import ComposeCondition from './ComposeCondition.vue'
import ComposeNonTemporalCondition from './ComposeNonTemporalCondition.vue'
import ComposeCheckbox from './ComposeCheckbox.vue'
import { TemporalConstraintMixin } from '../Core/compose.js'
import ComposeIcon from './ComposeIcon.vue'

export default {
  name: 'pc-task',
  props: {
    protocol: Object,
    path: String, // path of the selected component,
    issues: Array
  },
  emits: ['change-protocol', 'delete-task'],
  mixins: [TemporalConstraintMixin],
  components: {
    'pc-data': ComposeData,
    'pc-source': ComposeSource,
    'pc-candidate': ComposeCandidate,
    'pc-name': ComposeName,
    'pc-input': ComposeInput,
    'pc-textarea': ComposeTextArea,
    'pc-condition': ComposeCondition,
    'pc-nt-condition': ComposeNonTemporalCondition,
    'pc-checkbox': ComposeCheckbox,
    'pc-icon': ComposeIcon
  },
  data() {
    return {
      tabIndex: 0,
      dataDefinitionPath: '',
      sourcePath: '',
      candidatePath: '',
      dataDefinitionsFilter: ''
    }
  },
  computed: {
    task() {
      let component
      try {
        component = this.protocol.getComponent(this.path)
      } catch (e) {
        component = this.protocol
      }
      return component
    },
    autoCycling() {
      if (this.task) {
        // identifies tasks that could cycle infinitely
        let clazz = this.task.constructor.name
        if (clazz == 'Plan') {
          // a plan with no manual tasks
          return (
            this.task.tasks.filter((subtask) => !subtask.optional && !subtask.autonomous).length ==
            0
          )
        } else {
          return true // an Enquiry, Decision or Task could auto cycle
        }
      } else {
        return false
      }
    },
    disableCyclic() {
      // an autocycling task that is autonomous and cyclic will cycle indefinately - this check should prevent this state, see disableAutonomous
      return this.autoCycling && this.task.autonomous
    },
    disableAutonomous() {
      // an autoCycling task that is autonomous and cyclic will cycle indefinately - this check should prevent this state, see disableCyclic
      return this.autoCycling && this.task.cyclic
    },
    iconPath() {
      return '/icons/' + this.task.constructor.name + '.svg'
    },
    dataDefinitions() {
      if (this.task) {
        if (this.dataDefinitionsFilter) {
          return this.task.dataDefinitions.filter((dd) =>
            dd.name.includes(this.dataDefinitionsFilter)
          )
        } else {
          return this.task.dataDefinitions
        }
      } else {
        return null
      }
    }
  },
  methods: {
    selectTask(path) {
      function parentTask(comp) {
        if (comp instanceof Protocol.Task) {
          return comp
        } else {
          if (comp._parent) {
            return parentTask(comp._parent)
          }
        }
      }
      const task = parentTask(this.protocol.getComponent(path)).path()
      this.$emit('select-task', { value: task })
    },
    localPath(issue) {
      return issue.path ? issue.path.replace(this.path + ':', '') : ''
    },
    updateAttribute(evt) {
      // There is no setComponent method in a PROformajs protocol so we focus on attributes instead
      let comp = this.protocol.getComponent(this.path)
      if (evt.name == 'name') {
        // update temporal constraints of tasks that depend on this one
        if (evt.value != null && evt.value.length > 0) {
          for (let depname of this.getForwardDeps(comp)) {
            let dep = this.protocol.getComponent(comp._parent.path() + ':' + depname)
            dep.waitCondition = dep.waitCondition.replace(comp.name, evt.value)
            dep.preCondition = dep.preCondition.replace(comp.name, evt.value)
          }
        }
      }
      let newevt = { value: this.protocol }
      if (evt.value == null || evt.value.length == 0) {
        comp[evt.name] = null
      } else {
        comp[evt.name] = evt.value
      }
      if (evt.name == 'name') {
        // changing the name will change the path, so the selectedtask path needs updating
        newevt.selected = comp.path()
      }
      newevt.emitter = 'pc-task.0'
      this.$emit('change-protocol', newevt)
    },
    handleDDText(evt) {
      // three states for processing input text (evt.target.value):
      // 1. the text partially matches several dds -> reduce the list of dds to matches
      // 2. the text exactly matches one dd -> go to the details of this one (and clear input box)
      // 3. the test doesnt match any dd -> create a new one and add it to the list (and clear input box)
      this.dataDefinitionsFilter = evt.target.value
      if (this.dataDefinitions.length > 0) {
        if (this.dataDefinitions.length == 1) {
          this.dataDefinitionPath = this.dataDefinitions[0].path()
          // clear filter and input text
          this.dataDefinitionsFilter = null
          evt.target.value = ''
        }
      } else {
        let def = new Protocol.Integer({
          name: evt.target.value,
          caption: evt.target.value.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
            return str.toUpperCase()
          })
        })
        this.task.addDataDefinition(def)
        this.$emit('change-protocol', { value: this.protocol, emitter: 'pc-task.1' })
        this.dataDefinitionsFilter = null
        evt.target.value = ''
      }
    },
    selectDef(idx) {
      let def = this.task.dataDefinitions[idx]
      this.dataDefinitionPath = def.path()
    },
    updateDataDefinitionPath(evt) {
      this.dataDefinitionPath = evt.value
      this.tabIndex = 1 // show Data tab
    },
    deleteDef(idx) {
      this.task.dataDefinitions.splice(idx, 1)
      this.$emit('change-protocol', { value: this.protocol, emitter: 'pc-task.2' })
    },
    sourceDataDefs() {
      // return all non-dynamic data definitions
      return this.task.allDataDefinitions().filter(function (dd) {
        return !dd.valueCondition
      })
    },
    availableDataDefs() {
      // return all non-dynamic data definitions that are not already used by this enquiry
      let sources = this.task.sources
      function used(dd) {
        return sources.find(function (src) {
          return src.type == dd.name
        })
      }
      return this.sourceDataDefs().filter(function (dd) {
        return !used(dd)
      })
    },
    updateSourcePath(evt) {
      this.sourcePath = evt.value
      this.tabIndex = 1 // show Sources tab
    },
    selectSource(idx) {
      let source = this.task.sources[idx]
      this.sourcePath = source.path()
    },
    addSource() {
      let type = this.$refs.newSourceType.value
      this.task.addSource(new Protocol.Source({ type: type }))
      this.$emit('change-protocol', { value: this.protocol, emitter: 'pc-task.2' })
    },
    renderCondition(src) {
      if (src.requestCondition) {
        let result = 'custom'
        let mtch = src.requestCondition.match(/!is_known\('(\w+)'\)/)
        if (mtch && mtch[1] == src.type) {
          mtch = src.requestCondition.match(
            /\|\|\s*last_updated\('(\w+)'\)\.diff\(now\(\),\s*'(minutes|hours|days|months|years)'\)>(\d+)/
          )
          if (mtch && mtch[1] == src.type) {
            result = 'from last ' + mtch[3] + ' ' + mtch[2]
          } else {
            result = 'required'
          }
        }
        return result
      } else {
        return 'optional'
      }
    },
    renderNonTemporalClauses(expr) {
      return this.getNonTemporalClauses(expr).nonTemporal
    },
    deleteSource(idx) {
      this.task.sources.splice(idx, 1)
      this.$emit('change-protocol', { value: this.protocol, emitter: 'pc-task.3' })
    },
    addCandidate(evt) {
      let cand = new Protocol.Candidate({
        name: evt.target.value,
        caption: evt.target.value.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
          return str.toUpperCase()
        }),
        recommendCondition: "net_support('" + evt.target.value + "')>0"
      })
      this.task.addCandidate(cand)
      this.$emit('change-protocol', { value: this.protocol, emitter: 'pc-task.4' })
      evt.target.value = ''
    },
    updateCandidatePath(evt) {
      this.candidatePath = evt.value
      if (this.candidate && this.candidate._parent) {
        this.tabIndex = 1 // show Candidates for decision in plan
      } else {
        this.tabIndex = 2 // for standalone decision
      }
    },
    selectCandidate(idx) {
      let candidate = this.task.candidates[idx]
      this.candidatePath = candidate.path()
    },
    deleteCandidate(idx) {
      this.task.candidates.splice(idx, 1)
      this.$emit('change-protocol', { value: this.protocol, emitter: 'pc-task.1' })
      return false
    },
    reset() {
      this.tabIndex = 0 // show Details tab
      // reset state of the dialogues
      this.dataDefinitionPath = '' // closes the DataDefinitionEditor if its open
      this.sourcePath = ''
      this.candidatePath = ''
    },
    attributeIssues(att) {
      return this.issues.filter((issue) => issue.attribute == att)
    },
    subComponentIssues(comp) {
      return this.issues.filter((issue) => issue.path.startsWith(comp))
    },
    deleteTask(evt) {
      this.$emit('delete-task', evt)
    },
    relayChangeEvent(evt, idx) {
      evt.relay = 'pc-task.' + idx
      this.$emit('change-protocol', evt)
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
