<script>
import { Protocol } from '@openclinical/proformajs';

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

export default {
  name: 'ServeDev',
  data: function () {
    return {
      selectedtask: template.name, // initial value,
      tab: "compose",
      protocol: new Protocol.Plan(template),
      initialData: {}
    };
  },
  created: function () {
    // initial data can be passed in the querystring
    // see https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
    const urlParams = new URLSearchParams(window.location.search);
    for (let entry of urlParams.entries()) {
      this.initialData[entry[0]] = JSON.parse(entry[1]);
    }
  },
  computed: {
    startData() {
      let result = {};
      if (this.initialData && Object.keys(this.initialData).length > 0) {
        result[this.protocol.name] = this.initialData;
      }
      return result;
    }
  },
  methods: {
    updateProtocol(e) {
      this.protocol = e.value;
      if (e.selected) {
        this.selectedtask = e.selected;
      }
    },
    resetProtocol(clazz) {
      if (clazz && ["Action", "Decision", "Enquiry"].indexOf(clazz) > -1) {
        let proto = new Protocol[clazz]({ name: clazz.toLowerCase(), caption: clazz, meta: { svg: { width: 400, height: 200 }, pos: { x: 190, y: 100 } } });
        this.protocol = proto;
        this.selectedtask = clazz.toLowerCase();
      } else {
        this.protocol = new Protocol.Plan(template);
        this.selectedtask = template.name;
      }
    },
    updateSelectedTask(evt) {
      this.selectedtask = evt.value;
    },
  },
};
</script>

<template>
  <div id="app">
    <main role="main">
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container-fluid">
          <div class="navbar-brand">PRO<em>formajs</em></div>
          <button type="button" aria-label="Toggle navigation" class="navbar-toggler collapsed" aria-expanded="false"
            aria-controls="nav_collapse" style="overflow-anchor: none;"><span class="navbar-toggler-icon"></span></button>
          <div id="nav_collapse" class="navbar-collapse collapse" style="display: none;">
            <ul class="navbar-nav ml-auto">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Reset
              </a>
              <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-right">
                <li role="presentation" @click="resetProtocol">Plan</li>
                <li role="presentation" @click="resetProtocol('Decision')">Decision</li>
                <li role="presentation" @click="resetProtocol('Action')">Action</li>
                <li role="presentation" @click="resetProtocol('Enquiry')">Enquiry</li>
              </ul>
            </ul>
          </div>
        </div>
      </nav>
      <!-- <div class="container-fluid"> -->
      <!-- <b-tabs content-class="mt-3" class="mt-3"> -->
      <!-- <b-tab title="Compose" active> -->
      <!-- <p-compose :protocol="protocol" :selectedtask="selectedtask" @change-protocol="updateProtocol" -->
      <!-- @select-task="updateSelectedTask" /> -->
      <!-- </b-tab> -->
      <!-- <b-tab title="Review" :disabled="!protocol || !protocol.isValid()"> -->
      <pc-review :protocol="protocol" :debug="true" :initialData="startData"
        :template="protocol && protocol.meta && protocol.meta.enact && protocol.meta.enact.template ? protocol.meta.enact.template : 'compact'" />
      <!-- </b-tab> -->
      <!-- </b-tabs> -->
      <!-- </div> -->
    </main>
  </div>
</template>

<style>
.clickable {
  cursor: pointer;
}
</style>
