
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Attendance = require('../models/Attendance');
const Course = require('../models/Course');

// @route   GET api/attendance/course/:courseId
// @desc    Get all attendance records for a course
// @access  Private (Faculty, Admin)
router.get('/course/:courseId', auth, async (req, res) => {
  if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Not authorized to view attendance records' });
  }
  
  try {
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }
    
    // Check if user is the course instructor or admin
    if (req.user.role !== 'admin' && course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to view attendance for this course' });
    }
    
    const attendance = await Attendance.find({ course: req.params.courseId })
      .populate('records.student', 'firstName lastName email')
      .sort({ date: -1 });
      
    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Course not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/attendance/student/:studentId/course/:courseId
// @desc    Get attendance records for a student in a course
// @access  Private
router.get('/student/:studentId/course/:courseId', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }
    
    // Check permissions
    const isInstructor = course.instructor.toString() === req.user.id;
    const isStudent = req.user.id === req.params.studentId;
    const isAdmin = req.user.role === 'admin';
    
    if (!isInstructor && !isStudent && !isAdmin) {
      return res.status(403).json({ msg: 'Not authorized to view this attendance record' });
    }
    
    // If student, verify enrollment
    if (isStudent) {
      const isEnrolled = course.students.some(id => id.toString() === req.user.id);
      
      if (!isEnrolled) {
        return res.status(403).json({ msg: 'Not enrolled in this course' });
      }
    }
    
    // Get all attendance records for this course
    const attendanceRecords = await Attendance.find({ course: req.params.courseId });
    
    // Filter for student's records
    const studentAttendance = attendanceRecords.map(record => {
      return {
        date: record.date,
        status: record.records.find(r => r.student.toString() === req.params.studentId)?.status || 'absent',
        notes: record.records.find(r => r.student.toString() === req.params.studentId)?.notes || ''
      };
    });
    
    res.json(studentAttendance);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Course or student not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/attendance
// @desc    Create a new attendance record
// @access  Private (Faculty, Admin)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Not authorized to create attendance records' });
  }
  
  const {
    course: courseId,
    date,
    records
  } = req.body;
  
  if (!records || !Array.isArray(records)) {
    return res.status(400).json({ msg: 'Student attendance records are required' });
  }
  
  try {
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }
    
    // Check if user is the course instructor or admin
    if (req.user.role !== 'admin' && course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to record attendance for this course' });
    }
    
    // Check if a record already exists for this date
    const existingRecord = await Attendance.findOne({
      course: courseId,
      date: new Date(date).setHours(0, 0, 0, 0)
    });
    
    if (existingRecord) {
      return res.status(400).json({ msg: 'Attendance record already exists for this date' });
    }
    
    // Validate that all student IDs are enrolled in the course
    const studentIds = records.map(record => record.student);
    const enrolledIds = course.students.map(id => id.toString());
    
    const validStudents = studentIds.every(id => enrolledIds.includes(id.toString()));
    
    if (!validStudents) {
      return res.status(400).json({ msg: 'One or more students are not enrolled in this course' });
    }
    
    // Create new attendance record
    const attendance = new Attendance({
      course: courseId,
      date: new Date(date),
      records,
      createdBy: req.user.id
    });
    
    await attendance.save();
    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/attendance/:id
// @desc    Update an attendance record
// @access  Private (Faculty, Admin)
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Not authorized to update attendance records' });
  }
  
  const { records } = req.body;
  
  if (!records || !Array.isArray(records)) {
    return res.status(400).json({ msg: 'Student attendance records are required' });
  }
  
  try {
    let attendance = await Attendance.findById(req.params.id);
    
    if (!attendance) {
      return res.status(404).json({ msg: 'Attendance record not found' });
    }
    
    // Get course to check permissions
    const course = await Course.findById(attendance.course);
    
    if (!course) {
      return res.status(404).json({ msg: 'Associated course not found' });
    }
    
    // Check if user is the course instructor or admin
    if (req.user.role !== 'admin' && course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to update attendance for this course' });
    }
    
    // Validate that all student IDs are enrolled in the course
    const studentIds = records.map(record => record.student);
    const enrolledIds = course.students.map(id => id.toString());
    
    const validStudents = studentIds.every(id => enrolledIds.includes(id.toString()));
    
    if (!validStudents) {
      return res.status(400).json({ msg: 'One or more students are not enrolled in this course' });
    }
    
    // Update attendance
    attendance.records = records;
    attendance.updatedAt = Date.now();
    
    await attendance.save();
    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Attendance record not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/attendance/:id
// @desc    Delete an attendance record
// @access  Private (Faculty, Admin)
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Not authorized to delete attendance records' });
  }
  
  try {
    const attendance = await Attendance.findById(req.params.id);
    
    if (!attendance) {
      return res.status(404).json({ msg: 'Attendance record not found' });
    }
    
    // Get course to check permissions
    const course = await Course.findById(attendance.course);
    
    if (!course) {
      return res.status(404).json({ msg: 'Associated course not found' });
    }
    
    // Check if user is the course instructor or admin
    if (req.user.role !== 'admin' && course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to delete attendance for this course' });
    }
    
    await attendance.remove();
    res.json({ msg: 'Attendance record removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Attendance record not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
