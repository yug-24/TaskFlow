import express from 'express';
import Task from '../models/task.js';

const router = express.Router();

const validateTaskInput = (req, res, next) => {
  const { title, completed, deadline } = req.body;
  
  if (req.method === 'POST' && (!title || typeof title !== 'string' || title.trim().length === 0)) {
    return res.status(400).json({ error: 'Task title is required and must be a non-empty string' });
  }
  
  if (title && (typeof title !== 'string' || title.length > 500)) {
    return res.status(400).json({ error: 'Task title must be a string less than 500 characters' });
  }
  
  if (completed !== undefined && typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'Completed must be a boolean' });
  }
  
  if (deadline !== undefined && deadline !== null) {
    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
      return res.status(400).json({ error: 'Deadline must be a valid date' });
    }
  }
  
  const allowedFields = ['title', 'completed', 'deadline'];
  const extraFields = Object.keys(req.body).filter(key => !allowedFields.includes(key) && key !== 'userId');
  if (extraFields.length > 0) {
    return res.status(400).json({ error: `Invalid fields: ${extraFields.join(', ')}` });
  }
  
  next();
};

// GET all tasks for the authenticated user
router.get('/', async (req, res) => {
  try {
    console.log('Fetching tasks for user:', req.userId);
    const tasks = await Task.find({ userId: req.userId });
    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST create a new task
router.post('/', validateTaskInput, async (req, res) => {
  try {
    console.log('Creating task for user:', req.userId, req.body);
    const task = new Task({
      ...req.body,
      userId: req.userId
    });
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT update a task
router.put('/:id', validateTaskInput, async (req, res) => {
  try {
    console.log('Updating task:', req.params.id, 'for user:', req.userId);
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    // Sanitize update payload - never allow userId to be changed
    const { userId, ...sanitizedUpdate } = req.body;
    
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId }, // Enforce ownership in query
      sanitizedUpdate,
      { new: true }
    );
    res.json(updatedTask);
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ error: err.message });
  }
});

// PATCH toggle task completion status
router.patch('/:id/toggle', async (req, res) => {
  try {
    console.log('Toggling task:', req.params.id, 'for user:', req.userId);
    
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    task.completed = !task.completed;
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    console.error('Error toggling task:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE a task
router.delete('/:id', async (req, res) => {
  try {
    console.log('Deleting task:', req.params.id, 'for user:', req.userId);
    
    const deletedTask = await Task.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.userId 
    });
    
    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;