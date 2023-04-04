<docs>
Provides an svg element that can be used to visualise a PROformajs protocol as a map and:

* view sub-plans and navigate through the sub-plan hierarchy (double click on a plan)
* edit the positioning of tasks on the map (drag the task caption)
* add new tasks to a plan or sub-plan (drag tasks from the side menu)
* add/remove scheduling dependencies between tasks (drag dependencies from tasks, press delete to remove selected dependency)
* remove task from protocol (press delete to remove selected task)

# props

* protocol - a PROformajs protocol
* selectedtask - path of the currently selected task

# events

* change-protocol - signal change to protocol, pass updated protocol in event
* select-task - signal selected task has changed, pass new path in event
* delete-task - indicates desire to delete this task
</docs>

<template>
  <div>
    <svg ref="svg" width="100%" tabindex="0" :viewBox="viewbox" @mousedown="startDrag" @touchstart="startDrag"
      @mousemove="drag" @touchmove="drag" @mouseup="endDrag" @mouseleave="endDrag" @touchend="endDrag"
      @touchleave="endDrag" @touchcancel="endDrag" @focus="handleFocus" @blur="handleBlur">
      <template v-if="plan.tasks">
        <pm-taskbar :height="protocol.meta.svg.height" :width="taskbar.width" :layout="taskbar.layout"
          :stroke_width="stroke_width" />
        <pm-breadcrumb :plan="plan" :height="breadcrumb.height" :width="protocol.meta.svg.width" :offset="taskbar.width"
          @select-task="updatePlan" :selected="selectedplan === selectedtask" :issues="subIssues(selectedplan)" />
        <pc-maptask v-for="task in plan.tasks" :key="task.path()" :task="task" :x="task.meta.pos.x + taskbar.width"
          :y="task.meta.pos.y + breadcrumb.height" :stroke_width="stroke_width"
          :selected="selectedplan + ':' + task.name === selectedtask" :data-path="task.path()"
          :data-fromx="ports[task.name].from.x" :data-fromy="ports[task.name].from.y" @delete-task="handleDeleteTask"
          @select-plan="updatePlan" :issues="subIssues(task.path())" />
        <pm-arrow v-for="dep in deps" :key="dep.target.name + '-' + dep.source.name" :tx="dep.target.x" :ty="dep.target.y"
          :sx="dep.source.x" :sy="dep.source.y" :source="dep.source.name" :target="dep.target.name"
          @delete-arrow="handleDeleteArrow" :selected="arrowSelected(dep)" />
      </template>
      <pc-maptask v-else :task="plan" :x="taskPos(protocol).x" :y="taskPos(protocol).y" :stroke_width="stroke_width"
        :selected="true" :no_handle="true" :data-path="plan.path()" :data-fromx="20 + (protocol.meta.svg.width / 2)"
        :data-fromy="protocol.meta.svg.height" @delete-task="handleDeleteTask" :issues="subIssues(plan.path())" />
    </svg>
  </div>
</template>

<script>
import ComposeMapTask from './ComposeMapTask.vue';
import MapArrow from '../Core/MapArrow.vue';
import MapBreadcrumb from '../Core/MapBreadcrumb.vue';
import MapTaskBar from './MapTaskBar.vue';
import { TemporalConstraintMixin } from '../Core/compose.js';
import { Protocol } from '@openclinical/proformajs';
//import Vue from 'vue';

let selectedElement, offset, transform; // used in dragging tasks
let arrowElement; // used in connecting tasks

export default {
  name: 'pc-map',
  mixins: [TemporalConstraintMixin],
  props: {
    protocol: Object,
    selectedtask: String,
    issues: Array
  },
  data: function () {
    return {
      selectedplan: this.protocol.name, // default value which will change via interaction with map or breadcrumb
      selectedarrow: null,
      stroke_width: 8,
      taskbar: {
        width: 80,
        layout: {
          //          Task: {x: 15, y: 25},
          Action: { x: 17, y: 25 },
          Enquiry: { x: 15, y: 100 },
          Decision: { x: 15, y: 175 },
          Plan: { x: 10, y: 250 },
          //          Action: {x: 17, y: 325}
        }
      },
      breadcrumb: {
        height: 30
      }
    }
  },
  components: {
    'pc-maptask': ComposeMapTask,
    'pm-breadcrumb': MapBreadcrumb,
    'pm-taskbar': MapTaskBar,
    'pm-arrow': MapArrow
  },
  computed: {
    plan() {
      let plan;
      try {
        plan = this.protocol.getComponent(this.selectedplan);
      } catch (e) {
        this.selectedplan = this.protocol.name;
        plan = this.protocol;
      }
      return plan;
    },
    viewbox() {
      return "0 0 " + (this.protocol.meta.svg.width + this.taskbar.width) + " " + (this.protocol.meta.svg.height + this.breadcrumb.height);
    },
    ports() {
      let result = {};
      if (this.plan && this.plan.tasks) {
        for (let task of this.plan.tasks) {
          result[task.name] = { to: { x: task.meta.pos.x + this.taskbar.width, y: task.meta.pos.y + this.breadcrumb.height } };
          result[task.name].from = { x: task.meta.pos.x + this.taskbar.width + 40, y: task.meta.pos.y + this.breadcrumb.height };
          // small adjustments
          if (task.constructor.name == "Plan") {
            result[task.name].from.x = task.meta.pos.x + this.taskbar.width + 50;
          } else if (task.constructor.name == "Task") {
            result[task.name].to.x = task.meta.pos.x + this.taskbar.width + this.stroke_width / 2;
            result[task.name].from.x = task.meta.pos.x + this.taskbar.width + 40 - this.stroke_width / 2;
          } else if (task.constructor.name == "Action") {
            result[task.name].from.x = task.meta.pos.x + this.taskbar.width + 36;
          }
        }
      }
      return result;
    },
    deps() {
      // returns array of arrows that need to be drawn
      let result = [];
      for (let task of this.plan.tasks) {
        for (let dep of this.getTemporalDeps(task)) {
          if (this.ports[dep]) {
            let arrow = { source: this.ports[dep].from, target: this.ports[task.name].to };
            arrow.source.name = dep;
            arrow.target.name = task.name;
            result.push(arrow);
          } else {
            console.log('unknown dep:', dep)
          }
        }
      }
      return result;
    }
  },
  methods: {
    updatePlan(e) {
      this.selectedplan = e.value;
      selectedElement = null; // Note that using v-hammer:tap means that endDrag isnt set which moves the double tapped plan without this line
      this.$emit('select-task', { value: e.value });
    },
    task(taskpath) {
      return this.protocol.getComponent(taskpath);
    },
    // see https://stackoverflow.com/questions/6747848/attaching-keyboard-events-to-an-svg-element-inside-html
    // and https://stackoverflow.com/questions/46078968/onfocus-not-working-triggering-in-firefox
    // for next three functions
    handleFocus(evt) {
      evt.target.addEventListener('keyup', this.handleKey);
    },
    handleBlur(evt) {
      evt.target.removeEventListener('keyup', this.handleKey);
    },
    handleKey(evt) {
      if (evt.key == "Delete") {
        if (this.selectedarrow) {
          this.removeAntecedent(this.plan.path(), this.selectedarrow.source, this.selectedarrow.target);
          this.$emit('change-protocol', { value: this.protocol, emitter: 'pc-map.0' });
        } else if (this.selectedtask) {
          this.$emit('delete-task', { value: this.selectedtask });
        }
      }
    },
    deleteTask(evt) {
      let selected = this.task(this.selectedtask);
      // remove downstream tasks
      for (let task of this.plan.tasks) {
        if (task.name != selected.name) {
          let deps = this.getTemporalDeps(task);
          if (deps.indexOf(selected.name) > -1) {
            this.removeAntecedent(this.plan.path(), selected.name, task.name);
          }
        }
      }
      // remove upstream tasks
      for (let dep of this.getTemporalDeps(selected)) {
        this.removeAntecedent(this.plan.path(), dep, selected.name);
      }
      // delete task
      this.plan.tasks.splice(this.plan.tasks.indexOf(selected), 1);
      this.$emit('change-protocol', { value: this.protocol, emitter: 'pc-map.1' });
    },
    handleDeleteTask(evt) {
      this.$emit('delete-task', evt);
    },
    handleDeleteArrow(evt) {
      this.removeAntecedent(this.selectedplan, evt.source, evt.target);
    },
    arrowSelected(dep) {
      if (this.selectedarrow) {
        return this.selectedarrow.target == dep.target.name && this.selectedarrow.source == dep.source.name;
      } else {
        return false;
      }
    },
    // task dragging
    // see http://www.petercollingridge.co.uk/tutorials/svg/interactive/dragging/  (pdf copy in /etc)
    // and https://github.com/petercollingridge/code-for-blog/blob/master/svg-interaction/draggable/draggable_groups.svg
    startDrag(evt) {
      // assumes the mousable elements are children of a draggable g element
      // and that the g elements are not mousable
      // and that all children need to be dragged at once
      if (evt.target.parentNode && evt.target.parentNode.classList.contains('draggable')) {
        this.selectedarrow = null; // unselect arrow if necessary
        if (evt.target.classList.contains('grabbable')) {
          // dragging the task by the caption
          selectedElement = evt.target.parentNode;
          if (!selectedElement.dataset.path) {
            // we're dragging one of the taskbar template tasks so clone it
            let clone = selectedElement.cloneNode(true);
            selectedElement.parentNode.appendChild(clone);
          }
          offset = this.getMousePosition(evt);
          let transforms = selectedElement.transform.baseVal;
          if (transforms.numberOfItems === 0 || transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {
            // Create an transform that translates by (0, 0)
            var translate = this.$refs.svg.createSVGTransform();
            translate.setTranslate(0, 0);
            selectedElement.transform.baseVal.insertItemBefore(translate, 0);
          }
          // Get initial translation
          transform = transforms.getItem(0);
          if (selectedElement.dataset.path) {
            let comp = this.protocol.getComponent(selectedElement.dataset.path);
            offset.x -= comp.meta.pos.x - transform.matrix.e;
            offset.y -= comp.meta.pos.y - transform.matrix.f;
          } else {
            offset.x -= transform.matrix.e;
            offset.y -= transform.matrix.f;
          }
        } else {
          // creating a new schedule constraint arrow
          let sourceElement = evt.target.parentNode;
          if (sourceElement.dataset.path) {
            offset = this.getMousePosition(evt);
            let source = sourceElement.dataset.path.split(":").pop()
            //let ArrowClass = Vue.extend(MapArrow);
            arrowElement = new MapArrow({
              propsData: { sx: this.ports[source].from.x, sy: this.ports[source].from.y, tx: offset.x, ty: offset.y, source: source }
            });
            arrowElement.$mount()
            this.$refs.svg.appendChild(arrowElement.$el)
          } else {
            arrowElement = null;
          }
        }
      } else if (evt.target.parentNode && evt.target.parentNode.classList.contains('arrow')) {
        this.selectedarrow = { source: evt.target.parentNode.dataset.source, target: evt.target.parentNode.dataset.target };
      } else {
        // unselect arrow
        this.selectedarrow = null;
      }
    },
    drag(evt) {
      if (selectedElement) {
        evt.preventDefault();
        var coord = this.getMousePosition(evt);
        if (selectedElement.dataset.path) {
          // move element by updating meta coords in underlying model
          let comp = this.protocol.getComponent(selectedElement.dataset.path);
          comp.meta.pos.x = coord.x - offset.x;
          comp.meta.pos.y = coord.y - offset.y;
          this.$emit('change-protocol', { value: this.protocol, emitter: 'pc-map.2' });
        } else {
          // move element by updating position on svg canvas
          transform.setTranslate(coord.x - offset.x, coord.y - offset.y);
        }
      } else if (arrowElement) {
        evt.preventDefault();
        var coord = this.getMousePosition(evt);
        arrowElement.tx = coord.x;
        arrowElement.ty = coord.y;
      }
    },
    endDrag(evt) {
      // convert int to text in the manner of excel column headings
      // i.e. [1,26,27,69].map((num)=>bijectiveBase26(num)) = ['A','Z','AA', 'BQ']
      // see https://stackoverflow.com/questions/8603480/how-to-create-a-function-that-converts-a-number-to-a-bijective-hexavigesimal
      function bijectiveBase26(int) {
        const sequence = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const length = sequence.length;

        if (int <= 0) return int;
        if (int <= length) return sequence[int - 1];


        let index = (int % length) || length;
        let result = [sequence[index - 1]];

        while ((int = Math.floor((int - 1) / length)) > 0) {
          index = (int % length) || length;
          result.push(sequence[index - 1]);
        }

        return result.reverse().join("")
      }
      function getUniqueName(clazz, plan, suff, idx) {
        // new name must be unique within plan
        const name = clazz.toLowerCase() + suff + (idx > -1 ? idx.toString() : '');
        if (plan.tasks.map((task) => task.name).indexOf(name) == -1) {
          return name;
        } else {
          return getUniqueName(clazz, plan, suff, ++idx);
        }
      }
      if (selectedElement) {
        if (!selectedElement.dataset.path) {
          // add task to plan
          let clazz = selectedElement.dataset.clazz;
          if (clazz) {
            let code = bijectiveBase26(this.protocol.allTasks().length);
            let name = getUniqueName(clazz, this.plan, code, -1);
            let caption = clazz + " " + code;
            let task = new Protocol[clazz]({ name: name, caption: caption, meta: { pos: {} } });
            if (clazz == 'Plan') {
              task.autonomous = true;
            }
            let coord = this.getMousePosition(evt);
            if ((coord.x - offset.x + this.taskbar.layout[clazz].x) > this.taskbar.width) {
              task.meta.pos.x = coord.x - offset.x + this.taskbar.layout[clazz].x - this.taskbar.width;
              task.meta.pos.y = coord.y - offset.y + this.taskbar.layout[clazz].y - this.breadcrumb.height;
              try {
                this.plan.addTask(task);
                this.$emit('change-protocol', { value: this.protocol, emitter: 'pc-map.3' });
                this.$emit('select-task', { value: task.path() });
              } catch (e) {
                // an error can occur here when there are two different instances of proformajs in the build
                console.log('error adding task', e);
              }
            }
            // drop the template node
            selectedElement.parentNode.removeChild(selectedElement);
          }
        } else {
          this.$emit('select-task', { value: selectedElement.dataset.path });
        }
      }
      selectedElement = null;
      if (arrowElement) {
        let coord = this.getMousePosition(evt);
        for (let task of this.plan.tasks) {
          if (task.name != arrowElement.source) {
            let p = this.ports[task.name];
            if ((coord.x >= p.to.x) && (coord.x <= p.from.x) && (coord.y >= (p.to.y - 20)) && (coord.y <= (p.to.y + 20))) {
              this.addAntecedent(this.plan.path(), arrowElement.source, task.name);
              this.$emit('change-protocol', { value: this.protocol, emitter: 'pc-map.4' });
            }
          }
        }
        this.$refs.svg.removeChild(arrowElement.$el);
      }
      arrowElement = null; // TODO remove element if its not landed
    },
    getMousePosition(evt) {
      let CTM = this.$refs.svg.getScreenCTM();
      if (evt.touches) { evt = evt.touches[0] || evt.changedTouches[0]; }
      return {
        x: (evt.clientX - CTM.e) / CTM.a,
        y: (evt.clientY - CTM.f) / CTM.d
      };
    },
    subIssues(path) {
      // returns issues associated with selected plan and its children
      return this.issues ? this.issues.filter((issue) => issue.path.startsWith(path)) : [];
    }
  },
  watch: {
    selectedtask(newpath, oldpath) {
      if (Math.abs(newpath.split(":").length - oldpath.split(":").length) > 1) {
        // a big jump suggests the need to change the selectedplan
        let task = this.protocol.getComponent(newpath);
        if (!task.tasks) {
          let tasks = newpath.split(":")
          tasks.pop()
          this.selectedplan = tasks.join(":")
        }
      }
    }
  }
}
</script>

<style scoped>
svg {
  font-size: 10pt;
}

svg:focus {
  outline: none;
}
</style>
