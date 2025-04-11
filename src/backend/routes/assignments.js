
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Course = require('../models/Course');

// @route   GET api/assignments/course/:courseId
// @desc    Get all assignments for a course
// @access  Private
router.get('/course/:courseId', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }
    
    // Check if user has access to this course
    const isInstructor = course.instructor.toString() === req.user.id;
    const isStudent = course.students.some(id => id.toString() === req.user.id);
    const isAdmin = req.user.role === 'admin';
    
    if (!isInstructor && !isStudent && !isAdmin) {
      return res.status(403).json({ msg: 'Not authorized to access course assignments' });
    }
    
    // Get all published assignments or all assignments if instructor/admin
    let query = { course: req.params.courseId };
    if (!isInstructor && !isAdmin) {
      query.isPublished = true;
    }
    
    const assignments = await Assignment.find(query)
      .sort({ dueDate: 1 });
      
    res.json(assignments);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Course not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/assignments/:id
// @desc    Get assignment by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({ msg: 'Assignment not found' });
    }
    
    // Get course to check permissions
    const course = await Course.findById(assignment.course);
    
    if (!course) {
      return res.status(404).json({ msg: 'Associated course not found' });
    }
    
    // Check if user has access to this assignment
    const isInstructor = course.instructor.toString() === req.user.id;
    const isStudent = course.students.some(id => id.toString() === req.user.id);
    const isAdmin = req.user.role === 'admin';
    
    if (!isInstructor && !isStudent && !isAdmin) {
      return res.status(403).json({ msg: 'Not authorized to access this assignment' });
    }
    
    // If not published and user is a student, deny access
    if (!assignment.isPublished && !isInstructor && !isAdmin) {
      return res.status(403).json({ msg: 'This assignment is not published yet' });
    }
    
    res.json(assignment);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Assignment not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/assignments
// @desc    Create a new assignment
// @access  Private (Faculty, Admin)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Not authorized to create assignments' });
  }
  
  const {
    title,
    description,
    course: courseId,
    dueDate,
    pointsPossible,
    submissionType,
    attachments,
    isPublished
  } = req.body;
  
  try {
    // Check if course exists
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }
    
    // Check if user is the course instructor or admin
    if (req.user.role !== 'admin' && course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to add assignments to this course' });
    }
    
    // Create new assignment
    const assignment = new Assignment({
      title,
      description,
      course: courseId,
      dueDate,
      pointsPossible: pointsPossible || 100,
      submissionType: submissionType || 'file',
      attachments: attachments || [],
      isPublished: isPublished !== undefined ? isPublished : false,
      createdBy: req.user.id
    });
    
    await assignment.save();
    res.json(assignment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/assignments/:id
// @desc    Update an assignment
// @access  Private (Faculty, Admin)
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Not authorized to update assignments' });
  }
  
  try {
    let assignment = await Assignment.findById(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({ msg: 'Assignment not found' });
    }
    
    // Get course to check permissions
    const course = await Course.findById(assignment.course);
    
    if (!course) {
      return res.status(404).json({ msg: 'Associated course not found' });
    }
    
    // Check if user is the course instructor or admin
    if (req.user.role !== 'admin' && course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to update assignments for this course' });
    }
    
    // Update assignment
    const updateFields = {};
    const allowedFields = [
      'title', 'description', 'dueDate', 'pointsPossible', 
      'submissionType', 'attachments', 'isPublished'
    ];
    
    // Only update specified fields
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });
    
    updateFields.updatedAt = Date.now();
    
    assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );
    
    res.json(assignment);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Assignment not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/assignments/:id
// @desc    Delete an assignment
// @access  Private (Faculty, Admin)
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Not authorized to delete assignments' });
  }
  
  try {
    const assignment = await Assignment.findById(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({ msg: 'Assignment not found' });
    }
    
    // Get course to check permissions
    const course = await Course.findById(assignment.course);
    
    if (!course) {
      return res.status(404).json({ msg: 'Associated course not found' });
    }
    
    // Check if user is the course instructor or admin
    if (req.user.role !== 'admin' && course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to delete assignments for this course' });
    }
    
    // Also delete all submissions for this assignment
    await Submission.deleteMany({ assignment: req.params.id });
    
    await assignment.remove();
    res.json({ msg: 'Assignment and all submissions removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Assignment not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
