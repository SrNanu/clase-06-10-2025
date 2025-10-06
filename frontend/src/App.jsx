import { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:3000/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const response = await fetch(API_URL);
    const data = await response.json();
    setTasks(data);
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTaskTitle }),
    });

    const newTask = await response.json();
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  const toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id);
    
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !task.completed }),
    });

    const updatedTask = await response.json();
    setTasks(tasks.map(t => t.id === id ? updatedTask : t));
  };

  const deleteTask = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="container">
      <h1>Lista de Tareas</h1>

      <form onSubmit={addTask} className="add-task-form">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Nueva tarea..."
          className="task-input"
        />
        <button type="submit" className="add-button">Agregar</button>
      </form>

      <div className="tasks-list">
        {tasks.map(task => (
          <div key={task.id} className="task-item">
            <div
              className={`task-content ${task.completed ? 'completed' : ''}`}
              onClick={() => toggleTask(task.id)}
            >
              <span>{task.title}</span>
            </div>
            <button onClick={() => deleteTask(task.id)} className="delete-button">
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
