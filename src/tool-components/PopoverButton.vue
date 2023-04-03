<script>
import { Popover } from 'bootstrap'

export default {
  name: 'PopoverButton',
  emits: ['shown'],
  props: {
    msg: {
      type: String,
      required: true
    },
    targetId: {
      type: String
    },
    varient: {
      type: String,
      default: 'link'
    },
    html: {
      type: Boolean,
      default: true
    },
    placement: {
      type: String,
      default: 'top'
    },
    trigger: {
      type: String,
      default: 'hover'
    },
    container: {
      type: String,
      default: 'body'
    },
    title: {
      type: String,
      default: 'Title'
    }
  },
  computed: {
    classes() {
      return 'btn' + ' btn-' + this.varient
    }
  },
  data() {
    return { popover: null, message: this.msg }
  },
  mounted() {
    this.popover = new Popover(this.$el, { sanitize: false })
    if (this.targetId && document.getElementById(this.targetId)) {
      this.message = document.getElementById(this.targetId).innerHTML
    }
    this.popover.setContent({
      '.popover-body': this.message,
      '.popover-header': this.title
    })
    this.$el.addEventListener('shown.bs.popover', this.onShown)
    this.$el.addEventListener('show.bs.popover', this.onShow)
  },
  methods: {
    onShown(evt) {
      this.$emit('shown')
    },
    onShow(evt) {
      if (this.targetId && document.getElementById(this.targetId)) {
        this.message = document.getElementById(this.targetId).innerHTML
      }
      this.popover.setContent({
        '.popover-body': this.message,
        '.popover-header': this.title
      })
    }
  }
}
</script>

<template>
  <button
    type="button"
    :class="classes"
    data-content-id="popover-27"
    :data-bs-container="container"
    :data-bs-trigger="trigger"
    data-bs-toggle="popover"
    :data-bs-placement="placement"
    :data-bs-html="html"
    :data-bs-title="title"
    :data-bs-content="msg"
    @blur="onBlur"
  >
    <slot />
  </button>
</template>

<style>
p {
  margin: 0px;
  padding: 0px;
}
</style>
