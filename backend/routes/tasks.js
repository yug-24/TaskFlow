import express from 'express';
import Task from '../models/task.js';

const router = express.Router();

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
router.post('/', async (req, res) => {
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
router.put('/:id', async (req, res) => {
  try {
    console.log('Updating task:', req.params.id, 'for user:', req.userId);
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedTask);
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE a task
router.delete('/:id', async (req, res) => {
  try {
    console.log('Deleting task:', req.params.id, 'for user:', req.userId);
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;