import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 500
  },
  completed: {
    type: Boolean,
    default: false
  },
  deadline: {
    type: Date
  }
}, {
  timestamps: true
});

taskSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Task', taskSchema);