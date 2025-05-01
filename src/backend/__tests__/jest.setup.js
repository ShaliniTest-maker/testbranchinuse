/**
 * Jest setup file for the Node.js HTTP server application.
 * 
 * This file configures the testing environment before each test runs,
 * setting up global test utilities, mocks, and configurations to ensure
 * consistent test execution across the application.
 * 
 * @jest-environment node
 */

// Import the logger to be mocked
const logger = require('../../utils/logger');

/**
 * Sets up mocks for the logger functions to prevent console output during tests
 */
function mockLogger() {
  // Mock all logger functions to prevent console output
  jest.spyOn(logger, 'info').mockImplementation(jest.fn());
  jest.spyOn(logger, 'debug').mockImplementation(jest.fn());
  jest.spyOn(logger, 'error').mockImplementation(jest.fn());
}

/**
 * Configures global Jest settings for all tests
 */
function setupGlobalConfig() {
  // Set global test timeout to 5000ms
  jest.setTimeout(5000);

  // Set NODE_ENV to 'test' if not already set
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'test';
  }
}

// Configure Jest before all tests
beforeAll(() => {
  setupGlobalConfig();
  mockLogger();
});

// Reset all mocks before each test to ensure test isolation
beforeEach(() => {
  jest.resetAllMocks();
});

// Clean up any resources or state after each test
afterEach(() => {
  // Add custom cleanup logic here if needed
});

// Export the setup functions for potential use in other test files
module.exports = {
  mockLogger,
  setupGlobalConfig
};