const express = require('express');
const router = express.Router();
const { 
  getAssignments, 
  createAssignment, 
  getAssignment, 
  updateAssignment, 
  deleteAssignment,
  submitHandwrittenAssignment
} = require('../controllers/assignmentController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getAssignments)
  .post(protect, createAssignment);

router.put('/:id/submit', protect, submitHandwrittenAssignment);

router.route('/:id')
  .get(protect, getAssignment)
  .put(protect, updateAssignment)
  .delete(protect, deleteAssignment);

module.exports = router;
