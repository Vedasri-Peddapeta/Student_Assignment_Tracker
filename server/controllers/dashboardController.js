const Assignment = require('../models/Assignment');

// @desc    Get dashboard stats
// @route   GET /api/dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const assignments = await Assignment.find({ userId: req.user.id });

    const total = assignments.length;
    const completed = assignments.filter(a => a.status === 'Completed').length;
    const pending = assignments.filter(a => a.status === 'Pending' || a.status === 'In Progress').length;
    
    // Check overdue and update if necessary based on rules
    const now = new Date();
    let overdueCount = 0;
    
    for (let a of assignments) {
      if (a.status !== 'Completed') {
        if (new Date(a.dueDate) < now) {
          if (a.status !== 'Overdue') {
            a.status = 'Overdue';
            await a.save();
          }
          overdueCount++;
        } else if (a.status === 'Overdue') {
          // just in case logic
           overdueCount++;
        }
      }
    }

    const highPriority = assignments.filter(a => a.priority === 'High' && a.status !== 'Completed').length;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

    // Subject breakdown
    const subjectMap = {};
    assignments.forEach(a => {
      subjectMap[a.subject] = (subjectMap[a.subject] || 0) + 1;
    });

    const assignmentsPerSubject = Object.keys(subjectMap).map(subject => ({
      name: subject,
      count: subjectMap[subject]
    }));

    res.json({
      total,
      completed,
      pending,
      overdue: overdueCount,
      highPriority,
      progress,
      recentAssignments: assignments.slice(-5).reverse(), // Last 5
      assignmentsPerSubject
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
