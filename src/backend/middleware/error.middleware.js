/**
 * Error handling middleware module for the Node.js HTTP server application.
 * Provides middleware functions to handle various error scenarios including
 * 404 Not Found errors, 405 Method Not Allowed errors, and general error processing.
 */

const logger = require('../utils/logger');

/**
 * Middleware function that handles requests to undefined routes
 * Returns a 404 Not Found response
 * 
 * @param {Object} req - The HTTP request object
 * @param {Object} res - The HTTP response object
 * @param {Function} next - The next middleware function
 */
const notFoundHandler = (req, res, next) => {
  logger.debug(`Not Found: ${req.method} ${req.url}`, {
    ip: req.ip,
    headers: req.headers
  });
  
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Not Found');
};

/**
 * Middleware function that handles requests with unsupported HTTP methods
 * Returns a 405 Method Not Allowed response
 * 
 * @param {Object} req - The HTTP request object
 * @param {Object} res - The HTTP response object
 * @param {Function} next - The next middleware function
 */
const methodNotAllowedHandler = (req, res, next) => {
  logger.debug(`Method Not Allowed: ${req.method} ${req.url}`, {
    ip: req.ip,
    method: req.method,
    allowedMethods: 'GET'
  });
  
  res.statusCode = 405;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Method Not Allowed');
};

/**
 * Middleware function that handles errors during request processing
 * Returns appropriate error responses based on the error type
 * 
 * @param {Error} err - The error object
 * @param {Object} req - The HTTP request object
 * @param {Object} res - The HTTP response object
 * @param {Function} next - The next middleware function
 */
const errorHandler = (err, req, res, next) => {
  // Log the error with detailed information
  logger.error(`Error processing request: ${req.method} ${req.url}`, err);
  
  // Check if response headers have already been sent
  if (res.headersSent) {
    // If headers already sent, pass to default error handler
    return next(err);
  }
  
  // Determine status code (use err.statusCode if available, default to 500)
  const statusCode = err.statusCode || 500;
  
  // Set response status code and headers
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'text/plain');
  
  // In development, send detailed error message
  // In production, send generic error message
  const isDevEnvironment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
  const errorMessage = isDevEnvironment ? err.message : 'Internal Server Error';
  
  // Send error response
  res.end(errorMessage);
};

module.exports = {
  notFoundHandler,
  methodNotAllowedHandler,
  errorHandler
};