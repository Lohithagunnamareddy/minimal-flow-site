
const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: function() {
      return this.submissionType === 'text' || this.submissionType === 'link';
    }
  },
  attachments: [{
    name: String,
    url: String
  }],
  submissionDate: {
    type: Date,
    default: Date.now
  },
  isLate: {
    type: Boolean,
    default: false
  },
  grade: {
    points: {
      type: Number,
      default: null
    },
    feedback: String,
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    gradedAt: Date
  },
  status: {
    type: String,
    enum: ['submitted', 'graded', 'returned', 'resubmitted'],
    default: 'submitted'
  }
});

module.exports = mongoose.model('Submission', SubmissionSchema);
