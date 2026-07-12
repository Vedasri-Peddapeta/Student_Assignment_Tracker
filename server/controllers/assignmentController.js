const Assignment = require('../models/Assignment');

// Helper to update overdue status before sending assignments
const updateOverdueStatus = async (assignments) => {
  const now = new Date();
  let updated = false;

  for (let assignment of assignments) {
    if (new Date(assignment.dueDate) < now && assignment.status !== 'Completed' && assignment.status !== 'Overdue') {
      assignment.status = 'Overdue';
      await assignment.save();
      updated = true;
    }
  }
  return updated;
};

// @desc    Get all assignments for user
// @route   GET /api/assignments
exports.getAssignments = async (req, res) => {
  try {
    let assignments = await Assignment.find({ userId: req.user.id }).sort({ dueDate: 1 });
    
    // Automatically set to overdue if past due date
    const updated = await updateOverdueStatus(assignments);
    
    // If updated, fetch again to get fresh data
    if (updated) {
      assignments = await Assignment.find({ userId: req.user.id }).sort({ dueDate: 1 });
    }

    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new assignment
// @route   POST /api/assignments
exports.createAssignment = async (req, res) => {
  try {
    const { title, description, subject, priority, status, dueDate, estimatedHours } = req.body;
    
    // Rule 5: Past due date cannot be selected while creating
    if (new Date(dueDate) < new Date()) {
      return res.status(400).json({ message: 'Due date cannot be in the past' });
    }

    const assignment = new Assignment({
      userId: req.user.id,
      title,
      description,
      subject,
      priority,
      status,
      dueDate,
      estimatedHours
    });

    const createdAssignment = await assignment.save();
    res.status(201).json(createdAssignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single assignment
// @route   GET /api/assignments/:id
exports.getAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (assignment && assignment.userId.toString() === req.user.id) {
      res.json(assignment);
    } else {
      res.status(404).json({ message: 'Assignment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update assignment
// @route   PUT /api/assignments/:id
exports.updateAssignment = async (req, res) => {
  try {
    const { title, description, subject, priority, status, dueDate, estimatedHours } = req.body;
    const assignment = await Assignment.findById(req.params.id);

    if (assignment && assignment.userId.toString() === req.user.id) {
      assignment.title = title || assignment.title;
      assignment.description = description || assignment.description;
      assignment.subject = subject || assignment.subject;
      assignment.priority = priority || assignment.priority;
      assignment.status = status || assignment.status;
      assignment.dueDate = dueDate || assignment.dueDate;
      assignment.estimatedHours = estimatedHours || assignment.estimatedHours;

      const updatedAssignment = await assignment.save();
      res.json(updatedAssignment);
    } else {
      res.status(404).json({ message: 'Assignment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete assignment
// @route   DELETE /api/assignments/:id
exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (assignment && assignment.userId.toString() === (req.user._id ? req.user._id.toString() : req.user.id)) {
      await assignment.deleteOne();
      res.json({ message: 'Assignment removed' });
    } else {
      res.status(404).json({ message: 'Assignment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit handwritten assignment work (Image/PDF/Link base64 or url)
// @route   PUT /api/assignments/:id/submit
exports.submitHandwrittenAssignment = async (req, res) => {
  try {
    const { submissionUrl, submissionType, submissionNote } = req.body;
    const assignment = await Assignment.findById(req.params.id);

    if (assignment && assignment.userId.toString() === (req.user._id ? req.user._id.toString() : req.user.id)) {
      assignment.submissionUrl = submissionUrl;
      assignment.submissionType = submissionType || 'image';
      assignment.submissionNote = submissionNote || '';
      assignment.submittedAt = new Date();
      assignment.status = 'Completed';

      const updatedAssignment = await assignment.save();
      res.json(updatedAssignment);
    } else {
      res.status(404).json({ message: 'Assignment not found or not authorized' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
