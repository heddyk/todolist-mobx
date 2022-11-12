import { observer } from 'mobx-react-lite'
import { FormEvent, useState } from 'react'
import todoStore from '../store/todo.store'

const TodoForm = () => {
  const [input, setInput] = useState<string>('')

  function handleAdd(event: FormEvent) {
    event.preventDefault()

    todoStore.add(input)

    setInput('')
  }

  return (
    <form onSubmit={handleAdd} className="w-full flex flex-col">
      <input
        type="text"
        placeholder="Provide the description of your task"
        className="px-4 py-2 outline-none border border-gray-500 rounded"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
    </form>
  )
}

export default observer(TodoForm)
