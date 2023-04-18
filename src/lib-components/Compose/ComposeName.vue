<docs>
Provides the means to review and edit a PROformajs component's name.
Prevents a user from deleting a name which would break the underlying protocol.

# props

* comp - component

# events

* change-attribute - signals the need to update the component's attribute value
</docs>

<template>
  <div>
    <label for="name" class="col-form-label col-form-label-sm pt-0">Name</label>
    <input type="text" class="form-control form-control-sm" id="name" :value="comp['name']" @change="updateName"
      :disabled="disabled" />
  </div>
</template>

<script>
export default {
  props: ['comp', 'disabled'],
  emits: ['change-attribute'],
  methods: {
    updateName(evt) {
      let name = evt.target.value
      if (name.length == 0) {
        // undo erasing the name - names cannot be blank
        evt.srcElement.value = this.value
      } else {
        this.$emit('change-attribute', { name: 'name', value: name })
      }
    }
  }
}
</script>

<style scoped>
/* needed to distinguish values from placeholders in flatly bootswatch style */
input {
  color: black;
}
</style>
