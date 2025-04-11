
// backend/models/Profile.js
const mongoose = require('mongoose');

/**
 * Profile Schema
 * Extended information about users
 */
const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  profilePicture: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    trim: true
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  address: {
    street: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    zipCode: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true
    }
  },
  socialMedia: {
    linkedin: String,
    twitter: String,
    github: String,
    website: String
  },
  // Additional fields for students
  studentInfo: {
    studentId: String,
    enrollmentDate: Date,
    graduationDate: Date,
    major: String,
    minor: String,
    gpa: Number,
    academicStanding: {
      type: String,
      enum: ['Good Standing', 'Warning', 'Probation', 'Suspension'],
      default: 'Good Standing'
    },
    courses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    }]
  },
  // Additional fields for faculty
  facultyInfo: {
    facultyId: String,
    hireDate: Date,
    title: String,
    office: String,
    officeHours: String,
    researchInterests: [String],
    courses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    }]
  },
  // Additional fields for admin
  adminInfo: {
    adminId: String,
    department: String,
    position: String,
    responsibilities: [String]
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Pre-save hook to update the updatedAt field
 */
ProfileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Profile', ProfileSchema);
