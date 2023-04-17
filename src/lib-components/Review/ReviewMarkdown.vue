<docs>
Presents text as markdown with an extension that triggers can be raised with
links that look like: ``[trigger description](!trigger)``.

requested prop is used by ReviewSource to indicate that a source is requested
in particular circumstances.
</docs>

<template>
  <div v-html="html" @send-trigger="handleTrigger"></div>
</template>

<script>
import { marked } from 'marked'
import createDOMPurify from 'dompurify'

const purify = createDOMPurify()
purify.addHook('afterSanitizeAttributes', function (node) {
  // post process trigger links to fire the send-trigger event
  if (node && node.className && node.className.indexOf('pf-trigger') > -1) {
    const trigger = node.className.match(/js-[a-z0-9_]+/i)[0].substring(3)
    node.setAttribute(
      'onclick',
      'this.dispatchEvent(new CustomEvent("send-trigger", {bubbles: true, detail: "' +
      trigger +
      '"}))'
    )
  }
})

export default {
  name: 'pr-markdown',
  props: {
    text: String,
    requested: {
      type: Boolean,
      default: false
    }
  },
  emits: ['send-trigger'],
  computed: {
    html() {
      // make a custom renderer to handle trigger links (markdown urls which look like "!trigger")
      const renderer = new marked.Renderer()
      renderer.link = function (href, title, text) {
        if (href.startsWith('!')) {
          let trigger = href.substring(1)
          return "<u class='text-success clickable pf-trigger js-" + trigger + "'>" + text + '</u>'
        } else {
          return "<a href='" + href + "' alt='" + title + "'>" + text + '</a>'
        }
      }
      return purify.sanitize(
        marked(this.text + (this.requested ? '<span class="text-primary ml-2">*</span>' : ''), {
          gfm: true,
          renderer: renderer
        })
      )
    }
  },
  methods: {
    handleTrigger(evt) {
      this.$emit('send-trigger', evt.detail)
    }
  }
}
</script>
