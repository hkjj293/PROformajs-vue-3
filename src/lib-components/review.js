import ReviewMap from './ReviewMap.vue';
import ReviewTask from './ReviewTask.vue';
import ReviewData from './ReviewDataBadges.vue';
import ReviewHistory from './ReviewHistoryAccordian.vue';
import ReviewSettings from './ReviewSettingsPopover.vue';
import ReviewMarkdown from './ReviewMarkdown.vue';

export const ReviewMixin = {
  props: ['enactment', 'options', 'debug'],
  data: function () {
    return {
      path: null // selected task
    }
  },
  components: {
    'pr-map': ReviewMap,
    'pr-task': ReviewTask,
    'pr-data': ReviewData,
    'pr-history': ReviewHistory,
    'pr-settings': ReviewSettings,
    'pr-markdown': ReviewMarkdown
  },
  computed: {
    availableTasks() {
      const order = (task) => {
        return task.meta && task.meta.ui && Object.keys(task.meta.ui).includes('order') ? task.meta.ui.order : 0;
      }
      const comp = (a, b) => {
        const taskA = this.enactment.getComponent(a.path);
        const taskB = this.enactment.getComponent(b.path);
        return order(taskA) - order(taskB);
      }
      return this.enactment.getTasks().filter(function (task) { return task.state == 'in_progress' && (task.class != 'Plan' || !task.autonomous); }).sort(comp);
    },
    status() {
      return this.enactment ? this.enactment.getStatus() : {};
    },
    activeTask() {
      return this.path ? this.enactment.getComponent(this.path) : this.availableTasks[0];
    }
  },
  methods: {
    updateEnactment(evt) {
      let enactment = this.enactment;
      let result = { action: evt.action, path: evt.path };
      let update = {}
      switch (evt.action) {
        case "complete":
          enactment.complete(evt.path);
          break;
        case "set":
          update[evt.source] = evt.value
          enactment.set(evt.path, update);
          result.source = { name: evt.source, value: evt.value };
          break;
        case "unset":
          enactment.unset(evt.path, evt.source);
          result.source = evt.source;
          break;
        case "confirm":
          enactment.confirm(evt.path);
          break;
        case "unconfirm":
          enactment.unconfirm(evt.path);
          break;
      }
      result.value = enactment;
      this.$emit('change-enactment', result);
    },
    accordianId(value) {
      return "accordian" + value;
    },
    getValues() {
      let data = this.enactment.getData();
      let result = [];
      for (let path in data) {
        for (let key in data[path]) {
          if (data[path][key] != null) {
            result.push({ key: key, value: data[path][key] });
          }
        }
      }
      return result;
    },
    updatePath(evt) {
      this.path = evt.value;
    },
    updateSource(evt) {
      evt.path = this.enactment.protocol.name; // assumes a particular shape of protocol
      this.updateEnactment(evt);
    },
    sendTrigger(trigger) {
      let enactment = this.enactment;
      enactment.sendTrigger(trigger);
      this.$emit('change-enactment', { value: enactment, action: 'trigger', trigger: trigger });
    }
  },
  watch: {
    enactment: function (val) {
      if (val) {
        let status = val.getStatus();
        let audit = val._audit;
        if (audit.length > 0) {
          let actions = Object.keys(audit[audit.length - 1].action);
          let tasks = this.availableTasks;
          if (!status.finished && (actions.includes("complete") || actions.includes("trigger"))) {
            // after a trigger is sent or a task completed, we need to select a new task
            if (tasks.length > 0) {
              this.path = tasks[tasks.length - 1].path;
            } else {
              this.path = null;
            }
          } else {
            let taskpaths = tasks.map(function (task) { return task.path });
            if (!taskpaths.includes(this.path)) {
              // handle an unexpected change of enactment
              if (this.availableTasks.length > 0) {
                this.path = this.availableTasks[0].path;
              } else {
                this.path = null;
              }
            }
          }
        }
      }
    }
  }
}
