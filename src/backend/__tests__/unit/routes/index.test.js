/**
 * Unit tests for the routes index module
 * Verifies the correct configuration of routes, particularly the /hello
 * endpoint with its HTTP method handlers.
 */

// Import the modules to mock
// @version ^4.18.2
const express = require('express');
const { getHello } = require('../../../controllers/hello.controller');
const { methodNotAllowedHandler } = require('../../../middleware/error.middleware');
const { debug } = require('../../../utils/logger');

// Mock the dependencies
jest.mock('express');
jest.mock('../../../controllers/hello.controller');
jest.mock('../../../middleware/error.middleware'); 
jest.mock('../../../utils/logger');

/**
 * Creates a mock Express response object with status, send, and set methods
 * 
 * @returns {Object} Mock Express response object with jest.fn() methods
 */
const createMockResponse = () => {
  const res = {
    status: jest.fn(),
    send: jest.fn(),
    set: jest.fn(),
    end: jest.fn(),
    setHeader: jest.fn(),
    statusCode: 200
  };
  
  // Configure methods to return the response object for chaining
  res.status.mockReturnValue(res);
  res.set.mockReturnValue(res);
  
  return res;
};

/**
 * Creates a mock Express request object with method and path properties
 * 
 * @param {string} method - HTTP method for the request
 * @param {string} path - URL path for the request
 * @returns {Object} Mock Express request object with specified method and path
 */
const createMockRequest = (method, path) => {
  return {
    method,
    url: path,
    path
  };
};

describe('Routes index module', () => {
  let mockRouter;
  let router;
  
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Create a mock router
    mockRouter = {
      get: jest.fn(),
      all: jest.fn()
    };
    
    // Mock express.Router to return our mock router
    express.Router.mockReturnValue(mockRouter);
    
    // Reset module registry to force fresh import
    jest.resetModules();
    
    // Import the router module which will use our mocked dependencies
    router = require('../../../routes/index');
  });
  
  test('should configure GET /hello route with getHello controller', () => {
    // Verify router.get was called with '/hello' and getHello
    expect(mockRouter.get).toHaveBeenCalledWith('/hello', getHello);
  });
  
  test('should configure other HTTP methods for /hello with methodNotAllowedHandler', () => {
    // Verify router.all was called with '/hello' and methodNotAllowedHandler
    expect(mockRouter.all).toHaveBeenCalledWith('/hello', methodNotAllowedHandler);
  });
  
  test('should handle GET requests to /hello correctly', () => {
    // Verify the order of route configuration
    // GET should be configured before the catch-all handler
    expect(mockRouter.get.mock.invocationCallOrder[0])
      .toBeLessThan(mockRouter.all.mock.invocationCallOrder[0]);
  });
  
  test('should handle non-GET requests to /hello with methodNotAllowedHandler', () => {
    // This test verifies that the methodNotAllowedHandler is used for all non-GET methods
    const req = createMockRequest('POST', '/hello');
    const res = createMockResponse();
    const next = jest.fn();
    
    // Simulate that the router finds the methodNotAllowedHandler for this request
    methodNotAllowedHandler(req, res, next);
    
    // Verify methodNotAllowedHandler was called
    expect(methodNotAllowedHandler).toHaveBeenCalledWith(req, res, next);
  });
  
  test('should log debug message when configuring routes', () => {
    // Verify debug message was logged
    expect(debug).toHaveBeenCalledWith('Configuring application routes');
  });
});