/**
 * Hello World controller module
 * 
 * Handles requests to the /hello endpoint for the Node.js HTTP server application.
 * Implements F-002: Hello Endpoint from the technical specifications.
 */

// Import the logger utility for request logging
// @version v1.0.0
const { debug } = require('../utils/logger');

/**
 * Controller function that handles GET requests to the /hello endpoint
 * 
 * This function implements the following requirements:
 * - F-002-RQ-002: Return "Hello world" as plain text
 * - F-002-RQ-003: Return HTTP status code 200
 * - F-002-RQ-004: Set Content-Type header to "text/plain"
 * 
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @param {Function} next - Next middleware function (if applicable)
 */
const getHello = (req, res, next) => {
  // Log debug message about handling request to /hello endpoint
  debug('Processing request to /hello endpoint', { path: req.url });
  
  // Set response status code to 200 (OK) as per F-002-RQ-003
  res.statusCode = 200;
  
  // Set Content-Type header to 'text/plain' as per F-002-RQ-004
  res.setHeader('Content-Type', 'text/plain');
  
  // Send 'Hello world' as the response body as per F-002-RQ-002
  res.end('Hello world');
};

// Export the controller function
module.exports = {
  getHello
};