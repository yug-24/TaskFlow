import express from 'express';
import Habit from '../models/habit.js';

const router = express.Router();

// GET all habits for the authenticated user
router.get('/', async (req, res) => {
  try {
    console.log('Fetching habits for user:', req.userId);
    const habits = await Habit.find({ userId: req.userId });
    res.json(habits);
  } catch (err) {
    console.error('Error fetching habits:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST create a new habit
router.post('/', async (req, res) => {
  try {
    console.log('Creating habit for user:', req.userId, req.body);
    const habit = new Habit({
      ...req.body,
      userId: req.userId
    });
    const savedHabit = await habit.save();
    res.status(201).json(savedHabit);
  } catch (err) {
    console.error('Error creating habit:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT update a habit
router.put('/:id', async (req, res) => {
  try {
    console.log('Updating habit:', req.params.id, 'for user:', req.userId);
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!habit) {
      return res.status(404).json({ error: 'Habit not found or unauthorized' });
    }

    // Sanitize update payload - never allow userId to be changed
    const { userId, ...sanitizedUpdate } = req.body;
    
    const updatedHabit = await Habit.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId }, // Enforce ownership in query
      sanitizedUpdate,
      { new: true }
    );
    res.json(updatedHabit);
  } catch (err) {
    console.error('Error updating habit:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE a habit
router.delete('/:id', async (req, res) => {
  try {
    console.log('Deleting habit:', req.params.id, 'for user:', req.userId);
    
    const deletedHabit = await Habit.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.userId 
    });
    
    if (!deletedHabit) {
      return res.status(404).json({ error: 'Habit not found or unauthorized' });
    }

    res.json({ message: 'Habit deleted successfully' });
  } catch (err) {
    console.error('Error deleting habit:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;