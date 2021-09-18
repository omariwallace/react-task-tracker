import { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import About from './components/About'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'

function App () {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }

    getTasks()
  }, [])

  // Fetch Tasks
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()
    return data
  }

  // Add task
  const addTask = async (task) => {
    // const id = Math.floor(Math.random() * 1000) + 1
    // const newTask = {...task, id }

    const res = await fetch(`http://localhost:5000/tasks/`, {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
      method: 'POST'
    })

    const newTask = await res.json()

    setTasks([...tasks, newTask])
  }

  // Delete task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, { method: 'DELETE' })
    setTasks(tasks.filter(task => task.id !== id))
  }

  // Toggle reminder
  const toggleReminder = async (id) => {
    const matchingTask = tasks.find((task) => task.id === id)
    if (!matchingTask) return

    const updatedTask = { ...matchingTask, reminder: !matchingTask.reminder }

    await fetch(`http://localhost:5000/tasks/${id}`, {
      body: JSON.stringify(updatedTask),
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT'
    }) 

    setTasks(tasks.map(task => task.id === id ? updatedTask : task))
  }

  return (
    <Router>
      <div className="container">
        <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask} />
        <Route path='/' exact render={(props) => {
          return (
            <>
              {showAddTask && <AddTask onAdd={addTask} />}
              {tasks.length
                ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} />
                : 'No Tasks to Show'
              }
            </>
          )
        }} />
        <Route path='/about' component={About} />
        <Footer />
      </div>
    </Router>
  )
}

export default App
