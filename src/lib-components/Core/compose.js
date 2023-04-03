/*
Used in ComposeMap and ComposeTask to manage the waitCondition and preCondition expressions

temporal constraints are expressed in the following clauses:

single antecedent task:
  waitCondition: "is_finished('taskA')"
  preCondition: "is_completed('taskA')"
multiple antecedent tasks:
  waitCondition: "num_finished(['taskA', 'taskB'])==2" (2 is the number of antecedents)
  preCondition: "num_completed(['taskA', 'taskB'])>0"

The waitCondition and preCondition can contain additional clauses.

These functions help to manage waitCondition and preCondition expressions programatically

{add, remove}Antecedent(planPath, source, target) will manage these clauses
setNonTemporalClauses(task, attribute, expression)
getTemporalDeps(task) is also used to draw maps
*/
export const TemporalConstraintMixin = {
  methods: {
    // returns array of taskNames that the passed task (Protocol.Task object) depends on
    getTemporalDeps(task) {
      let result = []
      if (task.waitCondition != undefined || task.waitCondition != null) {
        let matchdeps = /num_finished\(\[(.*,?)*\]\)==\d+/g.exec(task.waitCondition)
        if (matchdeps != null) {
          for (let dirty of matchdeps[1].split(',')) {
            result.push(dirty.trim().substring(1, dirty.length - 1))
          }
        } else {
          let matchdep = /is_finished\(("|'[\w-]+'|")\)/g.exec(task.waitCondition)
          if (matchdep != null) {
            let dirty = matchdep[1].trim()
            result.push(dirty.substring(1, dirty.length - 1))
          }
        }
      }
      return result
    },
    getForwardDeps(task) {
      // loop through all other tasks in the enclosed plan and check their temporal deps
      let result = []
      if (task._parent && task._parent.tasks) {
        for (let sib of task._parent.tasks) {
          if (sib.name != task.name) {
            let sibdeps = this.getTemporalDeps(sib)
            if (sibdeps.includes(task.name) && !result.includes(sib.name)) {
              result.push(sib.name)
            }
          }
        }
      }
      return result
    },
    addAntecedent(planPath, source, target) {
      let targetTask = this.protocol.getComponent(planPath + ':' + target)
      let currentDeps = this.getTemporalDeps(targetTask)
      if (currentDeps.length == 0) {
        this.appendClause(targetTask, 'waitCondition', "is_finished('" + source + "')")
        this.appendClause(targetTask, 'preCondition', "is_completed('" + source + "')")
      } else if (currentDeps.length == 1) {
        // replace length==1 clauses
        this.replaceClause(
          targetTask,
          'waitCondition',
          "is_finished('" + currentDeps[0] + "')",
          "num_finished(['" + currentDeps[0] + "','" + source + "'])==2"
        )
        this.replaceClause(
          targetTask,
          'preCondition',
          "is_completed('" + currentDeps[0] + "')",
          "num_completed(['" + currentDeps[0] + "','" + source + "'])>0"
        )
      } else {
        let oldDeps = this.writeDepArray(currentDeps)
        currentDeps.push(source)
        let newDeps = this.writeDepArray(currentDeps)
        // update multi dep clauses
        this.replaceClause(
          targetTask,
          'waitCondition',
          'num_finished(' + oldDeps + ')==' + (currentDeps.length - 1),
          'num_finished(' + newDeps + ')==' + currentDeps.length
        )
        this.replaceClause(
          targetTask,
          'preCondition',
          'num_completed(' + oldDeps + ')>0',
          'num_completed(' + newDeps + ')>0'
        )
      }
    },
    removeAntecedent(planPath, source, target) {
      let targetTask = this.protocol.getComponent(planPath + ':' + target)
      let currentDeps = this.getTemporalDeps(targetTask)
      if (currentDeps.length == 0) {
        console.log(
          'weird. attempting to remove a task antecedent,',
          source,
          'from a task which has none',
          target
        )
      } else if (currentDeps.length == 1) {
        this.replaceClause(targetTask, 'waitCondition', "is_finished('" + currentDeps[0] + "')", '')
        if (targetTask.waitCondition.length == 0) {
          delete targetTask.waitCondition
        }
        this.replaceClause(targetTask, 'preCondition', "is_completed('" + currentDeps[0] + "')", '')
        if (targetTask.preCondition.length == 0) {
          delete targetTask.preCondition
        }
      } else if (currentDeps.length == 2) {
        let oldDeps = this.writeDepArray(currentDeps)
        currentDeps.splice(currentDeps.indexOf(source), 1)
        this.replaceClause(
          targetTask,
          'waitCondition',
          'num_finished(' + oldDeps + ')==2',
          "is_finished('" + currentDeps[0] + "')"
        )
        this.replaceClause(
          targetTask,
          'preCondition',
          'num_completed(' + oldDeps + ')>0',
          "is_completed('" + currentDeps[0] + "')"
        )
      } else {
        let oldDeps = this.writeDepArray(currentDeps)
        currentDeps.splice(currentDeps.indexOf(source), 1)
        let newDeps = this.writeDepArray(currentDeps)
        this.replaceClause(
          targetTask,
          'waitCondition',
          'num_finished(' + oldDeps + ')==' + (currentDeps.length + 1),
          'num_finished(' + newDeps + ')==' + currentDeps.length
        )
        this.replaceClause(
          targetTask,
          'preCondition',
          'num_completed(' + oldDeps + ')>0',
          'num_completed(' + newDeps + ')>0'
        )
      }
    },
    // returns object {temporal: expr, nonTemporal: expr}
    getExpressions(expr) {
      if (expr) {
        let clauses = expr.split('&&') // returns an array.  if one one clause then the array has the whole expression
        let first = clauses[0].trim()
        if (
          first.startsWith('is_finished') ||
          first.startsWith('num_finished') ||
          first.startsWith('is_completed') ||
          first.startsWith('num_completed')
        ) {
          return { temporal: first, nonTemporal: clauses.splice(1).join(' && ').trim() }
        } else {
          return { temporal: null, nonTemporal: expr }
        }
      } else {
        return { temporal: null, nonTemporal: null }
      }
    },
    setNonTemporalClauses(task, attribute, expression) {
      let exprs = this.getExpressions(task, attribute)
      if (exprs.temporal) {
        if (expression.length > 0) {
          return exprs.temporal + ' && ' + expression
        } else {
          return exprs.temporal
        }
      } else {
        this.$set(task, attribute, expression)
      }
    },
    // concaternates the passed clause to the existing expression
    appendClause(task, attribute, clause) {
      if (task[attribute] && task[attribute].length > 0) {
        task[attribute] = clause + ' && ' + task[attribute]
      } else {
        this.$set(task, attribute, clause)
      }
    },
    replaceClause(task, attribute, existing, replacing) {
      if (task[attribute] && task[attribute].indexOf(existing) > -1) {
        task[attribute] = task[attribute].replace(existing, replacing)
      }
    },
    writeDepArray(deps) {
      let result = '['
      for (let i = 0; i < deps.length; i++) {
        result = result + "'" + deps[i] + "'"
        if (i < deps.length - 1) result = result + ','
      }
      return result + ']'
    },
    taskPos(task) {
      if (task.meta.pos) {
        return { x: task.meta.pos.x, y: task.meta.pos.y }
      } else {
        let root = task._getRoot()
        if (root.meta && root.meta.svg) {
          return { x: root.meta.svg.width / 2 - 20, y: root.meta.svg.height / 2 }
        } else {
          return { x: 20, y: 20 }
        }
      }
    }
  }
}
