# Node.js Hello World Server

A simple Node.js HTTP server application that exposes a single REST endpoint `/hello` which returns "Hello world" to clients.

![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)

## Overview

This project demonstrates fundamental Node.js HTTP server concepts with minimal complexity. It serves as a learning tool and reference implementation for basic HTTP service patterns in Node.js.

The server exposes a single REST endpoint at `/hello` that returns a plain text "Hello world" response with a 200 status code.

### Value Proposition

- **Educational Tool**: Perfect for developers learning Node.js server concepts
- **Reference Implementation**: Demonstrates best practices for Node.js HTTP servers
- **Starter Template**: Can be used as a foundation for more complex applications
- **Minimal Complexity**: Focuses on core functionality without unnecessary abstractions

## Features

- HTTP server implementation using Node.js core modules
- Single REST endpoint (`/hello`) returning text response
- Configurable server settings (port, host)
- Basic error handling for undefined routes
- Proper HTTP status codes and content types
- Graceful shutdown handling
- Comprehensive logging

## Prerequisites

- Node.js (v14.x or higher)
- npm (v6.x or higher)

## Project Structure

```
├── .github/                # GitHub configuration files
│   ├── workflows/          # GitHub Actions workflows
│   └── ISSUE_TEMPLATE/     # Issue templates
├── infrastructure/         # Deployment and infrastructure files
│   ├── Dockerfile          # Docker container definition
│   ├── docker-compose.yml  # Multi-container setup
│   ├── nginx/              # Nginx configuration
│   ├── scripts/            # Utility scripts
│   └── README.md           # Infrastructure documentation
├── src/                    # Source code
│   └── backend/            # Backend application code
│       ├── __tests__/      # Test files
│       ├── config/         # Configuration files
│       ├── controllers/    # Request handlers
│       ├── middleware/     # Express middleware
│       ├── routes/         # Route definitions
│       ├── server/         # Server utilities
│       ├── utils/          # Utility functions
│       ├── app.js          # Express application setup
│       ├── index.js        # Application entry point
│       └── README.md       # Backend documentation
├── .gitignore              # Git ignore file
├── LICENSE                 # License file
└── README.md              # This documentation file
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/example/node-hello-world.git
   cd node-hello-world
   ```

2. Install dependencies:
   ```bash
   cd src/backend
   npm install
   ```

## Configuration

The application can be configured using environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3000 | TCP port on which the HTTP server listens |
| HOST | 0.0.0.0 | Network interface to bind the server to |
| NODE_ENV | development | Environment mode for the application |

## Usage

### Development Mode

Start the server with automatic restart on file changes:

```bash
cd src/backend
npm run dev
```

### Production Mode

Start the server in production mode:

```bash
cd src/backend
npm start
```

### Testing the Endpoint

Once the server is running, you can test the endpoint using curl:

```bash
curl http://localhost:3000/hello
```

Expected response:
```
Hello world
```

## API Documentation

### GET /hello

Returns a simple "Hello world" message.

**Request:**
- Method: GET
- Path: /hello
- Headers: None required
- Body: None

**Response:**
- Status Code: 200 OK
- Content-Type: text/plain
- Body: "Hello world"

**Error Responses:**
- 404 Not Found: If the path is not `/hello`
- 405 Method Not Allowed: If a method other than GET is used on `/hello`
- 500 Internal Server Error: If an unexpected error occurs

## Testing

### Running All Tests

```bash
cd src/backend
npm test
```

### Running Unit Tests Only

```bash
cd src/backend
npm run test:unit
```

### Running Integration Tests Only

```bash
cd src/backend
npm run test:integration
```

### Running Tests with Coverage Report

```bash
cd src/backend
npm run test:coverage
```

## Deployment

This application can be deployed in various environments. For detailed deployment instructions, see the [infrastructure documentation](./infrastructure/README.md).

### Quick Docker Deployment

```bash
# Build and run with Docker
docker build -t hello-node -f infrastructure/Dockerfile .
docker run -p 3000:3000 hello-node

# Or using Docker Compose
docker-compose -f infrastructure/docker-compose.yml up
```

## Performance

The application is designed to be lightweight and efficient:

- **Response Time**: < 50ms for the `/hello` endpoint
- **Memory Usage**: < 50MB in typical operation
- **Startup Time**: < 1 second

These metrics make the application suitable for educational purposes and as a starting point for more complex implementations.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code passes all tests and linting checks before submitting.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Acknowledgments

- Node.js community for creating an excellent runtime
- Express.js team for inspiration on HTTP server patterns
- All contributors who help improve this project