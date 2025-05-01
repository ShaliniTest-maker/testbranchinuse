/**
 * Main Entry Point for Node.js HTTP Server Application
 * 
 * This file is the main entry point for the Node.js HTTP server application.
 * It imports the configured Express application, creates an HTTP server,
 * and starts it on the configured port. It also sets up graceful shutdown
 * handlers for proper server lifecycle management.
 * 
 * @module index
 */

// Import the configured Express application
const app = require('./app');

// Import server creation and management functions
const { createServer, startServer, setupGracefulShutdown } = require('./server');

// Import logging utilities
const { info, error } = require('./utils/logger');

// Import server configuration
const { serverConfig } = require('./config');

/**
 * Initializes and starts the HTTP server application
 * 
 * @returns {Promise<void>} Promise that resolves when server starts successfully
 */
const startApplication = async () => {
  try {
    // Log application startup with configuration details
    info('Starting Node.js HTTP server application', {
      port: serverConfig.port,
      host: serverConfig.host,
      environment: serverConfig.nodeEnv || 'development'
    });

    // Create HTTP server using the configured Express application
    const server = createServer(app);

    // Set up graceful shutdown handlers
    setupGracefulShutdown(server);

    // Start the server on the configured port and host
    await startServer(server);

    // Log successful server startup
    info('Server startup completed successfully');
  } catch (err) {
    // Log any startup errors
    error('Server failed to start', err);
    
    // Exit process with error code
    process.exit(1);
  }
};

// Start the application
startApplication();

// Handle unhandled promise rejections to prevent application crashes
process.on('unhandledRejection', (reason, promise) => {
  error('Unhandled Promise Rejection', new Error(reason.stack || reason));
  // Don't exit the process here, just log the error
});