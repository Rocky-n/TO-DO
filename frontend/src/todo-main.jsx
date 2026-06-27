import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SingleTodo from './SingleTodo.jsx' // Pointing to our new Details component

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SingleTodo />
  </StrictMode>,
)