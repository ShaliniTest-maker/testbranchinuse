/**
 * Application Configuration Module
 *
 * This module aggregates and exports all application configuration settings
 * from various configuration files. It serves as the main entry point for
 * accessing configuration throughout the application.
 *
 * Current configuration domains:
 * - Server configuration (port, host, environment)
 *
 * @module config
 */

// Import server-related configuration settings
const serverConfig = require('./server.config');

/**
 * Export the server configuration
 * This makes server configuration settings available throughout the application
 * from a single import point.
 * 
 * Usage example:
 * const { serverConfig } = require('./config');
 * console.log(`Server will start on port ${serverConfig.port}`);
 */
module.exports = {
  serverConfig
};