/**
 * Jest configuration file for Node.js Hello World application
 * Version: Jest v29.5.0
 * 
 * This configuration defines the test environment, coverage settings, and other
 * test-related configurations for the application according to the testing strategy
 * requirements.
 */

module.exports = {
  // Specifies Node.js environment for tests rather than browser
  testEnvironment: 'node',
  
  // Enables verbose output during test execution for better debugging
  verbose: true,
  
  // Setup files that run after Jest environment is set up but before tests execute
  setupFilesAfterEnv: ['<rootDir>/__tests__/jest.setup.js'],
  
  // Patterns of files to ignore when looking for test files
  testPathIgnorePatterns: ['/node_modules/'],
  
  // Files to include when collecting code coverage information
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/__tests__/**',
    '!**/coverage/**',
    '!jest.config.js',
    '!.eslintrc.js'
  ],
  
  // Minimum threshold enforcement for code coverage results
  // Ensures adequate test coverage per quality metrics requirements
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 100,
      lines: 90,
      statements: 90
    }
  },
  
  // Directory where Jest should output coverage files
  coverageDirectory: '<rootDir>/coverage',
  
  // Patterns to match test files
  testMatch: ['**/__tests__/**/*.test.js'],
  
  // Directories to search when resolving modules
  moduleDirectories: ['node_modules', '<rootDir>'],
  
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,
  
  // Automatically restore mock state before every test
  restoreMocks: true,
  
  // Default timeout for tests in milliseconds
  testTimeout: 5000
};