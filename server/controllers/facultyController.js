const User = require('../models/User');
const Assignment = require('../models/Assignment');

// @desc    Get all student profiles along with their assignment stats
// @route   GET /api/faculty/students
exports.getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');

    const studentsWithStats = await Promise.all(
      students.map(async (student) => {
        const assignments = await Assignment.find({ userId: student._id });
        const total = assignments.length;
        const completed = assignments.filter(a => a.status === 'Completed').length;
        const pending = assignments.filter(a => a.status === 'Pending' || a.status === 'In Progress').length;
        const overdue = assignments.filter(a => a.status === 'Overdue').length;
        const submissions = assignments.filter(a => a.submissionUrl).length;

        return {
          _id: student._id,
          name: student.name,
          email: student.email,
          createdAt: student.createdAt,
          stats: {
            total,
            completed,
            pending,
            overdue,
            submissions,
            progress: total === 0 ? 0 : Math.round((completed / total) * 100)
          }
        };
      })
    );

    res.json(studentsWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all assignments for a specific student
// @route   GET /api/faculty/students/:studentId/assignments
exports.getStudentAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ userId: req.params.studentId }).sort({ dueDate: 1 });
    const student = await User.findById(req.params.studentId).select('-password');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({
      student,
      assignments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Grade / review a student assignment
// @route   PUT /api/faculty/assignments/:assignmentId/grade
exports.gradeAssignment = async (req, res) => {
  try {
    const { grade, facultyFeedback } = req.body;
    const assignment = await Assignment.findById(req.params.assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    assignment.grade = grade || assignment.grade;
    assignment.facultyFeedback = facultyFeedback || assignment.facultyFeedback;
    if (assignment.status !== 'Completed') {
      assignment.status = 'Completed';
    }

    const updatedAssignment = await assignment.save();
    res.json(updatedAssignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign a new task to a specific student or all students
// @route   POST /api/faculty/students/:studentId/assignments
exports.assignTask = async (req, res) => {
  try {
    const { title, description, subject, priority, dueDate, estimatedHours } = req.body;
    const { studentId } = req.params;

    if (new Date(dueDate) < new Date()) {
      return res.status(400).json({ message: 'Due date cannot be in the past' });
    }

    if (studentId === 'all') {
      const students = await User.find({ role: 'student' });
      if (students.length === 0) {
        return res.status(404).json({ message: 'No enrolled students found to assign' });
      }

      const createdTasks = await Promise.all(
        students.map(async (student) => {
          return await Assignment.create({
            userId: student._id,
            title,
            description,
            subject,
            priority: priority || 'Medium',
            dueDate,
            estimatedHours,
            status: 'Pending',
          });
        })
      );

      return res.status(201).json({ message: `Successfully assigned to ${createdTasks.length} students`, count: createdTasks.length });
    } else {
      const student = await User.findById(studentId);
      if (!student || student.role !== 'student') {
        return res.status(404).json({ message: 'Student profile not found' });
      }

      const assignment = await Assignment.create({
        userId: student._id,
        title,
        description,
        subject,
        priority: priority || 'Medium',
        dueDate,
        estimatedHours,
        status: 'Pending',
      });

      return res.status(201).json(assignment);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a student assignment from faculty portal
// @route   DELETE /api/faculty/assignments/:assignmentId
exports.deleteStudentAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    await assignment.deleteOne();
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
