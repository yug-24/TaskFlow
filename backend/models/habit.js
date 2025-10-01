import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    maxlength: 200
  },
  streak: {
    type: Number,
    default: 0,
    min: 0
  },
  progress: {
    type: [Date],
    default: []
  }
}, {
  timestamps: true
});

habitSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Habit', habitSchema);