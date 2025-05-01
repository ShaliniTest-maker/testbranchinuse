/**
 * Server Configuration Module
 * 
 * This module defines and exports server-related configuration settings such as
 * port, host, and environment. It retrieves values from environment variables with
 * appropriate defaults when environment variables are not set.
 *
 * @module config/server.config
 */

/**
 * Retrieves a value from environment variables with a fallback default
 *
 * @param {string} key - The environment variable key to check
 * @param {any} defaultValue - The default value to use if the environment variable is not set
 * @returns {any} Value from environment variable or default if not set
 */
const getEnvValue = (key, defaultValue) => {
  return process.env[key] !== undefined ? process.env[key] : defaultValue;
};

/**
 * Server configuration object containing all server-related settings
 * 
 * @type {Object}
 * @property {number} port - TCP port on which the HTTP server listens (default: 3000)
 * @property {string} host - Network interface to bind the server to (default: "0.0.0.0")
 * @property {string} nodeEnv - Application environment mode (default: "development")
 */
const serverConfig = {
  // Port configuration with default of 3000 if PORT environment variable is not set
  port: parseInt(getEnvValue('PORT', 3000), 10),
  
  // Host configuration with default of "0.0.0.0" (all interfaces) if HOST environment variable is not set
  host: getEnvValue('HOST', '0.0.0.0'),
  
  // Node environment with default of "development" if NODE_ENV environment variable is not set
  nodeEnv: getEnvValue('NODE_ENV', 'development')
};

module.exports = serverConfig;