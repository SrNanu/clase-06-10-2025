import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Almacenamiento en memoria de las tareas
let tasks = [
  { id: 1, title: 'Tarea de ejemplo', completed: false }
];

// Contador para generar IDs únicos
let nextId = 2;

// GET /api/tasks - Obtener todas las tareas
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// POST /api/tasks - Crear nueva tarea
app.post('/api/tasks', (req, res) => {
  const { title } = req.body;

  // Validación
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'El título de la tarea es requerido' });
  }

  const newTask = {
    id: nextId++,
    title: title.trim(),
    completed: false
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /api/tasks/:id - Actualizar tarea existente
app.put('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title, completed } = req.body;

  const taskIndex = tasks.findIndex(task => task.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }

  // Actualizar solo los campos proporcionados
  if (title !== undefined) {
    if (title.trim() === '') {
      return res.status(400).json({ error: 'El título de la tarea no puede estar vacío' });
    }
    tasks[taskIndex].title = title.trim();
  }

  if (completed !== undefined) {
    tasks[taskIndex].completed = completed;
  }

  res.json(tasks[taskIndex]);
});

// DELETE /api/tasks/:id - Eliminar tarea
app.delete('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(task => task.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }

  const deletedTask = tasks.splice(taskIndex, 1)[0];
  res.json(deletedTask);
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
