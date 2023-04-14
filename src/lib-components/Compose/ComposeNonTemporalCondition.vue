<docs>
Provides the means to review and edit the non-temporal clauses of a PROformajs
Task's postCondition or waitCondition whose expressions may consist of temporal
and non-temporal clauses, see compose.js.

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
    <label for="name" class="col-form-label col-sm-2 pt-0">{{ labelValue }}</label>
    <input
      :type="typeValue"
      class="form-control form-control-sm"
      v-bind:class="{
        'is-invalid': hasValue && valid === false,
        'is-valid': hasValue && valid === true
      }"
      :id="att"
      :value="nonTemporalClauses(comp[att])"
      @change="updateClauses(att, $event.target.value)"
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
import { TemporalConstraintMixin } from '../Core/compose.js'

export default {
  mixins: [AttributeMixin, TypeMixin, TemporalConstraintMixin],
  props: ['issues'],
  computed: {
    hasValue() {
      let nonTemporal = this.nonTemporalClauses(this.comp[this.att])
      return nonTemporal != null && nonTemporal.length > 0
    },
    valid() {
      if (this.hasValue) {
        return this.issues.length == 0
      } else {
        return null
      }
    },
    dynamicDescription() {
      return this.issues.filter((issue) => issue.type == 'Error').length == 0
        ? this.description
        : ''
    }
  },
  methods: {
    nonTemporalClauses(expr) {
      if (expr) {
        return this.getExpressions(expr).nonTemporal
      } else {
        return expr
      }
    },
    updateClauses(attribute, value) {
      let exprs = this.getExpressions(this.comp[this.att])
      if (exprs.temporal) {
        if (value.length > 0) {
          this.$emit('change-attribute', { name: this.att, value: exprs.temporal + ' && ' + value })
        } else {
          this.$emit('change-attribute', { name: this.att, value: exprs.temporal })
        }
      } else {
        this.$emit('change-attribute', { name: this.att, value: value })
      }
    }
  }
}
</script>
