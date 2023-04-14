<docs>
Provides the means to review and edit a PROformajs component's boolean attribute with an html input checkbox field

# props

* att - attribute
* comp - component
* label - attribute label (optional - defaults to "de camel cased" name)
* description - input help text (optional)

# events

* change-attribute - signals the need to update the component's attribute value
</docs>

<template>
  <div class="form-check small">
    <input
      :id="att"
      class="form-check-input"
      type="checkbox"
      :disabled="disabled"
      :checked="comp[att]"
      @change="$emit('change-attribute', { name: att, value: $event.target.checked })"
      :value="true"
    />
    <label class="form-check-label" :for="att">
      {{ labelValue }}
    </label>
  </div>
</template>

<script>
import { AttributeMixin } from '../Core/attribute.js'

export default {
  mixins: [AttributeMixin],
  emits: ['change-attribute']
}
</script>
