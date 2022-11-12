import { action, makeObservable, observable } from 'mobx'

interface Todo {
  id: number
  description: string
  done: boolean
}

class TodoStore {
  todoList: Array<Todo> = []

  constructor() {
    makeObservable(this, {
      todoList: observable,
      add: action,
    })
  }

  add(description: string) {
    this.todoList.push({
      id: this.todoList.length + 1,
      description,
      done: false,
    })
  }

  toggleDone(index: number) {
    this.todoList[index].done = !this.todoList[index].done
  }
}

const store = new TodoStore()

export default store
