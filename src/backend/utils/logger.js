/**
 * Logger utility module for the Node.js HTTP server application.
 * Provides standardized logging functionality with different log levels
 * and consistent message formatting.
 */

/**
 * Determines if the application is running in development environment
 * 
 * @returns {boolean} True if in development environment, false otherwise
 */
const isDevEnvironment = () => {
  const nodeEnv = process.env.NODE_ENV;
  return !nodeEnv || nodeEnv === 'development';
};

/**
 * Formats a log message with timestamp and additional context
 * 
 * @param {string} message - The log message
 * @param {object} context - Optional context information to include in the log
 * @returns {string} Formatted log message with timestamp and context
 */
const formatMessage = (message, context) => {
  const timestamp = new Date().toISOString();
  let formattedMessage = `[${timestamp}] ${message}`;
  
  if (context && Object.keys(context).length > 0) {
    formattedMessage += ` ${JSON.stringify(context)}`;
  }
  
  return formattedMessage;
};

/**
 * Logs an informational message to the console
 * 
 * @param {string} message - The information message to log
 * @param {object} context - Optional context information to include
 */
const info = (message, context) => {
  const formattedMessage = formatMessage(message, context);
  console.info(formattedMessage);
};

/**
 * Logs a debug message to the console if in development environment
 * 
 * @param {string} message - The debug message to log
 * @param {object} context - Optional context information to include
 */
const debug = (message, context) => {
  if (isDevEnvironment()) {
    const formattedMessage = formatMessage(message, context);
    console.debug(formattedMessage);
  }
};

/**
 * Logs an error message to the console with error details
 * 
 * @param {string} message - The error message to log
 * @param {Error} error - The error object containing details
 */
const error = (message, error) => {
  const errorContext = error ? {
    errorMessage: error.message,
    stack: error.stack
  } : undefined;
  
  const formattedMessage = formatMessage(message, errorContext);
  console.error(formattedMessage);
  
  // If there's a stack trace, log it for better debugging
  if (error && error.stack) {
    console.error(error.stack);
  }
};

/**
 * Logger object that provides standardized logging functions
 */
const logger = {
  info,
  debug,
  error
};

module.exports = logger;