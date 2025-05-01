/**
 * Unit tests for hello controller
 * 
 * Tests the functionality of the hello controller that handles 
 * requests to the /hello endpoint and verifies it returns
 * the expected response according to specifications.
 * 
 * @version jest 29.0.0
 */

// Import the controller function to be tested
const { getHello } = require('../../../controllers/hello.controller');

// Import the logger for verifying logging behavior
const logger = require('../../../utils/logger');

// Mock the logger to prevent actual console output during tests
jest.mock('../../../utils/logger', () => ({
  debug: jest.fn()
}));

/**
 * Creates a mock Express response object with status, set, and send methods for testing
 * 
 * @returns {Object} Mock Express response object with jest mock functions
 */
function createMockResponse() {
  const res = {
    status: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis()
  };
  return res;
}

describe('Hello Controller Tests', () => {
  
  beforeEach(() => {
    // Reset all mocks before each test
    jest.resetAllMocks();
  });
  
  test('should return \'Hello world\' with status 200 and correct content type', () => {
    // Create mock request object
    const req = { url: '/hello' };
    
    // Create mock response object using createMockResponse helper
    const res = createMockResponse();
    
    // Create mock next function
    const next = jest.fn();
    
    // Call getHello with mock request, response, and next
    getHello(req, res, next);
    
    // Verify response.status was called with 200
    expect(res.status).toHaveBeenCalledWith(200);
    
    // Verify response.set was called with 'Content-Type' and 'text/plain'
    expect(res.set).toHaveBeenCalledWith('Content-Type', 'text/plain');
    
    // Verify response.send was called with 'Hello world'
    expect(res.send).toHaveBeenCalledWith('Hello world');
    
    // Verify logger.debug was called with appropriate message
    expect(logger.debug).toHaveBeenCalledWith('Processing request to /hello endpoint', { path: '/hello' });
  });
  
  test('should not call next function when successful', () => {
    // Create mock request object
    const req = { url: '/hello' };
    
    // Create mock response object using createMockResponse helper
    const res = createMockResponse();
    
    // Create mock next function using jest.fn()
    const next = jest.fn();
    
    // Call getHello with mock request, response, and next
    getHello(req, res, next);
    
    // Verify next function was not called
    expect(next).not.toHaveBeenCalled();
  });
});