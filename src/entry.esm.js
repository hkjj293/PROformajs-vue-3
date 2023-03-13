// Import vue components
import * as components from '@/lib-components/index';

// hammerjs used for doubletap and (todo: gestures) on the ipad
//import { VueHammer } from 'vue2-hammer'

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
library.add(faFileDownload, faEdit, faAsterisk, faInfoCircle, faEraser, faList, faCalendarAlt, faCheck, faTimes, faPlusCircle, faMinusCircle, faRedoAlt, faExclamationTriangle, faDirections, faTable, faHandPointer, faHistory, faClipboardCheck, faCog)

// install function executed by Vue.use()
const install = function installProformajsVue(app) {
  Object.entries(components).forEach(([componentName, component]) => {
    // next line altered from the standard sfc-init to respect component name
    app.component(component.name || componentName, component);

    //Vue.use(VueHammer)

    Vue.component('font-awesome-icon', FontAwesomeIcon)
    // v-focus directive on dynamic inputs, see https://vuejs.org/v2/guide/custom-directive.html
    app.directive('focus', {
      inserted: function (el) {
        Vue.nextTick(function () {
          el.focus()
        })
      }
    })
  });
};

// Create module definition for Vue.use()
export default install;

// To allow individual component use, export components
// each can be registered via Vue.component()
export * from '@/lib-components/index';
