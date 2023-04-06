<docs>
Provides the means to review and edit a PROformajs data definition's attributes and children

# props

* protocol - a PROformajs Protocol
* path - the path to the component of interest

# events

* change-protocol - indicates need to update the protocol,
</docs>

<template>
  <div>
    <h4>Data Definition: {{ def.name }}</h4>
    <div class="mb-2">
      <button class="btn btn-outline-secondary btn-sm" @click="$emit('select-path', { value: '' })">
        &lt;&lt; {{ def._parent.constructor.name }}: {{ def._parent.name }}
      </button>
      <button class="btn btn-outline-secondary btn-sm" size="sm" v-if="numSiblings > 1"
        :disabled="defIdx = pc - data - tabs= 0" @click="prevDef">
        &lt; Prev
      </button>
      <button class="btn btn-outline-secondary btn-sm" size="sm" v-if="numSiblings > 1"
        :disabled="defIdx == (numSiblings - 1)" @click="nextDef">
        Next &gt;
      </button>
    </div>

    <ul class="nav nav-tabs"
      :id="'pc-arg-tabs-' + (this.plan && this.plan.name ? this.plan.name.replaceAll(':', '-') : 'no-name')"
      role="tablist">
      <li class="nav-item" role="presentation">
        <button :class="'nav-link ' + (tabIndex == 0 ? 'active' : '')" :id="'pc-data-tabs-details'" data-bs-toggle="tab"
          :data-bs-target="'#pc-data-tabs-details-p'" type="button" role="tab" :aria-controls="'pc-data-tabs-details-p'"
          :aria-selected="true">
          Details
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button :class="'nav-link ' + (tabIndex == 1 ? 'active' : '')" :id="'pc-data-tabs-value'" data-bs-toggle="tab"
          :data-bs-target="'#pc-data-tabs-value-p'" type="button" role="tab" :aria-controls="'pc-data-tabs-value-p'"
          :aria-selected="true">
          Value
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button :class="'nav-link ' + (tabIndex == 2 ? 'active' : '')" :id="'pc-data-tabs-range'" data-bs-toggle="tab"
          :data-bs-target="'#pc-data-tabs-range-p'" type="button" role="tab" :aria-controls="'pc-data-tabs-range-p'"
          :aria-selected="true">
          Range
        </button>
      </li>
    </ul>

    <b-tabs small v-model="tabIndex" content-class="mt-2">
      <b-tab title="Details" active>
        <form>
          <pc-name :comp="def" @change-attribute="updateAttribute" />
          <pc-input att="caption" :comp="def" @change-attribute="updateAttribute" />
          <pc-textarea att="description" :comp="def" @change-attribute="updateAttribute" />
          <b-form-group label="Data type" label-size="sm">
            <b-form-radio-group buttons id="dataDefinitionClass" name="dataDefinitionClass" size="sm"
              button-variant="outline-secondary" v-model="clazz"
              :options="['Boolean', 'Text', 'Integer', 'Float', 'Date']" />
          </b-form-group>
        </form>
      </b-tab>
      <b-tab title="Value">
        <form>
          <pc-checkbox att="multiValued" :comp="def" @change-attribute="updateAttribute" />
          <pc-input att="defaultValue" :comp="def" @change-attribute="updateAttribute" />
          <pc-condition att="valueCondition" :comp="def" :issues="attributeIssues('valueCondition')"
            @change-attribute="updateAttribute" :description="valueConditionExample" />
        </form>
      </b-tab>
      <b-tab title="Range">
        <template slot="title">
          Range
          <b-badge v-if="def.range && def.range.length > 0" pill variant="secondary">{{ def.range.length }}</b-badge>
        </template>
        <b-form-group class="ml-1 mb-2" v-if="!def.range || (def.range && def.range.length == 0)">
          <b-form-radio-group id="rangeAnnotated" size="sm" buttons button-variant="outline-secondary"
            v-model="rangeAnnotatedToggle" :options="[{ value: true, text: 'Annotated' }, { value: false, text: 'Raw' }]"
            name="rangeAnnotated" />
        </b-form-group>
        <table class="table table-sm mt-2">
          <tbody>
            <!-- view / edit / delete existing range values -->
            <tr v-for="(val, idx) in def.range" :key="idx">
              <template v-if="rangeAnnotated">
                <!-- edit annotated range value-->
                <template v-if="rangeEditIdx == idx">
                  <td>
                    <input type="text" class="form-control form-control-sm" id="editrangevalue" :value="val.value">
                  </td>
                  <td>
                    <input type="text" class="form-control form-control-sm" id="editrangecaption" :value="val.caption">
                  </td>
                  <td>
                    <b-btn variant="light" size="sm" @click="editRangeItem(idx, $event)">
                      <font-awesome-icon icon="edit" />
                    </b-btn>
                  </td>
                </template>
                <!--  view / delete annotated range value -->
                <template v-else>
                  <td class="clickable" @click="rangeEditIdx = idx">
                    {{ val.value }}
                  </td>
                  <td class="clickable" @click="rangeEditIdx = idx">
                    {{ val.caption }}
                  </td>
                  <td>
                    <b-btn variant="light" size="sm" @click="deleteRangeItem(idx)">
                      &times;
                    </b-btn>
                  </td>
                </template>
              </template>
              <td v-else>
                <!-- edit raw range value -->
                <template v-if="rangeEditIdx == idx">
                  <input type="text" class="form-control form-control-sm" id="editrangevalue" :value="val"
                    @blur="rangeEditIdx = -1" @change="editRangeItem(idx, $event)" v-focus>
                </template>
                <!--  view / delete raw range value -->
                <template v-else>
                  <span class="clickable" @click="rangeEditIdx = idx">{{ val }}</span>
                  <b-btn variant="light" size="sm" class="float-sm-right" @click="deleteRangeItem(idx)">
                    &times;
                  </b-btn>
                </template>
              </td>
            </tr>
            <!-- add new range value -->
            <tr v-show="rangeEditIdx == -1">
              <template v-if="rangeAnnotated">
                <td>
                  <input type="text" class="form-control form-control-sm" id="rangevalue" ref="rangeValue"
                    placeholder="Enter value">
                </td>
                <td>
                  <input type="text" class="form-control form-control-sm" id="rangecaption" ref="rangeCaption"
                    placeholder="Enter caption">
                </td>
                <td>
                  <b-btn variant="light" size="sm" @click="addRangeItem">
                    &plus;
                  </b-btn>
                </td>
              </template>
              <template v-else>
                <td>
                  <input type="text" class="form-control form-control-sm" id="rangevalue" ref="rangeValue"
                    @change="addRangeItem" placeholder="Enter range value">
                </td>
              </template>
            </tr>
          </tbody>
        </table>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import { Protocol } from '@openclinical/proformajs';
import ComposeName from './ComposeName.vue';
import ComposeInput from './ComposeInput.vue';
import ComposeTextArea from './ComposeTextArea.vue';
import ComposeCheckbox from './ComposeCheckbox.vue';
import ComposeCondition from './ComposeCondition.vue';

export default {
  props: {
    protocol: Object,
    path: String,
    issues: Array
  },
  components: {
    'pc-name': ComposeName,
    'pc-input': ComposeInput,
    'pc-textarea': ComposeTextArea,
    'pc-checkbox': ComposeCheckbox,
    'pc-condition': ComposeCondition
  },
  data() {
    return {
      tabIndex: 0,
      rangeAnnotatedToggle: false,
      rangeEditIdx: -1
    }
  },
  computed: {
    def() {
      let component;
      try {
        // an enquiry that defines a data definition and uses it for a source has
        // ambiguous paths so we cant just call getComponent(this.path) here
        let comps = this.path.split(":");
        let name = comps.pop();
        let parentPath = comps.join(":");
        let parentComponent = this.protocol.getComponent(parentPath);
        for (let child of parentComponent.dataDefinitions) {
          if (child.name == name) {
            component = child;
          }
        }
      } catch (e) {
        // this will happen if the name of the component is changed elsewhere, i.e. in the code editor
        component = this.protocol; // fall back to a safe component
        this.$emit('select-path', { value: '' }); // but get out of this editor
      }
      return component;
    },
    clazz: {
      get: function () {
        return this.def.constructor.name;
      },
      set: function (evt) {
        // Note that changing the class of a data definition may generate validation errors if it already has range values
        let newdef = new Protocol[evt](this.def);
        // without $set this next change wouldnt be visible to vue, see https://vuejs.org/v2/guide/list.html#Caveats
        this.$set(this.def._parent.dataDefinitions, this.defIdx, newdef);
        this.$emit('change-protocol', { value: this.protocol, emitter: 'pc-data.0' });
      }
    },
    defIdx() {
      return this.def._parent ? this.def._parent.dataDefinitions.indexOf(this.def) : -1;
    },
    numSiblings() {
      return this.def._parent ? this.def._parent.dataDefinitions.length : -1;
    },
    valueConditionExample() {
      return "e.g. \"is_known('dob') ? now().diff(dob, 'years') : undefined\"";
    },
    rangeAnnotated() {
      return this.def.range && this.def.range.length > 0 ? this.def.range[0].caption != null : this.rangeAnnotatedToggle;
    }
  },
  methods: {
    updateAttribute(evt) {
      // There is no setComponent method in a PROformajs protocol so we focus on attributes instead
      let comp = this.protocol.getComponent(this.path);
      if (evt.value == null || evt.value.length == 0) {
        comp[evt.name] = null;
      } else {
        comp[evt.name] = evt.value;
      }
      this.$emit('change-protocol', { value: this.protocol, emitter: 'pc-data.1' });
      // changing the name will change the path, so the path needs updating
      if (evt.name == "name") {
        this.$emit('select-path', { value: comp.path() });
      }
    },
    getValue(value) {
      if (this.clazz == 'Integer') {
        return parseInt(value);
      } else {
        return value;
      }
    },
    addRangeItem() {
      if (!this.def.range) {
        this.$set(this.def, 'range', []);
      }
      if (this.rangeAnnotated) {
        this.$set(this.def.range, this.def.range.length, { value: this.getValue(this.$refs.rangeValue.value.trim()), caption: this.$refs.rangeCaption.value.trim() });
        this.$refs.rangeCaption.value = null;
      } else {
        this.$set(this.def.range, this.def.range.length, this.getValue(this.$refs.rangeValue.value.trim()));
      }
      this.$refs.rangeValue.value = null;
      this.$refs.rangeValue.focus();
      this.$emit('change-protocol', { value: this.protocol, emitter: 'pc-data.2' });
    },
    editRangeItem(idx, evt) {
      if (this.rangeAnnotated) {
        // note strongly coupled to html strcuture above
        // because I was unable to use $refs as in addRangeItem,
        // perhaps because the ref'd element is dynamic
        let tr = evt.target;
        // you might click the button which is a grandchild
        // *or* the icon which is at least a great-grandchild element
        // so we just keep going till we find the tr element
        while (tr && tr.nodeName.toLowerCase() != "tr") {
          tr = tr.parentNode;
        };
        if (tr) {
          this.def.range[idx].value = this.getValue(tr.children[0].children[0].value); // td[0].input
          this.def.range[idx].caption = tr.children[1].children[0].value; // td[1].input
        }
      } else {
        this.def.range[idx] = this.getValue(evt.target.value);
      }
      this.$emit('change-protocol', { value: this.protocol, emitter: 'pc-data.3' });
      this.rangeEditIdx = -1;
    },
    deleteRangeItem(idx) {
      this.$delete(this.def.range, idx);
      if (this.def.range.length == 0) {
        this.$delete(this.def, 'range');
      }
      this.$emit('change-protocol', { value: this.protocol, emitter: 'pc-data.4' });
    },
    defRangeLength() {
      return this.def.range ? this.def.range.length : 0;
    },
    reset() {
      this.rangeAnnotatedToggle = this.def.range && this.def.range.length > 0 ? this.def.range[0].caption != null : false; // default to raw range setting
      this.rangeEditIdx = -1; // undo any range value editing
      this.tabIndex = 0; // show Details tab
    },
    attributeIssues(att) {
      return this.issues.filter((issue) => issue.attribute == att);
    },
    prevDef() {
      let prevPath = this.def._parent.dataDefinitions[this.defIdx - 1].path();
      this.$emit('select-path', { value: prevPath });
    },
    nextDef() {
      let nextPath = this.def._parent.dataDefinitions[this.defIdx + 1].path();
      this.$emit('select-path', { value: nextPath });
    }
  },
  watch: {
    path: function () {
      this.reset(); // if the path changes, reset the dialogues
    }
  }
}
</script>

<style scoped>
.clickable {
  cursor: pointer;
}
</style>
