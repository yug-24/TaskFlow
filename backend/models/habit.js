import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  habit: {
    type: String,
    required: true
  },
  streak: {
    type: Number,
    default: 0
  },
  progress: {
    type: [Date],
    default: []
  }
}, {
  timestamps: true
});

export default mongoose.model('Habit', habitSchema);