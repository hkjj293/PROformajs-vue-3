<docs>
Provides an expression evaluation box to help debugging.

# props

* enactment - a PROformajs enactment
* path - a PROformajs enactment task
* description - optional description text for the form-control

# notes

multiple expressions can be watched
an expression that consists of the name of a data def without a value will be undefined

</docs>

<template>
  <div>
    <div>
      <label for="expressions">Debug expressions</label>
      <input type="text" class="form-control" :id="id + 'expression'" :aria-describedby="id + 'expressionHelp'"
        placeholder="Enter test expression" @change="testExpression" />
      <small :id="id + 'expressionHelp'" class="form-text text-muted">{{ description }}</small>
      <div class="text-danger">{{ message }}</div>
    </div>
    <table class="table table-sm" v-if="expressions.length > 0">
      <thead>
        <tr>
          <th scope="col">Expression</th>
          <th scope="col" colspan="2">Value</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, idx) in expressions" :key="idx">
          <td @click="populateControl(item.expression)" class="clickable">{{ item.expression }}</td>
          <td>{{ item.value }}</td>
          <td>
            <button class="btn btn-light btn-sm float-sm-end" @click="deleteExpression(idx)">
              &times;
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: ['id', 'enactment', 'path', 'description'],
  data: function () {
    return {
      expression: null,
      message: null,
      expressions: []
    }
  },
  methods: {
    testExpression(evt) {
      this.message = null
      if (evt.target.value.length > 0) {
        try {
          // in lieu of a designPathFromRuntimePath function in enactment ....
          let design = this.path
            .split(':')
            .map((name) => (name.indexOf('[') > 0 ? name.substring(0, name.indexOf('[')) : name))
            .join(':')
          let result = this.enactment.evaluate(evt.target.value, design)
          if (!this.expressions.map((item) => item.expression).includes(evt.target.value)) {
            this.expressions.push({
              expression: evt.target.value,
              value: result != undefined ? result.toString() : 'undefined'
            })
          }
          this.expression = null
        } catch (e) {
          // extract relevant portion from message, e.g.
          // _evaluate failed for "is_finish('taskC')" from plan:taskA (this.is_finish is not a function)
          this.expression = evt.target.value
          if (e.message.indexOf('(') > -1) {
            let pos = e.message.lastIndexOf('(')
            this.message = e.message.substr(pos + 1, e.message.length - pos - 2)
            if (this.message.startsWith('this.')) {
              this.message = this.message.substring(5)
            }
          } else {
            this.message = e.message
          }
        }
      }
    },
    populateControl(txt) {
      this.expression = txt
    },
    deleteExpression(idx) {
      this.expressions.splice(idx, 1)
    }
  },
  watch: {
    path() {
      this.message = null
      this.expressions = []
      this.expression = null
    },
    enactment() {
      for (let item of this.expressions) {
        let result = this.enactment.evaluate(item.expression, this.path)
        item.value = result != undefined ? result.toString() : 'undefined'
      }
    }
  }
}
</script>

<style scoped>
.clickable {
  cursor: pointer;
}
</style>
