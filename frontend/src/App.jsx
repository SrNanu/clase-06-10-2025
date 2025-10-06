import { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:3000/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Error al cargar las tareas');
      }
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    
    if (!newTaskTitle.trim()) {
      setError('El título de la tarea no puede estar vacío');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTaskTitle }),
      });

      if (!response.ok) {
        throw new Error('Error al crear la tarea');
      }

      const newTask = await response.json();
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !task.completed }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la tarea');
      }

      const updatedTask = await response.json();
      setTasks(tasks.map(t => t.id === id ? updatedTask : t));
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la tarea');
      }

      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1>📝 Lista de Tareas</h1>

        <form onSubmit={addTask} className="add-task-form">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Nueva tarea..."
            className="task-input"
            disabled={loading}
          />
          <button type="submit" className="add-button" disabled={loading}>
            ➕ Agregar
          </button>
        </form>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {loading && (
          <div className="loading">
            ⏳ Cargando...
          </div>
        )}

        <div className="tasks-list">
          {tasks.length === 0 ? (
            <p className="no-tasks">No hay tareas. ¡Agrega una nueva!</p>
          ) : (
            tasks.map(task => (
              <div key={task.id} className="task-item">
                <div
                  className={`task-content ${task.completed ? 'completed' : ''}`}
                  onClick={() => toggleTask(task.id)}
                >
                  <span className="task-checkbox">
                    {task.completed ? '✅' : '⬜'}
                  </span>
                  <span className="task-title">{task.title}</span>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="delete-button"
                  disabled={loading}
                  title="Eliminar tarea"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>

        <div className="task-counter">
          <span>Total: {tasks.length}</span>
          <span>Completadas: {tasks.filter(t => t.completed).length}</span>
          <span>Pendientes: {tasks.filter(t => !t.completed).length}</span>
        </div>
      </div>
    </div>
  );
}

export default App;
