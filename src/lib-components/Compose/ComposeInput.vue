<docs>
Provides the means to review and edit a PROformajs component's text-valued attribute with an html input field

# props

* att - attribute
* comp - component
* label - attribute label (optional - defaults to "de camel cased" name)
* type - text/number (optional - defaults to 'text')
* description - input help text (optional)

# events

* change-attribute - signals the need to update the component's attribute value
</docs>

<template>
  <div>
    <label for="name" class="col-form-label col-form-label-sm pt-0">{{ labelValue }}</label>
    <input
      :type="typeValue"
      class="form-control form-control-sm"
      :id="att"
      :value="comp[att]"
      @change="$emit('change-attribute', { name: att, value: $event.target.value })"
      :disabled="disabled"
    />
    <small v-if="description" id="passwordHelpBlock" class="form-text text-muted">{{
      description
    }}</small>
  </div>
</template>

<script>
import { AttributeMixin, TypeMixin } from '../Core/attribute.js'
export default {
  mixins: [AttributeMixin, TypeMixin],
  emits: ['change-attribute']
}
</script>

<style scoped>
/* needed to distinguish values from placeholders in flatly bootswatch style */
input {
  color: black;
}
</style>
