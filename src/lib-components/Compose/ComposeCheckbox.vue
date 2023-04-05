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
  <div class="col-sm-3">
    <div class="form-check">
      <input :id="att" class="form-check-input" type="checkbox" id="required" :disabled="disabled" :checked="comp[att]"
        @change="$emit('change-attribute', { name: att, value: $event })" inline>
      <label class="form-check-label" for="required">
        {{ labelValue }}
      </label>
    </div>
  </div>
</template>

<script>
import { AttributeMixin } from '../Core/attribute.js';

export default {
  mixins: [AttributeMixin]
}
</script>
