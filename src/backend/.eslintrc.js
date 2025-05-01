module.exports = {
  // Environments that provide predefined global variables
  env: {
    node: true,    // Node.js global variables and Node.js scoping
    jest: true,    // Jest global variables for testing
    es2021: true,  // Adds all ECMAScript 2021 globals
  },
  
  // Base configurations to extend
  extends: [
    'eslint:recommended', // Uses ESLint's recommended rule set
  ],
  
  // ESLint plugins to use
  plugins: [
    'jest', // Adds Jest-specific linting rules
  ],
  
  // JavaScript language options
  parserOptions: {
    ecmaVersion: 2021, // Allows parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  
  // Custom ESLint rule configurations
  rules: {
    'indent': ['error', 2], // Enforce 2-space indentation
    'linebreak-style': ['error', 'unix'], // Enforce Unix-style line breaks
    'quotes': ['error', 'single'], // Enforce single quotes
    'semi': ['error', 'always'], // Enforce semicolons at the end of statements
    'no-console': ['warn', { 'allow': ['warn', 'error'] }], // Warn about console use except for warn and error
    'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }], // Error for unused variables except those starting with underscore
    
    // Jest plugin rules
    'jest/no-disabled-tests': 'warn', // Warn about skipped tests
    'jest/no-focused-tests': 'error', // Error for tests focused with .only
    'jest/no-identical-title': 'error', // Error for duplicate test titles
    'jest/prefer-to-have-length': 'warn', // Suggest using toHaveLength
    'jest/valid-expect': 'error', // Enforce valid expect() usage
  },
  
  // Patterns to ignore when linting
  ignorePatterns: [
    'node_modules/',
    'coverage/',
    '*.min.js',
  ],
  
  // Configuration overrides for specific file patterns
  overrides: [
    {
      files: ['**/__tests__/**/*.js'], // Override for test files
      rules: {
        'jest/expect-expect': 'error', // Enforce test cases to have expect assertions
        'jest/no-test-callback': 'error', // Disallow the use of test callbacks
      },
    },
  ],
};