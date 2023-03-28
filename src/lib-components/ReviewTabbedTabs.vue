<docs>
Provides a clickable, nestable row of task tabs for ReviewTabbed.

# props

* plan - a PROformajs enactment plan that provides the list of tasks
* selected - the path of the currently presented task

# events

* select-task - change the currently presented task

# notes

This component is separate to ReviewTabbed as you might have multiple rows of tabs for plans with sub-plans and sub-sub-plans and so on (hence its called a nestable set of task tabs).

Managing the active tab is slightly tricky as if you click a plan task tab you want one of the children or grandchildren (etc, at least theoretically) to be the task that is shown to the user.
</docs>

<template>
  <div>
    <ul class="nav nav-tabs"
      :id="'review-tabs-' + (this.plan && this.plan.name ? this.plan.name.replaceAll(':', '-') : 'no-name')"
      role="tablist">
      <li class="nav-item" role="presentation" v-for="(task, index) in tabs" :key="task.path">
        <button
          :class="'nav-link ' + (activeTab == task.path ? 'active ' : '') + (task.state != 'in_progress' ? 'disabled' : '')"
          :id="'tabs-' + task.path.replaceAll(':', '-')" data-bs-toggle="tab"
          :data-bs-target="'#tabs-content-' + task.path.replaceAll(':', '-')" type="button" role="tab"
          :aria-controls="'tabs-content-' + task.path.replaceAll(':', '-')" :aria-selected="activeTab == task.path"
          @click="$emit('select-task', { value: task.path })">
          {{ task.caption || task.name }}
        </button>
      </li>
    </ul>
    <div class="tab-content mt-3">
      <div v-for="(task, index) in tabs" :key="'content-' + task.path"
        :id="'tabs-content-' + task.path.replaceAll(':', '-')"
        :class="'tab-pane ' + (activeTab == task.path ? 'active ' : '')" role="tabpanel"
        :aria-labelledby="'tabs-content-' + task.path.replaceAll(':', '-')" tabindex="0">
        <pr-tabbed-tabs v-if="Object.keys(task).includes('tasks')" :plan="task" :selected="selected"
          @select-task="$emit('select-task', $event)" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'pr-tabbed-tabs',
  data: function () {
    return {
      activeTab: null // path of active tab task
    }
  },
  props: ['plan', 'selected'],
  computed: {
    tabs() {
      let result = [];
      let activated = false; // this need happen only once
      if (this.plan && this.plan.tasks) {
        for (const task of this.plan.tasks) {
          if (task.state == "dormant" || task.state == "in_progress") {
            result.push(task);
            if (this.selected && !activated) {
              if (task.path == this.selected) {
                this.activeTab = task.path;
                activated = true;
              }
              // selected task is a child of this task
              if (this.selected.length > task.path.length && this.selected.startsWith(task.path)) {
                this.activeTab = task.path;
                activated = true;
              }
              // this task is a child of the selected task
              if (task.path.length > this.selected.length && task.path.startsWith(this.selected)) {
                this.$emit('select-task', { value: task.path });
                activated = true;
              }
            }
          }
        }
      }
      return result;
    }
  }
}
</script>
