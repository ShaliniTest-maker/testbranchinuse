# Node.js Hello World Server

A simple Node.js HTTP server application that exposes a single REST endpoint `/hello` which returns "Hello world" to clients.

## Overview

This project demonstrates fundamental Node.js HTTP server concepts with minimal complexity. It serves as a learning tool and reference implementation for basic HTTP service patterns in Node.js.

The server exposes a single REST endpoint at `/hello` that returns a plain text "Hello world" response with a 200 status code.

## Features

- HTTP server implementation using Node.js built-in HTTP module
- Single REST endpoint (`/hello`) returning text response
- Configurable server settings (port, host)
- Basic error handling
- Minimal dependencies (zero external packages)
- Graceful shutdown handling

## Prerequisites

- Node.js (v14.x or higher)
- npm (v6.x or higher)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/example/node-hello-world.git
   cd node-hello-world/src/backend
   ```

2. Install dependencies:
   ```bash
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

Start the server with automatic restart on file changes (requires nodemon):

```bash
npm run dev
```

### Production Mode

Start the server in production mode:

```bash
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

## Project Structure

```
src/backend/
├── server.js              # Main application file with HTTP server implementation
├── config.js              # Configuration management
├── route-handler.js       # Request routing and response handling
├── error-handler.js       # Error handling utilities
├── package.json           # Project metadata and dependencies
└── README.md              # This documentation file
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
npm test
```

### Running Unit Tests Only

```bash
npm run test:unit
```

### Running Integration Tests Only

```bash
npm run test:integration
```

### Running Tests with Coverage Report

```bash
npm run test:coverage
```

## Code Quality

### Linting

Check code quality with ESLint:

```bash
npm run lint
```

Automatically fix linting issues where possible:

```bash
npm run lint:fix
```

## Deployment

This application can be deployed in various environments:

### Basic Deployment

1. Install Node.js on your server
2. Copy the application files
3. Install dependencies with `npm install --production`
4. Set environment variables as needed
5. Start the server with `npm start`

### Docker Deployment

A simple Dockerfile for this application would look like:

```Dockerfile
FROM node:14-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

Build and run with Docker:

```bash
docker build -t node-hello-world .
docker run -p 3000:3000 node-hello-world
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.