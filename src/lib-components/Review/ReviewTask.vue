<docs>
Draws an enactment task.  If it's state is in_progress then the task is
interactable.

# props

* enactment - a PROformajs enactment
* task - a PROformajs enactment task
* options - display options object

# events

* send-trigger
</docs>

<template>
  <div v-if="task">
    <h3>
      <span v-if="!hideTaskCaption || !task.description">{{ task.caption || task.name }}</span>
      <span class="badge text-bg-warning ms-2" v-show="task.state != 'in_progress'">{{
        task.state
      }}</span>
    </h3>
    <pr-markdown v-if="task.description" :text="task.description" @send-trigger="$emit('send-trigger', $event)" />
    <div v-if="task.sources">
      <hr />
      <div class="row">
        <div class="col" v-if="task.sources.length == 1">
          <pr-source suffix="task" :key="task.sources[0].type" :source="task.sources[0]"
            :disabled="task.state != 'in_progress'" :value="enactment.get(task.path, task.sources[0].type)"
            @erase-source="updateSource" @update-source="updateSource" :hideEraser="hideEraser"
            :showDescriptionInline="showDescriptionInline" :useButtons="useButtons" :hideCaption="hideSourcesCaptions">
            <hr />
          </pr-source>
        </div>
        <template v-else>
          <div class="col-md-6">
            <pr-source suffix="task" v-for="source in sourceCols[0]" :key="source.type" :source="source"
              :disabled="task.state != 'in_progress'" :value="enactment.get(task.path, source.type)"
              @erase-source="updateSource" @update-source="updateSource" :hideEraser="hideEraser"
              :showDescriptionInline="showDescriptionInline" :useButtons="useButtons" :hideCaption="hideSourcesCaptions">
              <hr />
            </pr-source>
          </div>
          <div class="col-md-6">
            <pr-source suffix="task" v-for="source in sourceCols[1]" :key="source.type" :source="source"
              :disabled="task.state != 'in_progress'" :value="enactment.get(task.path, source.type)"
              @erase-source="updateSource" @update-source="updateSource" :hideEraser="hideEraser"
              :showDescriptionInline="showDescriptionInline" :useButtons="useButtons" :hideCaption="hideSourcesCaptions">
              <hr />
            </pr-source>
          </div>
        </template>
      </div>
    </div>
    <template v-if="task.candidates">
      <hr />
      <div v-for="candidate in sortedCands" :key="candidate.path" class="candidate">
        <div class="row g-0">
          <div style="width: 56px">
            <div class="float-end">
              <!-- recommended / rejected icon -->
              <span class="text-primary me-2" :disabled="task.state != 'in_progress'">
                <font-awesome-icon icon="check" v-if="candidate.recommended" />
                <font-awesome-icon icon="times" v-if="candidate.support == '--'" />
              </span>
              <!-- checkbox, candidate caption and net_support -->
              <input v-if="singleChoiceDecision" type="radio" :name="task.name" :value="candidate.name"
                :id="candidate.name" :checked="candidate.confirmed" @change="handleConfirmedChange"
                :disabled="task.state != 'in_progress'" class="mt-1 me-2" />
              <input v-else type="checkbox" :name="candidate.name" :id="candidate.name" :checked="candidate.confirmed"
                @change="handleConfirmedChange" :disabled="task.state != 'in_progress'" class="mt-1 me-2" />
            </div>
          </div>
          <div class="col">
            <label :for="candidate.name" :disabled="task.state != 'in_progress'" class="mb-1">
              <span class="review-candidate">{{ candidate.caption || candidate.name }}</span>
              <span class="badge rounded-pill bg-secondary ms-1 align-middle" v-show="
                candidate.support != 0 &&
                candidate.support != Infinity &&
                candidate.support != -Infinity
              " :disabled="task.state != 'in_progress'">{{ candidate.support }}</span>
            </label>
            <pr-markdown v-if="showCandidateDescriptionInline && candidate.description" :text="candidate.description"
              class="mb-1 markdown" />
            <PopoverButton :noTitle="true" v-if="!showCandidateDescriptionInline && candidate.description"
              :msg="candidate.description" class="pb-1 pt-0 pe-0">
              <font-awesome-icon icon="info-circle" />
            </PopoverButton>
            <div v-if="options.Decision.showExpressions" class="text-muted font-italic">
              {{ candidate.recommendCondition }}
            </div>
          </div>
        </div>
        <div v-for="(argument, index) in candidate.arguments" :key="index" :data-key="index" class="row g-0">
          <div v-if="argument.active" style="width: 90px">
            <div class="float-end pe-2">
              <span v-if="Math.abs(argument.support) > 1 && Math.abs(argument.support) < Infinity"
                class="text-muted meta me-1">{{ Math.abs(argument.support) }}</span>
              <font-awesome-icon v-if="argument.support == Infinity" icon="plus-circle" class="text-success" />
              <font-awesome-icon v-if="argument.support > 0 || argument.support == '++'" icon="plus-circle"
                class="text-success" />
              <font-awesome-icon v-if="argument.support < 0 || argument.support == '--'" icon="minus-circle"
                class="text-danger" />
              <font-awesome-icon v-if="argument.support == -Infinity" icon="minus-circle" class="text-danger" />
            </div>
          </div>
          <div v-if="!argument.active && options.Decision.showInactiveArguments" style="width: 90px" class="text-muted">
            <div class="float-end pe-2">
              <span v-if="Math.abs(argument.support) > 1 && Math.abs(argument.support) < Infinity"
                class="text-muted meta me-1">{{ Math.abs(argument.support) }}</span>
              <font-awesome-icon v-if="argument.support == '++'" icon="plus-circle" />
              <font-awesome-icon v-if="argument.support > 0 || argument.support == '++'" icon="plus-circle" />
              <font-awesome-icon v-if="argument.support < 0 || argument.support == '--'" icon="minus-circle" />
              <font-awesome-icon v-if="argument.support == '--'" icon="minus-circle" />
            </div>
          </div>
          <div class="col">
            <div v-if="argument.active">
              {{ argument.caption }}
              <template v-if="argument.description">
                <pr-markdown v-if="showArgumentDescriptionInline" :text="argument.description"
                  @send-trigger="$emit('send-trigger', $event)" class="mb-1 markdown text-muted" />
                <template v-else>
                  <PopoverButton :noTitle="true" :msg="argument.description" class="btn-link btn-sm pb-1 pt-0">
                    <font-awesome-icon icon="info-circle" />
                  </PopoverButton>
                </template>
              </template>
              <div v-if="options.Decision.showExpressions" class="text-muted font-italic">
                {{ argument.activeCondition }}
              </div>
            </div>
            <div v-if="!argument.active && options.Decision.showInactiveArguments" class="d-inline-block">
              <span class="text-muted">
                {{ argument.caption }}
              </span>
              <div v-if="options.Decision.showExpressions" class="text-muted font-italic">
                {{ argument.activeCondition }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-if="showComplete">
      <div role="group" class="btn-group float-end" v-if="task.candidates && options.Decision.allowDownloads">
        <button class="btn btn-outline-secondary btn-sm" v-if="task.candidates" @click="downloadData">
          <font-awesome-icon icon="file-download" />
        </button>
        <button class="btn btn-info" @click="$emit('update-enactment', { action: 'complete', path: task.path })"
          :disabled="!task.completeable">
          Complete
        </button>
      </div>
      <button class="btn btn-info float-end" v-else
        @click="$emit('update-enactment', { action: 'complete', path: task.path })" :disabled="!task.completeable">
        Complete
      </button>
    </template>
    <pr-expression v-if="options.debug" :enactment="enactment" :path="task.path" :description="debugDescription"
      class="mt-5" it="task" />
  </div>
  <div v-else>
    <h3>No active task</h3>
    <p class="text-muted">Sending a trigger or adding new data may change this state...</p>
  </div>
</template>

<script>
import ReviewSource from './ReviewSource.vue'
import ReviewExpression from './ReviewExpression.vue'
import ReviewMarkdown from './ReviewMarkdown.vue'
import FileSaver from 'file-saver'

// returns array of dependent data definition names
// NB this is copy pasted from pfanalyse.  TODO: Refactor this into proforamjs
function dependentDataDefs(decision) {
  console.debug('dependentDataDefs - called', decision)
  let result = []
  function merge(expression) {
    if (typeof expression != 'undefined') {
      var referenced = []
      for (const def of decision.allDataDefinitions()) {
        if (expression.indexOf(def.name) > -1) {
          referenced.push(def.name)
          if (def.valueCondition) {
            merge(def.valueCondition)
          }
        }
      }
      for (const def of referenced) {
        if (result.indexOf(def) == -1) {
          result.push(def)
        }
      }
    }
  }
  // check which dataDefinitions are referenced in the decision expressions
  for (const candidate of decision.candidates) {
    merge(candidate.recommendCondition)
    for (const argument of candidate.arguments) {
      merge(argument.activeCondition)
    }
  }
  console.debug('dependentDataDefs - returns', result)
  return result
}

export default {
  props: ['task', 'enactment', 'options'],
  emits: ['send-trigger', 'update-enactment'],
  components: {
    'pr-source': ReviewSource,
    'pr-expression': ReviewExpression,
    'pr-markdown': ReviewMarkdown
  },
  data: function () {
    return {
      path: '',
      managedCandidates: new Set([]) // candidates that have been manually (un)confirmed
    }
  },
  created() {
    this.path = this.task.path
  },
  computed: {
    sortedCands: function () {
      if (this.task.candidates) {
        let result = this.task.candidates.sort((left, right) => {
          if ((left.recommended && right.recommended) || (!left.recommended && !right.recommended))
            return right.support - left.support
          else if (left.recommended) return -1 // left recommended by not right
          else return 1 // right recommended but not left
        })
        return result
      } else {
        return []
      }
    },
    debugDescription: function () {
      return 'Evaluate expression in the context of this task (' + this.task.path + ')'
    },
    sourceCols() {
      if (this.task.sources && this.task.sources.length > 0) {
        if (this.task.sources.length == 2) {
          return [[this.task.sources[0]], [this.task.sources[1]]]
        } else {
          let lens = []
          for (const source of this.task.sources) {
            if (source.range) {
              lens.push(3 + source.range.length - 1)
            } else if (source.class == 'Boolean') {
              lens.push(4)
            } else {
              lens.push(3)
            }
          }
          // using floor here means that occasionally the second column
          // will be just longer than the first.
          let halfsum = Math.floor(lens.reduce((acc, cum) => acc + cum) / 2)
          let cum = 0
          let idx = 0
          // increment idx until you get to the half way point
          while (cum < halfsum) {
            cum = cum + lens[idx]
            idx++
          }
          return [this.task.sources.slice(0, idx), this.task.sources.slice(idx)]
        }
      } else {
        return [[], []]
      }
    },
    // meta options
    showComplete() {
      return this.task.meta &&
        this.task.meta.ui &&
        Object.keys(this.task.meta.ui).includes('showComplete')
        ? this.task.meta.ui.showComplete
        : true
    },
    showDescriptionInline() {
      return (
        this.task.meta &&
        this.task.meta.ui &&
        this.task.meta.ui.sources &&
        this.task.meta.ui.sources.showDescriptionInline
      )
    },
    showArgumentDescriptionInline() {
      return (
        this.task.meta &&
        this.task.meta.ui &&
        this.task.meta.ui.arguments &&
        this.task.meta.ui.arguments.showDescriptionInline
      )
    },
    showCandidateDescriptionInline() {
      return (
        this.task.meta &&
        this.task.meta.ui &&
        this.task.meta.ui.candidates &&
        this.task.meta.ui.candidates.showDescriptionInline
      )
    },
    hideEraser() {
      return (
        this.task.meta &&
        this.task.meta.ui &&
        this.task.meta.ui.sources &&
        this.task.meta.ui.sources.hideEraser
      )
    },
    useButtons() {
      return (
        this.task.meta &&
        this.task.meta.ui &&
        this.task.meta.ui.sources &&
        this.task.meta.ui.sources.useButtons
      )
    },
    hideSourcesCaptions() {
      return (
        this.task.meta &&
        this.task.meta.ui &&
        this.task.meta.ui.sources &&
        this.task.meta.ui.sources.hideCaptions
      )
    },
    hideTaskCaption() {
      return (
        this.task.meta &&
        this.task.meta.ui &&
        this.task.meta.ui.task &&
        this.task.meta.ui.task.hideCaption
      )
    },
    singleChoiceDecision() {
      return (
        this.task.meta &&
        this.task.meta.ui &&
        this.task.meta.ui.decision &&
        this.task.meta.ui.decision.singleChoice
      )
    }
  },
  methods: {
    updateSource(data) {
      data.path = this.task.path
      this.$emit('update-enactment', data)
    },
    handleConfirmedChange(evt) {
      let path =
        this.task.path + ':' + (this.singleChoiceDecision ? evt.target.value : evt.target.name)
      if (this.singleChoiceDecision) {
        // unselect existing choice
        let existing = this.task.candidates.find((cand) => cand.confirmed).name
        if (existing) {
          this.managedCandidates.add(existing) // adding existing to the managed candidates list stops it automatically overriding
          this.$emit('update-enactment', {
            action: 'unconfirm',
            path: this.task.path + ':' + existing
          })
        }
        this.managedCandidates.add(evt.target.value)
      } else {
        this.managedCandidates.add(evt.target.name)
      }
      if (evt.target.checked) {
        this.$emit('update-enactment', { action: 'confirm', path: path })
      } else {
        this.$emit('update-enactment', { action: 'unconfirm', path: path })
      }
    },
    downloadData() {
      let headings = ''
      let values = ''
      let decision = this.enactment.protocol.getComponent(this.task.path)
      for (const name of dependentDataDefs(decision)) {
        let def = decision.allDataDefinitions().find((dd) => dd.name == name)
        if (typeof def.valueCondition == 'undefined') {
          headings = headings + name + '\t'
          const val = JSON.stringify(this.enactment.get(def._parent.path(), name))
          values = values + (typeof val == 'undefined' ? '' : val) + '\t'
        }
      }
      for (const [idx, cand] of decision.candidates.entries()) {
        headings = headings + cand.name
        let candidate = this.task.candidates.find((c) => c.name == cand.name)
        values = values + candidate.confirmed
        if (idx < decision.candidates.length - 1) {
          headings = headings + '\t'
          values = values + '\t'
        }
      }
      FileSaver.saveAs(
        new Blob([headings + '\n' + values], { type: 'text/plain;charset=utf-8' }),
        this.task.name + '.tsv'
      )
    }
  },
  watch: {
    task(newtask) {
      if (newtask && newtask.path !== this.path) {
        this.path = newtask.path
        this.managedCandidates.clear()
        // on completing a task, scroll to the top of the next task
        // see https://stackoverflow.com/questions/40730116/scroll-to-bottom-of-div-with-vue-js
        const container = this.$el
        this.$nextTick(() => {
          container.ownerDocument.body.firstElementChild.scrollIntoView()
        })
      }
      if (this.options.Candidate.autoConfirmRecommended && newtask && newtask.candidates) {
        for (let candidate of newtask.candidates) {
          if (
            candidate.confirmed !== candidate.recommended &&
            !this.managedCandidates.has(candidate.name)
          ) {
            let path = this.task.path + ':' + candidate.name
            let action = candidate.recommended ? 'confirm' : 'unconfirm'
            this.$emit('update-enactment', { action: action, path: path })
          }
        }
      }
    }
  }
}
</script>
<style scoped>
.meta {
  font-size: x-small;
}

.review-candidate {
  font-size: larger;
  font-weight: bolder;
}

.markdown :last-child {
  margin-bottom: 0;
}
</style>
