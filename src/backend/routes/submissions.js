
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Course = require('../models/Course');

// @route   GET api/submissions/assignment/:assignmentId
// @desc    Get all submissions for an assignment
// @access  Private (Faculty, Admin)
router.get('/assignment/:assignmentId', auth, async (req, res) => {
  if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Not authorized to view all submissions' });
  }
  
  try {
    const assignment = await Assignment.findById(req.params.assignmentId);
    
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
      return res.status(403).json({ msg: 'Not authorized to view submissions for this assignment' });
    }
    
    const submissions = await Submission.find({ assignment: req.params.assignmentId })
      .populate('student', 'firstName lastName email')
      .sort({ submissionDate: -1 });
      
    res.json(submissions);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Assignment not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/submissions/student/assignment/:assignmentId
// @desc    Get a student's submission for an assignment
// @access  Private
router.get('/student/assignment/:assignmentId', auth, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.assignmentId);
    
    if (!assignment) {
      return res.status(404).json({ msg: 'Assignment not found' });
    }
    
    // Get course to check permissions
    const course = await Course.findById(assignment.course);
    
    if (!course) {
      return res.status(404).json({ msg: 'Associated course not found' });
    }
    
    const isInstructor = course.instructor.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    
    let studentId = req.user.id;
    
    // If faculty/admin is requesting a specific student's submission
    if ((isInstructor || isAdmin) && req.query.studentId) {
      studentId = req.query.studentId;
    } else if (req.user.role === 'student') {
      // Check if student is enrolled in the course
      const isEnrolled = course.students.some(id => id.toString() === req.user.id);
      
      if (!isEnrolled) {
        return res.status(403).json({ msg: 'Not enrolled in this course' });
      }
    } else if (!isInstructor && !isAdmin) {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    
    const submission = await Submission.findOne({
      assignment: req.params.assignmentId,
      student: studentId
    }).populate('student', 'firstName lastName');
    
    // If no submission found, return empty response with 200
    if (!submission) {
      return res.json(null);
    }
    
    res.json(submission);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Assignment not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/submissions
// @desc    Submit an assignment
// @access  Private (Students)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ msg: 'Only students can submit assignments' });
  }
  
  const {
    assignment: assignmentId,
    content,
    attachments
  } = req.body;
  
  try {
    const assignment = await Assignment.findById(assignmentId);
    
    if (!assignment) {
      return res.status(404).json({ msg: 'Assignment not found' });
    }
    
    // Check if assignment is published
    if (!assignment.isPublished) {
      return res.status(403).json({ msg: 'This assignment is not published yet' });
    }
    
    // Get course to check enrollment
    const course = await Course.findById(assignment.course);
    
    if (!course) {
      return res.status(404).json({ msg: 'Associated course not found' });
    }
    
    // Check if student is enrolled in the course
    const isEnrolled = course.students.some(id => id.toString() === req.user.id);
    
    if (!isEnrolled) {
      return res.status(403).json({ msg: 'Not enrolled in this course' });
    }
    
    // Check if already submitted
    let submission = await Submission.findOne({
      assignment: assignmentId,
      student: req.user.id
    });
    
    // If already submitted, update instead of creating new
    if (submission) {
      submission.content = content;
      submission.attachments = attachments || [];
      submission.submissionDate = Date.now();
      submission.isLate = new Date() > new Date(assignment.dueDate);
      submission.status = 'resubmitted';
      
      await submission.save();
      return res.json(submission);
    }
    
    // Create new submission
    submission = new Submission({
      assignment: assignmentId,
      student: req.user.id,
      content,
      attachments: attachments || [],
      isLate: new Date() > new Date(assignment.dueDate)
    });
    
    await submission.save();
    res.json(submission);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/submissions/:id/grade
// @desc    Grade a submission
// @access  Private (Faculty, Admin)
router.put('/:id/grade', auth, async (req, res) => {
  if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Not authorized to grade submissions' });
  }
  
  const { points, feedback } = req.body;
  
  if (points === undefined) {
    return res.status(400).json({ msg: 'Points are required for grading' });
  }
  
  try {
    let submission = await Submission.findById(req.params.id);
    
    if (!submission) {
      return res.status(404).json({ msg: 'Submission not found' });
    }
    
    // Get assignment and course to check permissions
    const assignment = await Assignment.findById(submission.assignment);
    
    if (!assignment) {
      return res.status(404).json({ msg: 'Associated assignment not found' });
    }
    
    const course = await Course.findById(assignment.course);
    
    if (!course) {
      return res.status(404).json({ msg: 'Associated course not found' });
    }
    
    // Check if user is the course instructor or admin
    if (req.user.role !== 'admin' && course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to grade submissions for this course' });
    }
    
    // Validate points
    if (points < 0 || points > assignment.pointsPossible) {
      return res.status(400).json({ 
        msg: `Points must be between 0 and ${assignment.pointsPossible}` 
      });
    }
    
    // Update grade
    submission.grade = {
      points,
      feedback: feedback || '',
      gradedBy: req.user.id,
      gradedAt: Date.now()
    };
    
    submission.status = 'graded';
    
    await submission.save();
    res.json(submission);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Submission not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
