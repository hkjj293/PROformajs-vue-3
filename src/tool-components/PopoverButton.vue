<script>
import { Popover } from 'bootstrap'

export default {
  name: 'PopoverButton',
  emits: ['shown', 'show', 'click'],
  props: {
    content: {
      type: String,
      required: true
    },
    /**
     * The id of target element.
     */
    target: {
      type: String,
      default: null
    },
    variant: {
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
    title: {
      type: String
    }
  },
  computed: {
    classes() {
      return 'btn' + ' btn-' + this.variant
    }
  },
  data() {
    return { popover: null, renderedContent: this.content }
  },
  mounted() {
    this.onClick.bind(this)
    this.popover = new Popover(this.$el, { sanitize: false })
    if (this.renderedContent || (this.target && document.getElementById(this.target))) {
      this.renderedContent = document.getElementById(this.target)
      this.renderedContent.parentElement.removeChild(this.renderedContent)
    }
    let content = {
      '.popover-body': this.renderedContent,
      '.popover-header': this.title ? this.title : null
    }
    this.popover.setContent(content)
    if (this.target) {
      document.addEventListener('click', this.onClick)
    }
    this.$el.addEventListener('shown.bs.popover', this.onShown)
    this.$el.addEventListener('show.bs.popover', this.onShow)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.onClick)
  },
  methods: {
    onShown() {
      this.$emit('shown')
    },
    onShow() {
      this.$emit('show')
    },
    onClick: function (event) {
      if (
        this.target &&
        this.popover.tip &&
        !document.getElementById(this.popover.tip.id).contains(event.target)
      ) {
        this.popover.hide()
      } else {
        this.$emit('click', event)
      }
    }
  }
}
</script>

<template>
  <button type="button" :class="classes" data-bs-container="body" :data-bs-trigger="trigger" data-bs-toggle="popover"
    :data-bs-placement="placement" :data-bs-html="html" :data-bs-title="title ? title : null"
    :data-bs-content="renderedContent">
    <slot />
  </button>
</template>

<style>
p {
  margin: 0px;
  padding: 0px;
}
</style>
