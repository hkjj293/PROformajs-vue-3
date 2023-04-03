<docs>
Provides a compact UI for a proformajs Enactment.

# props

* enactment - a PROformajs enactment
* options - review settings
* debug - allows access to the "Debug expressions" functionality

# events

* change-enactment - signals the need to update the enactment
* change-option - signals an option change

todo:
* mobile view
* single task mode
</docs>

<template>
  <div v-if="enactment">
    <div class="row" style="margin-bottom: 80px">
      <div class="col-md-9">
        <!-- task view -->
        <template v-if="view == 'task'">
          <template v-if="enactment.protocol.tasks">
            <!-- header for plan enactment (as opposed to task enactment) -->
            <h3>
              {{ enactment ? enactment.protocol.caption || enactment.protocol.name : '' }}
            </h3>
            <div class="row" v-if="enactment && enactment.protocol.description">
              <div class="col">
                <pr-markdown class="mb-0" :text="enactment.protocol.description" @send-trigger="sendTrigger" />
              </div>
            </div>
            <hr />
          </template>
          <div v-if="status.finished">
            <slot name="finished">
              <h3>All done</h3>
            </slot>
          </div>
          <div v-else>
            <pr-task :task="activeTask" :enactment="enactment" @update-enactment="updateEnactment" :options="options" f
              @send-trigger="sendTrigger" />
          </div>
        </template>
        <!-- data view -->
        <template v-if="view == 'data'">
          <h3>Data</h3>
          <pr-data :enactment="enactment" @update-enactment="updateEnactment" :options="options" />
        </template>
        <!-- history view -->
        <div v-if="view == 'history'">
          <h3>History</h3>
          <pr-history :enactment="enactment" />
        </div>
        <!-- select view -->
        <template v-if="view == 'select'">
          <div class="row">
            <div class="col">
              <h3>Select</h3>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-6">
              <div><!-- used to be a card-deck -->
                <div class="card">
                  <template slot="header">
                    <h5>Available Tasks</h5>
                  </template>
                  <div class="list-group" v-if="availableTasks.length > 0">
                    <button v-for="task in availableTasks" :data-path="path" :data-taskpath="task.path"
                      :class="'list-group-item list-group-item-action ' + ((task.path == path) ? 'active' : '')"
                      :key="task.name" @click="updatePath({ value: task.path })">
                      {{ task.caption || task.name }}
                    </button>
                  </div>
                  <p v-else class="text-muted">No currently available tasks</p>
                </div>
              </div>
            </div>
            <div class="col-sm-6">
              <div><!-- used to be a card-deck -->
                <div class="card">
                  <template slot="header">
                    <h5>Triggers</h5>
                  </template>
                  <div class="list-group" v-if="status && status.triggers && status.triggers.length > 0">
                    <button class="list-group-item list-group-item-action" v-for="(trigger, index) in status.triggers"
                      :key="index" @click="sendTrigger(trigger)">
                      {{ trigger }}
                    </button>
                  </div>
                  <p v-else class="text-muted">No available triggers</p>
                </div>
              </div>
            </div>
          </div>
        </template>
        <!-- settings view -->
        <div v-if="view == 'settings'" class="row">
          <div class="col">
            <h3>Settings</h3>
            <label v-if="debug"><input type="checkbox" :checked="options.debug"
                @click="$emit('change-option', { option: 'debug', value: !options.debug })" />
              Debug expressions</label>
            <h5>Decisions</h5>
            <div>
              <label><input type="checkbox" :checked="options.Decision.showInactiveArguments" @click="
                $emit('change-option', {
                  category: 'Decision',
                  option: 'showInactiveArguments',
                  value: !options.Decision.showInactiveArguments
                })
              " />
                Show inactive arguments</label>
            </div>
            <div>
              <label><input type="checkbox" :checked="options.Decision.showExpressions" @click="
                $emit('change-option', {
                  category: 'Decision',
                  option: 'showExpressions',
                  value: !options.Decision.showExpressions
                })
              " />
                Show expressions</label>
            </div>
            <div>
              <label><input type="checkbox" :checked="options.Candidate.autoConfirmRecommended" @click="
                $emit('change-option', {
                  category: 'Candidate',
                  option: 'autoConfirmRecommended',
                  value: !options.Candidate.autoConfirmRecommended
                })
              " />
                Auto-confirm candidates</label>
            </div>
            <h5>Enquiries</h5>
            <div>
              <label><input type="checkbox" :checked="options.Enquiry.useDefaults" @click="
                $emit('change-option', {
                  category: 'Enquiry',
                  option: 'useDefaults',
                  value: !options.Enquiry.useDefaults
                })
              " />
                Use defaults</label>
            </div>
            <button class="btn btn-outline-secondary btn-sm btn-block" @click="restartEnactment">
              <font-awesome-icon icon="redo-alt" /> Restart
            </button>
          </div>
        </div>
      </div>
      <div class="col-md-3 d-none d-md-block">
        <template v-if="enactment.protocol.tasks">
          <!-- Use ReviewSettingPopover instead -->
          <pr-settings :id="'popover-reivew-compact'" class="float-end" :options="options" :restart="false"
            placement="left" @change-option="OnUpdateOptions" @restart-enactment="$emit('restart-enactment')" />
          <h4 class=" mt-2">
            Tasks
            <span class="badge badge-warning" v-show="status.finished">Completed</span>
          </h4>
          <div class="d-grid gap-2">
            <button v-for="task in availableTasks" :data-path="path" :data-taskpath="task.path"
              v-bind:class="'btn btn-outline-secondary btn-block d-block ' + ((view == 'task' && task.path == path) ? 'active' : '')"
              :key="task.name" @click="selectTask(task.path)">
              {{ task.caption || task.name }}
            </button>
          </div>
        </template>
        <template v-else>
          <!-- settings for a single task are inline in desktop view -->
          <button v-bind:class="'btn btn-outline-secondary btn-block ' + ((view == 'task') ? 'active' : '')"
            @click="view = 'task'" block>
            <font-awesome-icon icon="clipboard-check" /> Task
          </button>
          <label class="mt-2" v-if="debug"><input type="checkbox" :checked="options.debug"
              @click="$emit('change-option', { option: 'debug', value: !options.debug })" />
            Debug expressions</label>
          <template v-if="enactment.protocol.candidates">
            <div class="font-weight-bold pb-2">Decisions</div>
            <div>
              <label><input type="checkbox" :checked="options.Decision.showInactiveArguments" @click="
                $emit('change-option', {
                  category: 'Decision',
                  option: 'showInactiveArguments',
                  value: !options.Decision.showInactiveArguments
                })
              " />
                Show inactive arguments</label>
            </div>
            <div>
              <label><input type="checkbox" :checked="options.Decision.showExpressions" @click="
                $emit('change-option', {
                  category: 'Decision',
                  option: 'showExpressions',
                  value: !options.Decision.showExpressions
                })
              " />
                Show expressions</label>
            </div>
            <div>
              <label><input type="checkbox" :checked="options.Candidate.autoConfirmRecommended" @click="
                $emit('change-option', {
                  category: 'Candidate',
                  option: 'autoConfirmRecommended',
                  value: !options.Candidate.autoConfirmRecommended
                })
              " />
                Auto-confirm candidates</label>
            </div>
            <div>
              <label><input type="checkbox" :checked="options.Decision.allowDownloads" @click="
                $emit('change-option', {
                  category: 'Decision',
                  option: 'allowDownloads',
                  value: !options.Decision.allowDownloads
                })
              " />
                Allow Downloads</label>
            </div>
          </template>
        </template>
        <template v-if="status && status.triggers && status.triggers.length > 0">
          <h4>Triggers</h4>
          <div class="d-grid gap-2">
            <button class="btn btn-block" v-for="(trigger, index) in status.triggers" :key="index"
              @click="sendTrigger(trigger)">
              {{ trigger }}
            </button>
          </div>
        </template>
        <template v-if="enactment.protocol.tasks">
          <pr-map :enactment="enactment" :selectedtask="path" @select-task="updatePath" class="mt-2" />
        </template>
        <div class="d-grid gap-2">
          <button :class="'btn btn-outline-secondary btn-block' + ((view == 'data') ? 'active' : '')"
            @click="view = 'data'">
            <font-awesome-icon icon="table" /> Data
          </button>
          <button :class="'btn btn-outline-secondary btn-block' + ((view == 'history') ? 'active' : '')"
            @click="view = 'history'">
            <font-awesome-icon icon="history" /> History
          </button>
          <button class="btn btn-outline-secondary btn-block" @click="restartEnactment">
            <font-awesome-icon icon="redo-alt" /> Restart
          </button>
        </div>
      </div>
    </div>
    <!-- navbar for mobile view (visible only on sm or xs viewports)-->
    <div class="row d-md-none">
      <div class="col">
        <nav class="navbar navbar-light fixed-bottom">
          <div class="container-fluid">
            <ul class="navbar-nav">
              <li @click="view = 'task'" :class="'nav-item ' + ((view == 'task') ? 'active' : '')">
                <font-awesome-icon icon="clipboard-check" size="lg" class="me-2" />
              </li>
              <li v-if="enactment.protocol.tasks" @click="view = 'select'"
                :class="'nav-item ' + ((view == 'select') ? 'active' : '')">
                <font-awesome-icon icon="hand-pointer" size="lg" class="me-2" />
              </li>
              <li @click="view = 'data'" :class="'nav-item ' + ((view == 'data') ? 'active' : '')">
                <font-awesome-icon icon="table" size="lg" class="me-2" />
              </li>
              <li @click="view = 'history'" v-bind:class="'nav-item ' + ((view == 'history') ? 'active' : '')">
                <font-awesome-icon icon="history" size="lg" class="me-2" />
              </li>
            </ul>
            <ul class="navbar-nav ms-auto"><!-- right aligned-->
              <li @click="view = 'settings'" :class="'nav-item ' + ((view == 'settings') ? 'active' : '')">
                <font-awesome-icon icon="cog" size="lg" />
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
import { ReviewMixin } from './review'

export default {
  mixins: [ReviewMixin],
  data: function () {
    return {
      view: 'task' // task, data, history, select*, settings* (* - xs and sm view)
    }
  },
  emits: ['restart-enactment', 'change-option'],
  methods: {
    selectTask(path) {
      this.updatePath({ value: path })
      this.view = 'task'
    },
    restartEnactment() {
      this.view = 'task'
      this.$emit('restart-enactment')
    },
    OnUpdateOptions(opts) {
      this.$emit('change-option', opts)
    }
  }
}
</script>
