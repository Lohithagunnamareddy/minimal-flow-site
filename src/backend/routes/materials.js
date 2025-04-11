
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Material = require('../models/Material');
const Course = require('../models/Course');

// @route   GET api/materials/course/:courseId
// @desc    Get all materials for a course
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
      return res.status(403).json({ msg: 'Not authorized to access course materials' });
    }
    
    // Get all published materials or all materials if instructor/admin
    let query = { course: req.params.courseId };
    if (!isInstructor && !isAdmin) {
      query.isPublished = true;
    }
    
    const materials = await Material.find(query)
      .sort({ order: 1, createdAt: 1 });
      
    res.json(materials);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Course not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/materials/:id
// @desc    Get material by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    
    if (!material) {
      return res.status(404).json({ msg: 'Material not found' });
    }
    
    // Get course to check permissions
    const course = await Course.findById(material.course);
    
    if (!course) {
      return res.status(404).json({ msg: 'Associated course not found' });
    }
    
    // Check if user has access to this material
    const isInstructor = course.instructor.toString() === req.user.id;
    const isStudent = course.students.some(id => id.toString() === req.user.id);
    const isAdmin = req.user.role === 'admin';
    
    if (!isInstructor && !isStudent && !isAdmin) {
      return res.status(403).json({ msg: 'Not authorized to access this material' });
    }
    
    // If not published and user is a student, deny access
    if (!material.isPublished && !isInstructor && !isAdmin) {
      return res.status(403).json({ msg: 'This material is not published yet' });
    }
    
    res.json(material);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Material not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/materials
// @desc    Create a new material
// @access  Private (Faculty, Admin)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Not authorized to create materials' });
  }
  
  const {
    title,
    description,
    course: courseId,
    type,
    content,
    order,
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
      return res.status(403).json({ msg: 'Not authorized to add materials to this course' });
    }
    
    // Create new material
    const material = new Material({
      title,
      description,
      course: courseId,
      type,
      content,
      order: order || 0,
      isPublished: isPublished !== undefined ? isPublished : true,
      createdBy: req.user.id
    });
    
    await material.save();
    res.json(material);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/materials/:id
// @desc    Update a material
// @access  Private (Faculty, Admin)
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Not authorized to update materials' });
  }
  
  try {
    let material = await Material.findById(req.params.id);
    
    if (!material) {
      return res.status(404).json({ msg: 'Material not found' });
    }
    
    // Get course to check permissions
    const course = await Course.findById(material.course);
    
    if (!course) {
      return res.status(404).json({ msg: 'Associated course not found' });
    }
    
    // Check if user is the course instructor or admin
    if (req.user.role !== 'admin' && course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to update materials for this course' });
    }
    
    // Update material
    const updateFields = {};
    const allowedFields = [
      'title', 'description', 'type', 'content', 
      'order', 'isPublished'
    ];
    
    // Only update specified fields
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });
    
    updateFields.updatedAt = Date.now();
    
    material = await Material.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );
    
    res.json(material);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Material not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/materials/:id
// @desc    Delete a material
// @access  Private (Faculty, Admin)
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Not authorized to delete materials' });
  }
  
  try {
    const material = await Material.findById(req.params.id);
    
    if (!material) {
      return res.status(404).json({ msg: 'Material not found' });
    }
    
    // Get course to check permissions
    const course = await Course.findById(material.course);
    
    if (!course) {
      return res.status(404).json({ msg: 'Associated course not found' });
    }
    
    // Check if user is the course instructor or admin
    if (req.user.role !== 'admin' && course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to delete materials for this course' });
    }
    
    await material.remove();
    res.json({ msg: 'Material removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Material not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
