<docs>
Provides a UI for a proformajs Enactment.

# props

* enactment - a PROformajs enactment
* options - review settings
* debug - allows access to the "Debug expressions" functionality

# events

* change-enactment - signals the need to update the enactment
* change-option - signals an option change

</docs>

<template>
  <div v-if="enactment">
    <template v-if="enactment.protocol.tasks">
      <div class="row">
        <div class="col">
          <div class="float-end">
            <button @click="$emit('restart-enactment')" class="btn btn-outline-secondary d-none d-sm-inline">
              <font-awesome-icon icon="redo-alt" /> Restart
            </button>
            <!-- <b-button id="task-settings" href="#" tabindex="0" class="btn btn-outline-secondary ms-1"> -->
            <!-- <font-awesome-icon icon="cog" /> -->
            <!-- </b-button>  -->
            <pr-settings :id="'popover-reivew'" class="d-none d-sm-inline ms-1" :options="options" placement="left"
              @change-option="OnUpdateOptions" @restart-enactment="$emit('restart-enactment')" />
          </div>
          <!-- <b-popover target=" task-settings" placement="left" title="Review Settings" triggers="focus"> -->
          <!-- <label v-if="debug"><input type='checkbox' :checked="options.debug" -->
          <!-- @click="$emit('change-option', { option: 'debug', value: !options.debug })" /> Debug expressions</label> -->
          <!-- <div class="font-weight-bold pb-2">Decisions</div> -->
          <!-- <label><input type='checkbox' :checked="options.Decision.showInactiveArguments" -->
          <!-- @click="$emit('change-option', { category: 'Decision', option: 'showInactiveArguments', value: !options.Decision.showInactiveArguments })" /> -->
          <!-- Show inactive arguments</label> -->
          <!-- <label><input type='checkbox' :checked="options.Decision.showExpressions" -->
          <!-- @click="$emit('change-option', { category: 'Decision', option: 'showExpressions', value: !options.Decision.showExpressions })" /> -->
          <!-- Show expressions</label> -->
          <!--  <label><input type='checkbox' :checked="options.Candidate.autoConfirmRecommended" -->
          <!-- @click="$emit('change-option', { category: 'Candidate', option: 'autoConfirmRecommended', value: !options.Candidate.autoConfirmRecommended })" /> -->
          <!-- Auto-confirm candidates</label> -->
          <!-- <label><input type='checkbox' :checked="options.Decision.allowDownloads" -->
          <!-- @click="$emit('change-option', { category: 'Decision', option: 'allowDownloads', value: !options.Decision.allowDownloads })" /> -->
          <!-- Allow Downloads</label> -->
          <!-- <div class="font-weight-bold pb-2">Enquiries</div> -->
          <!-- <label><input type='checkbox' :checked="options.Enquiry.useDefaults" -->
          <!-- @click="$emit('change-option', { category: 'Enquiry', option: 'useDefaults', value: !options.Enquiry.useDefaults })" /> -->
          <!-- Use defaults</label> -->
          <!-- <b-btn variant="outline-secondary" size="sm" @click="$emit('restart-enactment')" class="d-block d-sm-none" -->
          <!-- block> -->
          <!-- <font-awesome-icon icon="redo-alt" /> Restart -->
          <!-- </b-btn> -->
          <!-- </b-popover> -->
          <h3>
            {{ enactment ? enactment.protocol.caption || enactment.protocol.name : '' }}
            <span class="badge text-bg-warning" v-show="status.finished">Completed</span>
          </h3>
        </div>
      </div>
      <div class="row" v-if="enactment && enactment.protocol.description">
        <div class="col">
          <pr-markdown class="mb-0" :text="enactment.protocol.description" @send-trigger="sendTrigger" />
        </div>
      </div>
      <hr />
    </template>
    <div class="row">
      <div class="col-md-6 order-md-2">
        <!-- Selected task detail -->
        <template v-if="!enactment.protocol.tasks"><!-- settings dialogue for single decision -->
          <div class="float-end">
            <button @click="$emit('restart-enactment')" role="button"
              class="btn btn-outline-secondary d-none d-sm-inline">
              <font-awesome-icon icon="redo-alt" /> Restart
            </button>
            <!-- <b-button id="task-settings" variant="outline-secondary" href="#" tabindex="0"> -->
            <!-- <font-awesome-icon icon="cog" /> -->
            <!-- </b-button> -->
            <pr-settings :id="'popover-reivew'" :options="options" placement="left" @change-option="OnUpdateOptions"
              @restart-enactment="$emit('restart-enactment')" />
          </div>
        </template>
        <div v-if="status.finished">
          <slot name="finished">
            <h3>All done</h3>
          </slot>
        </div>
        <div v-else>
          <pr-task :task="activeTask" :enactment="enactment" @update-enactment="updateEnactment" :options="options"
            @send-trigger="sendTrigger" />
        </div>
      </div>
      <div class="col-md-6 order-md-1">
        <!-- enactment status tabs -->
        <div>
          <ul class="nav nav-tabs" id="debug-review-tabs" role="tablist">
            <li class="nav-item" role="presentation" v-if="enactment.protocol.tasks">
              <button class="nav-link active" id="debug-review-map-tab" data-bs-toggle="tab"
                data-bs-target="#debug-review-map" type="button" role="tab" aria-controls="debug-review-map-tab-pane"
                aria-selected="true">
                Map <font-awesome-icon icon="directions" />
              </button>
            </li>
            <li class="nav-item" role="presentation" v-if="enactment.getDataDefinitions().length > 0">
              <button class="nav-link" id="debug-review-data-tab" data-bs-toggle="tab" data-bs-target="#debug-review-data"
                type="button" role="tab" aria-controls="debug-review-data-tab-pane" aria-selected="false">
                Data <font-awesome-icon icon="table" />
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="debug-review-select-tab" data-bs-toggle="tab"
                data-bs-target="#debug-review-select" type="button" role="tab"
                aria-controls="debug-review-select-tab-pane" aria-selected="false">
                Select <font-awesome-icon icon="hand-pointer" />
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="debug-review-history-tab" data-bs-toggle="tab"
                data-bs-target="#debug-review-history" type="button" role="tab"
                aria-controls="debug-review-history-tab-pane" aria-selected="false">
                History <font-awesome-icon icon="history" />
              </button>
            </li>
          </ul>
          <div class="tab-content mt-3">
            <div id="debug-review-map" class="tab-pane active" role="tabpanel" aria-labelledby="debug-review-map-tab-pane"
              tabindex="0">
              <pr-map :enactment="enactment" :selectedtask="path" @select-task="updatePath" />
            </div>
            <div id="debug-review-data" class="tab-pane" role="tabpanel" aria-labelledby="debug-review-data-tab-pane"
              tabindex="0">
              <pr-data :enactment="enactment" @update-enactment="updateEnactment" :options="options" />
            </div>
            <div id="debug-review-select" class="tab-pane" role="tabpanel" aria-labelledby="debug-review-select-tab-pane"
              tabindex="0">
              <div class="row">
                <div class="col-sm-6">
                  <div>
                    <!-- used to be a card-deck -->
                    <div class="card">
                      <div class="card-header">
                        <h5>Available Tasks</h5>
                      </div>
                      <div class="card-body">
                        <div class="list-group" v-if="availableTasks.length > 0">
                          <button v-for="task in availableTasks" :data-path="path" :data-taskpath="task.path" :class="
                            'list-group-item list-group-item-action ' +
                            (task.path == path ? 'active' : '')
                          " :key="task.name" @click="updatePath({ value: task.path })">
                            {{ task.caption || task.name }}
                          </button>
                        </div>
                        <p v-else class="text-muted">No currently available tasks</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-sm-6">
                  <div>
                    <!-- used to be a card-deck -->
                    <div class="card">
                      <div class="card-header">
                        <h5>Triggers</h5>
                      </div>
                      <div class="card-body">
                        <div class="list-group" v-if="status && status.triggers && status.triggers.length > 0">
                          <button class="list-group-item list-group-item-action"
                            v-for="(trigger, index) in status.triggers" :key="index" @click="sendTrigger(trigger)">
                            {{ trigger }}
                          </button>
                        </div>
                        <p v-else class="text-muted">No available triggers</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div id="debug-review-history" class="tab-pane" role="tabpanel"
              aria-labelledby="debug-review-history-tab-pane" tabindex="0">
              <pr-history :enactment="enactment" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ReviewMixin } from './review'

export default {
  mixins: [ReviewMixin],
  methods: {
    OnUpdateOptions(opts) {
      this.$emit('change-option', opts)
    }
  }
}
</script>

<style scoped>
.card-body {
  padding: 1.25rem;
}

.list-group-item {
  padding: 0.75rem 1.25rem;
}

p {
  margin-top: 0;
  margin-bottom: 1rem;
}
</style>
