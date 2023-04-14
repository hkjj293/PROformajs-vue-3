<docs>
Provides the means to review and edit a PROformajs protocol's json serialisation.

# props

* protocol - a PROformajs Protocol
* selectedtask - path of the currently selected task

# events

* change-protocol - indicates need to update the protocol, optionally with an update to the selectedtask path
</docs>

<template>
  <div v-if="protocol">
    <ace-editor ref="ace_editor" v-model:value="text" @init="initAce" lang="json" theme="clouds" style="height: 480px" />
    <div v-if="!jsonValid" class="text-warning"><font-awesome-icon icon="info-circle" /> JSON problem</div>
    <ul class="list-unstyled">
      <li v-for="(issue, idx) in allIssues" :key="idx"
        v-bind:class="{ 'text-danger': (issue.type == 'Error'), 'text-info': (issue.type == 'Warning') }">
        <font-awesome-icon :icon="issue.type == 'Warning' ? 'info-circle' : 'exclamation-triangle'" />
        <span class="clickable text-primary" @click="selectTask(issue.path)">{{ issue.path }}:</span> {{ issue.msg }}<span
          v-if="issue.attribute && issue.msg.indexOf(issue.attribute) == -1"> ({{ issue.attribute }})</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { VAceEditor as AceEditor } from 'vue3-ace-editor';
import 'ace-builds/src-noconflict/mode-json'; // set ace-editor mode
import 'ace-builds/src-noconflict/theme-clouds'; // set ace-editor theme
import 'ace-builds/src-noconflict/ext-searchbox';// enable search functionality in ace editor

import { Protocol } from '@openclinical/proformajs';

export default {
  name: 'pc-code',
  props: ['protocol', 'selectedtask'],
  components: {
    'ace-editor': AceEditor
  },
  emits: ['change-protocol', 'select-task'],
  data: function () {
    return {
      jsonValid: true,
      isFocussed: false
    };
  },
  computed: {
    text: {
      // JSON text for atom editor
      get: function () {
        // attempt to keep code view up to date after deep changes even when hidden
        // see https://github.com/chairuosen/vue2-ace-editor/issues/59
        if (this.$refs.ace_editor) {
          this.$refs.ace_editor._editor.renderer.updateFull()
        }
        return JSON.stringify(this.protocol, null, 2);
      },
      set: function (text) {
        if (text.length > 0) {
          let json;
          try {
            if (text !== this.text) {
              json = JSON.parse(text);
              this.jsonValid = true;
              let plan = new Protocol[json.class](json);
              this.$emit('change-protocol', { value: plan, emitter: 'pc-code' });
            }
          } catch (e) {
            // this exception probably caused by hand editing the JSON
            // TODO: disable visual editor until protocol can be successfully generated from editor text
            this.jsonValid = false;
          }
        }
      }
    },
    allIssues() {
      return this.jsonValid ? this.protocol.validate() : [];
    },
    protocolValid() {
      return this.protocol.isValid();
    }
  },
  methods: {
    focusSelected() {
      if (this.selectedtask) {
        const name = this.selectedtask.split(":").pop();
        this.$refs.ace_editor._editor.find("\"name\": \"" + name + "\"", {}, true);
      } else {
        this.$refs.ace_editor._editor.gotoLine(0);
      }
    },
    initAce: function (editor) {
      this._editor = editor;
      editor.setOptions({
        tabSize: 2
      });
      editor.on('focus', () => this.isFocussed = true);
      editor.on('blur', () => this.isFocussed = false);
    },
    selectTask(path) {
      function parentTask(comp) {
        if (comp instanceof Protocol.Task) {
          return comp;
        } else {
          if (comp._parent) {
            return parentTask(comp._parent);
          }
        }
      }
      const task = parentTask(this.protocol.getComponent(path)).path();
      this.$emit('select-task', { value: task });
    }
  },
  watch: {
    selectedtask(newpath) {
      if (newpath && !this.isFocussed) {
        const name = newpath.split(":").pop();
        this.$refs.ace_editor._editor.find("\"name\": \"" + name + "\"", {});
      }
    }
  }
}
</script>
