/**
 * Integration tests for the /hello endpoint of the Node.js HTTP server application.
 * 
 * This file contains tests that verify the complete request-response cycle,
 * ensuring that the endpoint returns the expected responses for various scenarios.
 * It validates the requirements for the Hello endpoint (F-002) and Error handling (F-004).
 */

// Import supertest for HTTP assertions
// @version ^6.3.3
const supertest = require('supertest');

// Import the Express application instance
const app = require('../../app');

/**
 * Creates a supertest request object for the Express application
 * 
 * @returns {Object} Supertest request object for making HTTP requests to the app
 */
const createRequest = () => {
  return supertest(app);
};

describe('Hello Route Integration Tests', () => {
  // Create a supertest request object for the Express application
  let agent;

  beforeAll(() => {
    // Initialize the supertest agent using the helper function
    agent = createRequest();
  });

  /**
   * Tests that the /hello endpoint returns "Hello world" with correct status and content-type
   * 
   * Validates:
   * - F-002-RQ-002: Return "Hello world" as plain text
   * - F-002-RQ-003: Return HTTP status code 200
   * - F-002-RQ-004: Set Content-Type header to "text/plain"
   */
  test('GET /hello should return "Hello world" with status 200', async () => {
    await agent
      .get('/hello')
      .expect(200)
      .expect('Content-Type', /text\/plain/)
      .expect('Hello world');
  });

  /**
   * Tests that requests to undefined routes return 404 Not Found
   * 
   * Validates:
   * - F-004-RQ-002: Return 404 status for undefined routes
   */
  test('GET /unknown should return 404 status', async () => {
    await agent
      .get('/unknown')
      .expect(404)
      .expect('Content-Type', /text\/plain/)
      .expect('Not Found');
  });

  /**
   * Tests that non-GET requests to /hello return 405 Method Not Allowed
   * 
   * This ensures the endpoint only responds to the appropriate HTTP method.
   */
  test('POST /hello should return 405 Method Not Allowed', async () => {
    await agent
      .post('/hello')
      .expect(405)
      .expect('Content-Type', /text\/plain/)
      .expect('Method Not Allowed');
  });
});