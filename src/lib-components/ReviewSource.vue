<docs>
Draws a source input, providing UI for user data entry to enactment state.

# props

* source
* disabled
* value
* suffix

# events

* update-source
* erase-source

# notes

Just about works.  Current coverage shown below.

| class    | single | single (ranged) | multi | multi (ranged) |
|----------|--------|-----------------|-------|----------------|
| Integer  |    Y   |         Y       |   Y   |        Y       |
| Text     |    Y   |         Y       |   Y   |        Y       |
| Float    |    Y   |         Y       |   Y   |        Y       |
| Boolean  |    Y   |         Y       |   N   |        N       |
| Date     |    Y   |         N       |   N   |        N       |

* Would be good to be simplified, which may be necessary in order to provide data updating functionality elsewhere
* value included as prop because of reactivity woes but it shouldnt be necessary.
* Boolean data items lookout for the the sources.useButtons metaprop from the parent task
* Text data items with a range lookout for a source.useDatalist metaprop
</docs>

<template>
  <div>
    <!-- <b-form-group :disabled="disabled" :state="isValid" :invalid-feedback="feedback"> -->
    <form>
      <label :for="source.name + suffix" class="d-block form-label">
        <span v-if="!hideCaption || !source.description">{{ source.caption || source.name }}</span>

        <!-- If showDescriptionInline && source.description-->
        <template v-if="!showDescriptionInline && source.description">
          <!-- <b-button variant="link" size="sm" class="pb-1 pt-0 pr-0" :id="'source' + source.path"> -->
          <button type="button" class="btn btn-link btn-sm pb-1 pt-0 pr-0" :id="'source' + source.path">
            <font-awesome-icon icon="info-circle" />
          </button>
          <!-- <b-popover :target="'source' + source.path" triggers="hover" placement="top"> -->
          <div data-bs-toggle="popover" :data-bs-target="'source' + source.path">
            <pr-markdown :text="source.description" @send-trigger="$emit('send-trigger', $event)" class="markdown" />
          </div>
          <!-- </b-popover> -->
        </template>

        <!-- If source.requested && (!hideCaption || !source.description) -->
        <font-awesome-icon v-if="source.requested && (!hideCaption || !source.description)" icon="asterisk"
          class="text-primary align-top pl-2" />

        <!-- v-show="value != null && !hideEraser" -->
        <button class="btn btn-link btn-sm float-right py-0" v-show="value != null && !hideEraser"
          @click.stop="unsetSource">
          <font-awesome-icon icon="eraser" />
        </button>

        <!-- If showDescriptionInline && source.description -->
        <template v-if="showDescriptionInline && source.description">
          <pr-markdown :text="source.description" @send-trigger="$emit('send-trigger', $event)"
            class="text-muted markdown" :requested="hideCaption && source.description && source.requested" />
        </template>
      </label>
      <!-- End of Label -->

      <!-- If source.class == 'Boolean' -->
      <template v-if="source.class == 'Boolean'">
        <div v-if="useButtons" class="row">
          <div v-for="(item, idx) in source.range || [true, false]" :key="idx" class="col">
            <button class="btn btn-outline-dark btn-sm" :pressed="value != null && value == rangeValue(item)"
              @click="updateValue(rangeValue(item).toString())">
              {{ booleanSourceRangeText(item) }}
            </button>
          </div>
        </div>
        <div v-else v-for="(item, idx) in source.range || [true, false]" :key="idx" class="form-check">
          <input class="form-check-input" type="radio" :id="rangeId(item)" :value="rangeValue(item).toString()"
            :checked="value != null && value == rangeValue(item)" @change="handleRadioChange">
          <label class="form-check-label" :for="rangeId(item)">{{ booleanSourceRangeText(item) }}</label>
        </div>
      </template>
      <!-- Else -->
      <template v-else>
        <!-- single un-ranged -->
        <div class="input-group" v-if="!source.multiValued && !source.range">
          <input :name="source.name + suffix" class="form-control" type="text" :value="inputValue(value)"
            :placeholder="placeholder" @blur="handleBlur" @keyup.enter.prevent="handleBlur" @keyup.esc="clearInput" />
          <div class="input-group-text" slot="append" v-if="source.class == 'Date'">
            <font-awesome-icon icon="calendar-alt" />
          </div>
        </div>
        <!-- single range -->
        <template v-if="!source.multiValued && source.range">
          <div v-if="useButtons">
            <button class="btn btn-outline-dark btn-block btn-sm my-1" v-for="(item, idx) in source.range" :key="idx"
              :pressed="value == rangeValue(item)" @click="updateValue(rangeValue(item).toString())">
              {{ rangeText(item) }}
            </button>
          </div>
          <template v-else>
            <template v-if="useDatalist">
              <input :list="source.name + suffix + 'datalist'" :name="source.name + suffix" class="form-control"
                type="text" :value="inputValue(value)" :placeholder="placeholder" @blur="handleBlur"
                @keyup.enter.prevent="handleBlur" @keyup.esc="clearInput" />
              <datalist :id="source.name + suffix + 'datalist'">
                <option v-for="item in source.range">{{ rangeText(item) }}</option>
              </datalist>
            </template>
            <div v-else v-for="(item, idx) in source.range" :key="idx" class="form-check">
              <input class="form-check-input" type="radio" :name="rangeId(item)" :id="rangeId(item)"
                :value="rangeValue(item)" :checked="value == rangeValue(item)" @change="handleRadioChange" />
              <label class="form-check-label" :for="rangeId(item)">{{ rangeText(item) }}</label>
            </div>
          </template>
        </template>
        <!-- multi un-ranged -->
        <div class="list-group" v-if="source.multiValued && !source.range && value">
          <div class="list-group-item" v-for="(item, index) in value" :key="index">
            {{ item }}
            <button class="btn btn-outline-warning btn-sm float-right" @click="removeArrayItem(index)">&times;</button>
          </div>
        </div>
        <div class="input-group" v-if="source.multiValued && !source.range">
          <input class="form-control" :name="source.name + suffix" type="text" @blur="resetInput"
            @keyup.enter="handleMultiEnter" @keyup.esc="resetInput" />
          <div class="input-group-text" slot="append">
            <font-awesome-icon icon="list" />
          </div>
        </div>
        <!-- multi ranged -->
        <template v-if="source.multiValued && source.range">
          <div v-for="(item, idx) in source.range" class="form-check" :key="idx">
            <input class="form-check-input" type="checkbox" :name="rangeId(item)" :id="rangeId(item)"
              :value="rangeValue(item)" :checked="value && value.includes(rangeValue(item))"
              @change="handleCheckboxChange" />
            <label class="form-check-label" :for="rangeId(item)">{{ rangeText(item) }}</label>
          </div>
        </template>
      </template>
    </form>
    <!-- </b-form-group> -->
    <slot></slot>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  props: {
    source: Object,
    disabled: Boolean,
    value: [Array, Boolean, String, Number, Date, Object],
    suffix: String,
    showDescriptionInline: {
      type: Boolean,
      default: false
    },
    hideEraser: {
      type: Boolean,
      default: false
    },
    useButtons: {
      type: Boolean,
      default: false
    },
    hideCaption: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      isValid: true,
      feedback: '',
      localValue: null
    }
  },
  computed: {
    inlineDescription() {
      return this.showDescriptionInline ? this.source.description : '';
    },
    placeholder() {
      return this.source.class == 'Date' ? 'dd/mm/yyyy' : '';
    },
    useDatalist() {
      return this.source.meta && this.source.meta.ui && this.source.meta.ui.useDatalist;
    }
  },
  methods: {
    handleBlur(evt) {
      if (evt.target.value) {
        this.updateValue(evt.target.value);
      }
    },
    handleMultiEnter(evt) {
      if (evt.target.value != null) {
        let value = this.getValue(evt.target.value);
        let arr = this.value || [];
        arr.push(value);
        this.$emit("update-source", { action: 'set', source: this.source.name, value: arr });
        evt.target.value = '';
      }
    },
    clearInput(evt) {
      evt.target.value = this.value ? this.value : '';
    },
    resetInput(evt) {
      evt.target.value = '';
    },
    handleRadioChange(evt) {
      this.updateValue(evt.target.value);
    },
    handleCheckboxChange(evt) {
      let value = this.getValue(evt.target.value);
      let arr = this.value || [];
      if (evt.target.checked) {
        arr.push(value);
      } else {
        let idx = arr.indexOf(value);
        if (arr != -1) {
          arr.splice(arr.indexOf(value), 1);
        }
      }
      this.$emit("update-source", { action: 'set', source: this.source.name, value: arr });
    },
    updateValue(text) {
      let val = this.getValue(text);
      if (val != null && val != this.value) {
        this.$emit("update-source", { action: 'set', source: this.source.name, value: val });
      }
      return false;
    },
    removeArrayItem(index) {
      this.value.splice(index, 1);
      this.$emit("update-source", { action: 'set', source: this.source.name, value: this.value });
    },
    getValue(text) {
      let val;
      switch (this.source.class) {
        case "Integer":
          val = parseInt(text);
          if (!isNaN(val) && isFinite(val)) {
            this.isValid = true;
            return val;
          } else {
            this.isValid = false;
            this.feedback = "Must be a whole number";
            return null
          }
        case "Float":
          val = parseFloat(text);
          if (!isNaN(val) && isFinite(val)) {
            this.isValid = true;
            return val;
          } else {
            this.isValid = false;
            this.feedback = "Must be a number";
            return null
          }
        case "Date":
          val = new moment(text, 'DD/MM/YYYY');
          if (val.isValid()) {
            this.isValid = true;
            return val;
          } else {
            this.isValid = false;
            this.feedback = "A date must be of the form dd/mm/yyyy";
            return null
          }
        case "Boolean":
          return text == "true";
        case "Text":
          if (this.source.range) {
            if (this.source.range.indexOf(text) > -1) {
              this.isValid = true;
              return text;
            } else {
              this.isValid = false;
              this.feedback = "Not recognised from available choices";
              return null
            }
          } else {
            this.isValid = true;
            return text;
          }
        default:
          return text;
      }
    },
    inputValue(val) {
      switch (this.source.class) {
        case "Date":
          return val ? moment(val).format('DD/MM/YYYY') : '';
        default:
          return val;
      }
    },
    rangeValue(item) {
      return Object.keys(item).includes('value') ? item.value : item;
    },
    rangeText(item) {
      return Object.keys(item).includes('caption') ? item.caption : item;
    },
    booleanSourceRangeText(item) {
      return Object.keys(item).includes('caption') ? item.caption : (item ? "True" : "False");
    },
    rangeId(item) {
      return this.source.name + (Object.keys(item).includes('value') ? item.value : item) + this.suffix;
    },
    unsetSource() {
      this.$emit('erase-source', { action: 'unset', source: this.source.name });
    }
  }
}
</script>

<style scoped>
.markdown :last-child {
  margin-bottom: 0;
}
</style>
