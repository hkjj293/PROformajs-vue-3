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
      type: String,
      default: null
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
    },
    noTitle: {
      type: Boolean,
      default: false
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
    this.onClick.bind(this)
    this.popover = new Popover(this.$el, { sanitize: false })
    this.onShow()
    if (this.targetId) {
      document.addEventListener('click', this.onClick);
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
      if (this.targetId && document.getElementById(this.targetId)) {
        this.message = document.getElementById(this.targetId).innerHTML
      }
      let content = {
        '.popover-body': this.message,
        '.popover-header': this.title
      }
      if (this.noTitle) {
        content = {
          '.popover-body': this.message
        }
      }
      this.popover.setContent(content)
    },
    onClick: function (event) {
      if (this.targetId &&
        this.popover.tip &&
        !(document.getElementById(this.popover.tip.id).contains(event.target))) {
        this.popover.hide();
      }
    }
  }
}
</script>

<template>
  <button type="button" :class="classes" data-content-id="popover-27" :data-bs-container="container"
    :data-bs-trigger="trigger" data-bs-toggle="popover" :data-bs-placement="placement" :data-bs-html="html"
    :data-bs-title="noTitle ? ' ' : title" :data-bs-content="msg" @blur="onBlur">
    <slot />
  </button>
</template>

<style>
p {
  margin: 0px;
  padding: 0px;
}
</style>
