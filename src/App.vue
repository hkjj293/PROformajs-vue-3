<script>
import { Protocol } from '@openclinical/proformajs'
import DebugApp from './DebugApp.vue'

const template2 = {
  class: 'Plan',
  meta: {
    svg: {
      width: 800,
      height: 400
    }
  },
  caption: 'Plan',
  name: 'plan',
  autonomous: true,
  dataDefinitions: [
    {
      class: 'Integer',
      caption: ' B',
      name: 'B'
    }
  ],
  tasks: [
    {
      class: 'Decision',
      meta: {
        pos: {
          x: 270.04226258851673,
          y: 137.24439206971024
        }
      },
      caption: 'Decision A',
      name: 'decisionA',
      candidates: [
        {
          class: 'Candidate',
          caption: 'A',
          name: 'a',
          recommendCondition: "net_support('a')>0",
          arguments: [
            {
              class: 'Argument',
              caption: 'random() > 0.2',
              description: 'Description 0',
              support: 1,
              activeCondition: 'random() > 0.2'
            },
            {
              class: 'Argument',
              caption: ' random() > 0.4',
              description: 'Description 1',
              support: 1,
              activeCondition: ' random() > 0.4'
            }
          ]
        }
      ]
    },
    {
      class: 'Enquiry',
      meta: {
        pos: {
          x: 114.93010398272196,
          y: 132.0448634423179
        }
      },
      caption: 'Enquiry B',
      name: 'enquiryB',
      sources: [
        {
          class: 'Source',
          type: 'B'
        }
      ]
    },
    {
      class: 'Action',
      meta: {
        pos: {
          x: 197.58842645773524,
          y: 32.22691806539074
        }
      },
      caption: 'Action C',
      name: 'actionC',
      preCondition: 'index()==2'
    },
    {
      class: 'Plan',
      meta: {
        pos: {
          x: 173.52608901109784,
          y: 251.02243172115897
        }
      },
      caption: 'Plan D',
      name: 'planD',
      autonomous: true
    }
  ]
}

const template = {
  "class": "Plan",
  "name": "plan",
  "caption": "Plan",
  "dataDefinitions": [],
  "tasks": [],
  "autonomous": true,
  "meta": {
    "svg": {
      "width": 800,
      "height": 400
    }
  }
};
/*{
  class: 'Plan',
  name: 'plan',
  caption: 'Plan',
  dataDefinitions: [],
  tasks: [],
  autonomous: true,
  meta: {
    svg: {
      width: 800,
      height: 400
    }
  }
}*/

function checkTaskMeta(plan) {
  if (plan.tasks) {
    for (const [idx, task] of plan.tasks.entries()) {
      if (!task.meta || !task.meta.pos) {
        if (!task.meta) {
          task.meta = {}
        }
        task.meta.pos = {
          x: 80 + idx * 80,
          y: 80
        }
      }
      if (task.tasks) {
        checkTaskMeta(task)
      }
    }
  }
}

function checkMeta(protocol) {
  if (!protocol.meta || !protocol.meta.svg) {
    if (!protocol.meta) {
      protocol.meta = {}
    }
    protocol.meta.svg = {
      width: 800,
      height: 400
    }
  }
  if (protocol.tasks) {
    checkTaskMeta(protocol)
  }
}

export default {
  name: 'ServeDev',
  data: function () {
    return {
      selectedtask: template2.name, // initial value,
      tab: 'compose',
      protocol: new Protocol.Plan(template2),
      initialData: {}
    }
  },
  created: function () {
    // initial data can be passed in the querystring
    // see https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
    const urlParams = new URLSearchParams(window.location.search)
    for (let entry of urlParams.entries()) {
      this.initialData[entry[0]] = JSON.parse(entry[1])
    }
  },
  computed: {
    startData() {
      let result = {}
      if (this.initialData && Object.keys(this.initialData).length > 0) {
        result[this.protocol.name] = this.initialData
      }
      return result
    }
  },
  methods: {
    updateProtocol(e) {
      checkMeta(e.value)
      this.protocol = e.value
      if (e.selected) {
        this.selectedtask = e.selected
      }
      try {
        let selected = this.protocol.getComponent(this.selectedtask)
      } catch (e) {
        // drop back to root path in case of error, assumed caused by name changes
        this.selectedtask = this.protocol.name
      }
    },
    resetProtocol(clazz) {
      if (clazz && ['Action', 'Decision', 'Enquiry'].indexOf(clazz) > -1) {
        let proto = new Protocol[clazz]({
          name: clazz.toLowerCase(),
          caption: clazz,
          meta: { svg: { width: 400, height: 200 }, pos: { x: 190, y: 100 } }
        })
        this.protocol = proto
        this.selectedtask = clazz.toLowerCase()
      } else {
        this.protocol = new Protocol.Plan(template)
        this.selectedtask = template.name
      }
    },
    updateSelectedTask(evt) {
      this.selectedtask = evt.value
    }
  },
  components: {
    DebugApp
  }
}
</script>

<template>
  <div id="app">
    <main role="main">
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary px-3">
        <div class="container-fluid">
          <div class="navbar-brand">PRO<em>formajs</em></div>
          <button type="button" aria-label="Toggle navigation" class="navbar-toggler" aria-expanded="false"
            aria-controls="nav_collapse" data-bs-toggle="collapse" data-bs-target="#nav_collapse"
            style="overflow-anchor: none">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div id="nav_collapse" class="navbar-collapse collapse" style="justify-content: end">
            <ul class="navbar-nav ml-auto">
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                  aria-expanded="false">
                  Reset
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li class="dropdown-item" role="presentation" @click="resetProtocol">Plan</li>
                  <li class="dropdown-item" role="presentation" @click="resetProtocol('Decision')">Decision</li>
                  <li class="dropdown-item" role="presentation" @click="resetProtocol('Action')">Action</li>
                  <li class="dropdown-item" role="presentation" @click="resetProtocol('Enquiry')">Enquiry</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div class="container-fluid">
        <ul class="nav nav-tabs mt-3" id="main-tabs" role="tablist">
          <li class="nav-item" role="presentation">
            <button :class="'nav-link disabled'" :id="'main-compose'" data-bs-toggle="tab"
              :data-bs-target="'#main-content-compose'" type="button" role="tab" :aria-controls="'main-content-compose'">
              Compose
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button :class="'nav-link active' + (!protocol || !protocol.isValid() ? ' disabled' : '')" :id="'main-review'"
              data-bs-toggle="tab" :data-bs-target="'#main-content-review'" type="button" role="tab"
              :aria-controls="'main-content-review'">
              Review
            </button>
          </li>
        </ul>
        <div class="tab-content mt-3">
          <div :id="'main-content-compose'" :class="'tab-pane '" role="tabpanel" :aria-labelledby="'main-content-compose'"
            tabindex="0">
            <!-- <p-compose :protocol="protocol" :selectedtask="selectedtask" @change-protocol="updateProtocol" -->
            <!-- @select-task="updateSelectedTask" /> -->
          </div>
          <div :id="'main-content-review'" :class="'tab-pane active'" role="tabpanel"
            :aria-labelledby="'main-content-review'" tabindex="0">
            <pc-review :protocol="protocol" :debug="true" :initialData="startData" :template="
              protocol && protocol.meta && protocol.meta.enact && protocol.meta.enact.template
                ? protocol.meta.enact.template
                : 'compact'
            " />
          </div>
        </div>
        <!-- === Debug === -->
        <hr style="border-width: 10px" />
        <DebugApp />
      </div>
    </main>
  </div>
</template>

<style>
.clickable {
  cursor: pointer;
}
</style>
