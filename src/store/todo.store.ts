import { action, makeObservable, observable } from 'mobx'
import { Todo } from '../types/todo.types'
import { getActions } from '../utils/db'

class TodoStore {
  todoList: Array<Todo> = []

  constructor() {
    makeObservable(this, {
      todoList: observable,
      add: action,
    })

    const { getAll } = getActions<Todo>('todolist')

    getAll().then((todolist) => {
      this.todoList = [...todolist]
    })
  }

  add(description: string) {
    const { add } = getActions<Todo>('todolist')

    const todo = {
      id: this.todoList.length + 1,
      description,
      done: false,
    }

    add(todo)
    this.todoList.push(todo)
  }

  toggleDone(index: number) {
    const { update } = getActions<Todo>('todolist')
    update({
      ...this.todoList[index],
      done: !this.todoList[index].done,
    })
    this.todoList[index].done = !this.todoList[index].done
  }
}

const store = new TodoStore()

export default store
