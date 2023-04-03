export const IconMixin = {
  props: {
    scale: {
      type: Number,
      default: 1
    }
  },
  computed: {
    transform() {
      return this.scale !== 1 ? 'scale(' + this.scale + ', ' + this.scale + ')' : ''
    }
  }
}
