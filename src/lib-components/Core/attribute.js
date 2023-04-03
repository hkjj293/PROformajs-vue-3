// some shared code for most of the Compose{Input}.vue components (though not ComposeName.vue)

export const AttributeMixin = {
  props: ['att', 'comp', 'label', 'description', 'disabled'],
  computed: {
    labelValue: function () {
      // return "de camel cased" name if label not provided
      // first clause adds space before each capital
      // second clause upper cases the first character
      return (
        this.label ||
        this.att.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
          return str.toUpperCase()
        })
      )
    }
  }
}

export const TypeMixin = {
  props: ['type'],
  computed: {
    typeValue: function () {
      return this.type || 'text'
    }
  }
}
