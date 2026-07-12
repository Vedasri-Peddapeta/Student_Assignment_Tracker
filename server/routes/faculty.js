const express = require('express');
const router = express.Router();
const { 
  getStudents, 
  getStudentAssignments, 
  gradeAssignment,
  assignTask,
  deleteStudentAssignment
} = require('../controllers/facultyController');
const { protect, faculty } = require('../middleware/auth');

// All faculty routes require user protection + faculty role verification
router.use(protect, faculty);

router.get('/students', getStudents);
router.post('/students/:studentId/assignments', assignTask);
router.get('/students/:studentId/assignments', getStudentAssignments);
router.put('/assignments/:assignmentId/grade', gradeAssignment);
router.delete('/assignments/:assignmentId', deleteStudentAssignment);

module.exports = router;
