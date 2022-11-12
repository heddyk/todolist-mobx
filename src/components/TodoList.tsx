import { observer } from 'mobx-react-lite'
import todoStore from '../store/todo.store'

const TodoList = () => {
  return (
    <>
      <h2 className="text-2xl font-medium">Todo list</h2>
      <ul className="w-full flex flex-col gap-3">
        {todoStore.todoList.map((todo, index) => {
          return (
            <li
              key={todo.id}
              className="w-full flex items-center justify-between gap-4"
            >
              <span className={todo.done ? 'line-through' : ''}>
                {todo.description}
              </span>

              <input
                type="checkbox"
                defaultChecked={todo.done}
                onChange={() => todoStore.toggleDone(index)}
              />
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default observer(TodoList)
