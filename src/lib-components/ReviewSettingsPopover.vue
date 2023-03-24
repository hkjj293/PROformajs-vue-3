<docs>
Provides a UI settings button that opens a popover form.

# props

* options - review settings
* debug - show debug option
* restart - show restart option
* placement - control placement of popover

# events

* change-option - signals an option change
* restart-enactment
</docs>

<template>
  <div>
    <PopoverButton :id="id" :msg="message" :placement="placement" variant="outline-secondary" trigger="click"
      :title="title" @show="OnShowPopover">
      <font-awesome-icon icon="cog" />
    </PopoverButton>
    <div :id="'target:' + id" hidden>
      <label v-if="debug"><input :name="'target:' + id + ':debug'" type="checkbox" />
        Debug expressions</label>
      <div class="font-weight-bold pb-2">Decisions</div>
      <label>
        <input :name="'target:' + id + ':Decision:showInactiveArguments'" type="checkbox" />
        Show inactive arguments
      </label>
      <label><input :name="'target:' + id + ':Decision:showExpressions'" type="checkbox" />
        Show expressions</label>
      <label><input :name="'target:' + id + ':Candidate:autoConfirmRecommended'" type="checkbox" />
        Auto-confirm candidates</label>
      <label><input :name="'target:' + id + ':Decision:allowDownloads'" type="checkbox" />
        Allow Downloads</label>
      <div class="font-weight-bold pb-2">Enquiries</div>
      <label><input :name="'target:' + id + ':Enquiry:useDefaults'" type="checkbox" />
        Use defaults</label>
      <button v-if="restart" class="btn btn-outline-secondary btn-sm" @click="sendRestart" block>
        <font-awesome-icon icon="redo-alt" /> Restart
      </button>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    options: Object,
    id: {
      type: String,
      default: 'task-settings'
    },
    debug: {
      type: Boolean,
      default: true
    },
    restart: {
      type: Boolean,
      default: true
    },
    placement: {
      type: String,
      default: 'left'
    }
  },
  emits: ['restart-enactment', 'close', 'change-option'],
  data() {
    return {
      message: "msg",
      title: "title",
      showPopover: "auto"
    }
  },
  mounted() {
    this.OnShowPopover()
  },
  methods: {
    sendRestart() {
      this.$emit('restart-enactment')
      this.$refs[this.id].$emit('close')
    },
    OnClickBox(evt) {
      const d = evt.target.name.split(':')
      const cat = d.length > 3 ? d[2] : ''
      const opts = d.length > 3 ? d[3] : d[2]
      if (d.length > 3) {
        this.$emit('change-option', {
          category: cat,
          option: opts,
          value: !this.options[cat][opts]
        })
      } else {
        this.$emit('change-option', {
          option: opts,
          value: !this.options[opts]
        })
      }
    },
    OnShowPopover() {
      this.message = document.getElementById('target:' + this.id).innerHTML
      this.title = "Review Settings"
      this.setOnClick('target:' + this.id + ':debug')
      this.setOnClick('target:' + this.id + ':Decision:showInactiveArguments')
      this.setOnClick('target:' + this.id + ':Decision:showExpressions')
      this.setOnClick('target:' + this.id + ':Candidate:autoConfirmRecommended')
      this.setOnClick('target:' + this.id + ':Decision:allowDownloads')
      this.setOnClick('target:' + this.id + ':Enquiry:useDefaults')
    },
    setOnClick(eleName) {
      const eles = document.getElementsByName(eleName)
      for (const ele of eles) {
        if (ele.parentElement.parentElement.getAttribute('hidden')) {
          continue
        }
        const d = eleName.split(':')
        const cat = d.length > 3 ? d[2] : ''
        const opts = d.length > 3 ? d[3] : d[2]
        ele.onclick = this.OnClickBox
        console.log(this.options)
        ele.checked = d.length > 3 ? this.options[cat][opts] : this.options[opts]
      }
    }

  }
}
</script>
