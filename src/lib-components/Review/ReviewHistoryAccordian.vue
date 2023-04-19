<template>
  <div id="accordion">
    <div class="card mb-1" v-for="(event, index) in getHistory()" :key="index">
      <header class="card-header p-1" role="tab">
        <div class="d-grid gap-2">
          <button type="button" class="btn btn-link" data-bs-toggle="collapse" :data-bs-target="'#' + historyId(index)"
            aria-expanded="false" :aria-controls="historyId(index)">
            {{ event.heading }}
          </button>
        </div>
      </header>
      <div class="collapse" :id="historyId(index)" role="tabpanel" data-bs-parent="#accordion">
        <div class="card-body">
          <table class="table b-table table-striped table-sm">
            <thead role="rowgroup">
              <tr>
                <th v-for="(field, fieldIndex) in historyFields" :key="index + '-field-' + fieldIndex" scope="col">
                  {{ field.label ? field.label : field.charAt(0).toUpperCase() + field.slice(1) }}
                </th>
              </tr>
            </thead>
            <tbody class="table-group-divider" style="border-top-color: ">
              <tr v-for="(action, rowIndex) in event.actions" :key="index + '-rows-' + rowIndex" scope="row">
                <td v-for="(col, colIndex) in historyFields" :key="index + '-cols-' + colIndex" scope="col">
                  {{
                    col.formatter
                    ? col.formatter(action[col.key ? col.key : col])
                    : action[col.key ? col.key : col]
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  props: ['enactment'],
  data: function () {
    return {
      historyFields: [
        {
          key: 'when',
          label: 'When',
          formatter: (value) => {
            return moment(value).calendar()
          }
        },
        'caption'
      ]
    }
  },
  methods: {
    getHistory() {
      function getSummary(event) {
        let summary = {
          when: event.timestamp
        }
        if (event.action.complete) {
          summary.path = event.action.complete
          summary.caption = 'Completed'
        } else if (event.action == 'start') {
          summary.path = ''
          summary.caption = 'Started'
        } else if (event.action.set) {
          summary.path = event.action.set
          summary.caption = 'Set data :: ' + JSON.stringify(event.action.data)
        } else if (event.action.unset) {
          summary.path = event.action.unset
          summary.caption = 'Unset data :: ' + JSON.stringify(event.action.data)
        } else if (event.action.confirm) {
          let confirmed = event.action.confirm.split(':')
          let candidate = confirmed.pop()
          summary.path = confirmed.join(':')
          summary.caption = 'Confirmed ' + candidate
        } else if (event.action.unconfirm) {
          let unconfirmed = event.action.unconfirm.split(':')
          let candidate = unconfirmed.pop()
          summary.path = unconfirmed.join(':')
          summary.caption = 'Unconfirmed ' + candidate
        } else if (event.action.trigger) {
          summary.caption = 'Trigger sent :: ' + event.action.trigger
        } else {
          throw new Error('unknown audit event')
        }
        return summary
      }
      let result = []
      let path = null
      for (let event of this.enactment._audit) {
        let summary = getSummary(event)
        if (summary.path != path) {
          path = summary.path
          if (summary.path != null && summary.path != '') {
            let comp = this.enactment.getComponent(summary.path)
            let heading = comp.caption ? comp.caption : comp.name
            result.push({ heading: heading, actions: [] })
          } else {
            // summary.path = "" for "Started"
            result.push({ heading: summary.caption, actions: [] })
          }
        }
        result[result.length - 1].actions.push({ when: summary.when, caption: summary.caption })
      }
      return result
    },
    historyId(index) {
      return 'history' + index
    }
  }
}
</script>

<style scoped>
.card-body {
  padding: 1.25rem;
}

.btn {
  overflow-anchor: none;
  width: 100%;
}

thead {
  text-align: start;
  border-bottom-width: 2px;
  border-bottom-style: solid;
  border-bottom-color: rgb(222, 226, 230);
}

th,
td {
  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: rgb(222, 226, 230);
}

.btn-link {
  text-decoration: none;
}

.btn-link:hover {
  text-decoration: underline;
}
</style>
