import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/global.css'
import setupIndexedDB from './utils/indexedDB'

setupIndexedDB({
  databaseName: 'Todolist database',
  version: 9,
  stores: [
    {
      name: 'todolist',
      id: { keyPath: 'id', autoIncrement: true },
    },
  ],
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
