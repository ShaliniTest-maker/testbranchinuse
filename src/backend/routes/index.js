/**
 * Express router module for the Node.js HTTP server application.
 * 
 * Defines the application routes, specifically the /hello endpoint.
 * Maps HTTP methods and paths to their corresponding controller functions
 * and exports the configured router for use in the main application.
 * 
 * Implements F-002: Hello Endpoint from the technical specifications.
 */

// Import external dependencies
// @version ^4.18.2
const express = require('express');

// Import internal dependencies
const { getHello } = require('../controllers/hello.controller');
const { methodNotAllowedHandler } = require('../middleware/error.middleware');
const { debug } = require('../utils/logger');

// Create Express router instance
const router = express.Router();

/**
 * Configures the Express router with application routes
 * 
 * @param {Object} router - Express router object to configure
 * @returns {Object} Configured Express router
 */
const configureRoutes = (router) => {
  // Log debug message about configuring routes
  debug('Configuring application routes');
  
  // Configure GET method for /hello path to use getHello controller
  router.get('/hello', getHello);
  
  // Configure all other methods for /hello path to use methodNotAllowedHandler
  router.all('/hello', methodNotAllowedHandler);
  
  // Return the configured router
  return router;
};

// Configure the router with application routes
configureRoutes(router);

// Export the configured router
module.exports = router;