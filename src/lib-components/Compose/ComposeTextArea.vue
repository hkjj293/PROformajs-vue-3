<docs>
Provides the means to review and edit a PROformajs component's attribute with an html textarea field

# props

* att - attribute
* comp - component
* label - attribute label (optional - defaults to "de camel cased" name)
* rows - number of rows (optional - defaults to 6)
* description - input help text (optional)

# events

* change-attribute - signals the need to update the component's attribute value
</docs>

<template>
  <div>
    <label :for="att" class="col-form-label col-form-label-sm">{{ labelValue }}</label>
    <textarea class="form-control form-control-sm" :id="att" :rows="rowsValue" :value="comp[att]"
      @change="$emit('change-attribute', { name: att, value: $event.target.value })" :disabled="disabled" />
  </div>
</template>

<script>
import { AttributeMixin } from '../Core/attribute.js';

export default {
  mixins: [AttributeMixin],
  props: ['rows'],
  computed: {
    rowsValue: function () {
      return this.rows || 6;
    }
  }
}
</script>

<style scoped>
/* needed to distinguish values from placeholders in flatly bootswatch style */
textarea {
  color: black;
}
</style>
