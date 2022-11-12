import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'

const App = () => {
  return (
    <div className="w-screen h-screen max-w-xs mx-auto flex flex-col items-start justify-center gap-3">
      <TodoForm />
      <TodoList />
    </div>
  )
}

export default App
