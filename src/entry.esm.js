//Import Vue nextTick
import { nextTick } from 'vue'

// Import vue components
import * as components from '@/lib-components/Core/index.js'

// fontawesome icons
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faEdit,
  faAsterisk,
  faInfoCircle,
  faEraser,
  faList,
  faCalendarAlt,
  faCheck,
  faTimes,
  faPlusCircle,
  faMinusCircle,
  faRedoAlt,
  faExclamationTriangle,
  faDirections,
  faTable,
  faHandPointer,
  faHistory,
  faClipboardCheck,
  faFileDownload,
  faCog
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(
  faFileDownload,
  faEdit,
  faAsterisk,
  faInfoCircle,
  faEraser,
  faList,
  faCalendarAlt,
  faCheck,
  faTimes,
  faPlusCircle,
  faMinusCircle,
  faRedoAlt,
  faExclamationTriangle,
  faDirections,
  faTable,
  faHandPointer,
  faHistory,
  faClipboardCheck,
  faCog
)

// install function executed by app.use()
const install = function installProformajsVue(app) {
  Object.entries(components).forEach(([componentName, component]) => {
    // next line altered from the standard sfc-init to respect component name
    app.component(component.name || componentName, component)

    app.component('font-awesome-icon', FontAwesomeIcon)
    // v-focus directive on dynamic inputs, see https://vuejs.org/v2/guide/custom-directive.html
    app.directive('focus', {
      inserted: function (el) {
        nextTick(function () {
          el.focus()
        })
      }
    })
  })
}

// Create module definition for app.use()
export default install

// To allow individual component use, export components
// each can be registered via app.component()
export * from '@/lib-components/Core/index.js'
