
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Course = require('../models/Course');
const User = require('../models/User');

// @route   GET api/courses
// @desc    Get all courses or filtered by query params
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { department, instructor, isActive } = req.query;
    const filter = {};
    
    if (department) filter.department = department;
    if (instructor) filter.instructor = instructor;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    
    // If user is a student, only show courses they're enrolled in
    if (req.user.role === 'student') {
      const courses = await Course.find({ students: req.user.id })
        .populate('instructor', 'firstName lastName email')
        .sort({ startDate: -1 });
      return res.json(courses);
    }
    
    // If user is faculty, only show courses they teach
    if (req.user.role === 'faculty') {
      const courses = await Course.find({ instructor: req.user.id, ...filter })
        .populate('instructor', 'firstName lastName email')
        .sort({ startDate: -1 });
      return res.json(courses);
    }
    
    // If admin, show all courses with filters
    const courses = await Course.find(filter)
      .populate('instructor', 'firstName lastName email')
      .sort({ startDate: -1 });
    
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/courses/:id
// @desc    Get course by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'firstName lastName email')
      .populate('students', 'firstName lastName email');
    
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }
    
    // Check if user has access to this course
    if (req.user.role === 'student' && 
        !course.students.some(student => student._id.toString() === req.user.id)) {
      return res.status(403).json({ msg: 'Not authorized to access this course' });
    }
    
    if (req.user.role === 'faculty' && course.instructor._id.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to access this course' });
    }
    
    res.json(course);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Course not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/courses
// @desc    Create a course
// @access  Private (Faculty, Admin)
router.post('/', auth, async (req, res) => {
  // Check user role
  if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Not authorized to create courses' });
  }
  
  const {
    title,
    courseCode,
    description,
    department,
    credits,
    startDate,
    endDate,
    schedule
  } = req.body;
  
  try {
    // Check if course code already exists
    let course = await Course.findOne({ courseCode });
    if (course) {
      return res.status(400).json({ msg: 'Course code already exists' });
    }
    
    // Create new course
    course = new Course({
      title,
      courseCode,
      description,
      department,
      credits,
      instructor: req.user.id,
      startDate,
      endDate,
      schedule
    });
    
    await course.save();
    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/courses/:id
// @desc    Update a course
// @access  Private (Course Instructor, Admin)
router.put('/:id', auth, async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }
    
    // Check if user is authorized to update
    if (req.user.role !== 'admin' && course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to update this course' });
    }
    
    // Update course
    const updateFields = {};
    const allowedFields = [
      'title', 'description', 'department', 'credits', 
      'startDate', 'endDate', 'schedule', 'isActive'
    ];
    
    // Only update specified fields
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });
    
    // Course code can only be changed by admin
    if (req.body.courseCode !== undefined && req.user.role === 'admin') {
      updateFields.courseCode = req.body.courseCode;
    }
    
    // Update course
    course = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );
    
    res.json(course);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Course not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/courses/:id
// @desc    Delete a course
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Not authorized to delete courses' });
  }
  
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }
    
    await course.remove();
    res.json({ msg: 'Course removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Course not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/courses/:id/enroll
// @desc    Enroll students in a course
// @access  Private (Faculty, Admin)
router.post('/:id/enroll', auth, async (req, res) => {
  if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Not authorized to enroll students' });
  }
  
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }
    
    // Check if user is the course instructor or admin
    if (req.user.role !== 'admin' && course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to enroll students in this course' });
    }
    
    const { studentIds } = req.body;
    
    if (!studentIds || !Array.isArray(studentIds)) {
      return res.status(400).json({ msg: 'Student IDs are required (as an array)' });
    }
    
    // Validate that all IDs are for actual students
    const students = await User.find({
      _id: { $in: studentIds },
      role: 'student'
    });
    
    if (students.length !== studentIds.length) {
      return res.status(400).json({ msg: 'One or more student IDs are invalid' });
    }
    
    // Add students to course (avoid duplicates)
    course.students = [...new Set([...course.students.map(id => id.toString()), ...studentIds])];
    await course.save();
    
    res.json(course);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Course not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/courses/:id/unenroll/:studentId
// @desc    Remove a student from a course
// @access  Private (Faculty, Admin)
router.delete('/:id/unenroll/:studentId', auth, async (req, res) => {
  if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Not authorized to unenroll students' });
  }
  
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }
    
    // Check if user is the course instructor or admin
    if (req.user.role !== 'admin' && course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to unenroll students from this course' });
    }
    
    // Remove student
    course.students = course.students.filter(id => id.toString() !== req.params.studentId);
    await course.save();
    
    res.json(course);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Course or student not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
