/**
 * Core Server Module
 * 
 * This module provides functions for creating, starting, and managing the HTTP server lifecycle.
 * It handles server initialization, port binding, and graceful shutdown procedures.
 * 
 * @module server
 */

// Import Node.js built-in HTTP module
const http = require('http'); // built-in

// Import logger and server configuration
const { info, error, debug } = require('../utils/logger');
const { serverConfig } = require('../config');

/**
 * Creates an HTTP server instance using the provided Express application
 * 
 * @param {Object} app - Express application instance to handle requests
 * @returns {Object} HTTP server instance
 */
const createServer = (app) => {
  debug('Creating HTTP server instance');
  const server = http.createServer(app);
  return server;
};

/**
 * Starts the HTTP server on the configured port and host
 * 
 * @param {Object} server - HTTP server instance to start
 * @returns {Promise<Object>} Promise that resolves with the server instance when server starts successfully
 */
const startServer = (server) => {
  return new Promise((resolve, reject) => {
    const { port, host } = serverConfig;
    
    // Handle server startup errors
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        error(`Port ${port} is already in use. Please choose a different port.`, err);
      } else {
        error('Error starting server:', err);
      }
      reject(err);
    });
    
    // Handle successful server startup
    server.on('listening', () => {
      const address = server.address();
      info(`Server running on http://${address.address === '0.0.0.0' ? 'localhost' : address.address}:${address.port}`);
      resolve(server);
    });
    
    // Start the server
    debug(`Attempting to start server on ${host}:${port}`);
    server.listen(port, host);
  });
};

/**
 * Gracefully shuts down the HTTP server
 * 
 * @param {Object} server - HTTP server instance to shutdown
 * @param {string} signal - Signal that triggered the shutdown
 */
const shutdown = (server, signal) => {
  info(`Server shutdown initiated (${signal})`);
  
  // Set a timeout to force process exit if graceful shutdown takes too long
  const forceShutdownTimeout = setTimeout(() => {
    error('Forced shutdown due to timeout');
    process.exit(1);
  }, 10000); // 10 seconds timeout
  
  // Close the server
  server.close((err) => {
    clearTimeout(forceShutdownTimeout);
    
    if (err) {
      error('Error during server shutdown:', err);
      process.exit(1);
    }
    
    info('Server shutdown completed successfully');
    process.exit(0);
  });
};

/**
 * Configures signal handlers for graceful server shutdown
 * 
 * @param {Object} server - HTTP server instance to set up shutdown handlers for
 */
const setupGracefulShutdown = (server) => {
  debug('Setting up graceful shutdown handlers');
  
  // Handle SIGTERM signal (e.g., from Docker, Kubernetes, etc.)
  process.on('SIGTERM', () => {
    debug('Received SIGTERM signal');
    shutdown(server, 'SIGTERM');
  });
  
  // Handle SIGINT signal (e.g., Ctrl+C)
  process.on('SIGINT', () => {
    debug('Received SIGINT signal');
    shutdown(server, 'SIGINT');
  });
  
  // Log when server closes
  server.on('close', () => {
    debug('Server closed all connections');
  });
};

module.exports = {
  createServer,
  startServer,
  setupGracefulShutdown
};