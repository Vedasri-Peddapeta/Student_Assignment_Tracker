const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  subject: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'Overdue'],
    default: 'Pending',
  },
  dueDate: {
    type: Date,
    required: true,
  },
  estimatedHours: {
    type: Number,
  },
  submissionUrl: {
    type: String,
  },
  submissionType: {
    type: String,
    default: 'none',
  },
  submissionNote: {
    type: String,
  },
  submittedAt: {
    type: Date,
  },
  facultyFeedback: {
    type: String,
  },
  grade: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
