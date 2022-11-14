import { action, makeObservable, observable } from 'mobx'
import { v4 as uuidV4 } from 'uuid'
import { Todo } from '../types/todo.types'
import { add, getAll, update } from '../utils/indexedDB'
class TodoStore {
  todoList: Array<Todo> = []

  constructor() {
    makeObservable(this, {
      todoList: observable,
      add: action,
      getAll: action,
    })

    this.getAll()
  }

  async getAll() {
    const todolist = await getAll<Todo>('todolist')
    this.todoList = todolist
  }

  async add(description: string) {
    const todo = {
      id: uuidV4(),
      description,
      done: false,
    }

    await add('todolist', todo)
    this.todoList.push(todo)
  }

  async toggleDone(index: number) {
    await update('todolist', {
      ...this.todoList[index],
      done: !this.todoList[index].done,
    })

    this.todoList[index].done = !this.todoList[index].done
  }
}

const store = new TodoStore()

export default store
