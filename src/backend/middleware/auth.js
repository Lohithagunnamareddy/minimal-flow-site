
// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes middleware
 * Verifies JWT token and attaches user to request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.protect = async (req, res, next) => {
  let token;
  
  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Extract token from Bearer header
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    // If not in headers, check cookies
    token = req.cookies.token;
  }
  
  // If no token found, return unauthorized
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Attach user to request
    req.user = await User.findById(decoded.id);
    
    // If user not found, return unauthorized
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update last login
    await User.findByIdAndUpdate(req.user._id, { lastLogin: Date.now() });
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

/**
 * Authorize roles middleware
 * Checks if user has the required role to access a route
 * @param {...String} roles - Roles allowed to access the route
 * @returns {Function} - Express middleware function
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user has required role
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};
