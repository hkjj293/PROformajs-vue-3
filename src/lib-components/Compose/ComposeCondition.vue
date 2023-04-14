<docs>
Provides the means to review and edit a PROformajs component's condition attribute (i.e. an expression)

# props

* att - attribute
* comp - component
* label - attribute label (optional - defaults to "de camel cased" name)
* description - input help text (optional)

# events

* change-attribute - signals the need to update the component's attribute value
</docs>

<template>
  <div class="form-group">
    <label for="name" class="col-form-label col-form-label-sm pt-0">{{ labelValue }}</label>
    <input
      :type="typeValue"
      class="form-control form-control-sm"
      v-bind:class="{ 'is-invalid': valid === false, 'is-valid': valid === true }"
      :id="att"
      :value="comp[att]"
      @change="$emit('change-attribute', { name: att, value: $event.target.value })"
      :disabled="disabled"
    />
    <small v-if="description" id="passwordHelpBlock" class="form-text text-muted">{{
      dynamicDescription
    }}</small>
    <div class="invalid-feedback" v-if="issues">
      <ul class="list-unstyled mb-0">
        <li
          v-for="(issue, idx) in issues"
          :key="idx"
          v-bind:class="{
            'text-danger': issue.type == 'Error',
            'text-info': issue.type == 'Warning'
          }"
        >
          <font-awesome-icon
            :icon="issue.type == 'Warning' ? 'info-circle' : 'exclamation-triangle'"
          />
          {{ issue.msg }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { AttributeMixin, TypeMixin } from '../Core/attribute.js'
export default {
  mixins: [AttributeMixin, TypeMixin],
  props: ['issues'],
  computed: {
    valid() {
      if (this.comp[this.att] == null || this.comp[this.att].length == 0) {
        return null
      } else {
        return this.issues.length == 0
      }
    },
    feedbackId() {
      return this.att + '-feedback'
    },
    dynamicDescription() {
      return this.issues.filter((issue) => issue.type == 'Error').length == 0
        ? this.description
        : ''
    }
  }
}
</script>
