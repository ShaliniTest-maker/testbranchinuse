# Infrastructure Documentation

This directory contains infrastructure configuration files and scripts for deploying and running the Node.js Hello World application in various environments. The infrastructure is designed to be minimal while following best practices for containerization and deployment.

- [Overview](#overview)
- [Directory Structure](#directory-structure)
- [Docker Configuration](#docker-configuration)
- [Docker Compose Setup](#docker-compose-setup)
- [Nginx Configuration](#nginx-configuration)
- [Utility Scripts](#utility-scripts)
- [Deployment Options](#deployment-options)
- [Monitoring and Health Checks](#monitoring-and-health-checks)
- [Troubleshooting](#troubleshooting)

## Overview

The infrastructure for this Node.js Hello World application is intentionally minimal, focusing on providing a clean, secure, and production-ready deployment environment. The configuration supports:

- Containerized deployment using Docker
- Multi-container setup with Docker Compose
- Optional Nginx reverse proxy for improved security and performance
- Health checks for monitoring application status
- Environment configuration for different deployment scenarios
- Proper error handling and logging

These components are designed to work together while maintaining flexibility for different deployment needs.

## Directory Structure

```
infrastructure/
├── Dockerfile              # Container definition for the Node.js application
├── docker-compose.yml      # Multi-container orchestration configuration
├── nginx/                  # Nginx configuration files
│   └── default.conf        # Default Nginx server configuration
├── scripts/                # Utility scripts
│   ├── start.sh           # Application startup script
│   └── healthcheck.sh     # Health check script
└── README.md              # This documentation file
```

## Docker Configuration

The `Dockerfile` defines a multi-stage build process for creating a lightweight, secure container image for the Node.js Hello World application.

### Key Features

- Uses Node.js 18 Alpine as the base image for minimal size
- Implements multi-stage build to reduce final image size
- Installs only production dependencies
- Runs as a non-root user for improved security
- Includes health check configuration
- Properly handles signals for graceful shutdown

### Building the Image

```bash
# From the project root directory
docker build -t hello-node -f infrastructure/Dockerfile .
```

### Running the Container

```bash
# Run with default settings
docker run -p 3000:3000 hello-node

# Run with custom port
docker run -p 8080:3000 -e PORT=3000 hello-node

# Run with all environment variables
docker run -p 8080:3000 \
  -e PORT=3000 \
  -e HOST=0.0.0.0 \
  -e NODE_ENV=production \
  hello-node
```

## Docker Compose Setup

The `docker-compose.yml` file defines a multi-container environment with the Node.js application and an optional Nginx reverse proxy.

### Services

- **app**: The Node.js Hello World application
- **nginx**: (Optional) Nginx reverse proxy for improved security and performance

### Networks

- **hello-world-network**: Internal bridge network for service communication

### Volumes

- **logs**: Volume for persisting application logs

### Running with Docker Compose

```bash
# Start all services
docker-compose -f infrastructure/docker-compose.yml up -d

# Start only the Node.js application without Nginx
docker-compose -f infrastructure/docker-compose.yml up -d app

# View logs
docker-compose -f infrastructure/docker-compose.yml logs -f

# Stop all services
docker-compose -f infrastructure/docker-compose.yml down
```

### Environment Profiles

The Docker Compose configuration supports different deployment profiles:

- **Development**: Mounts source code for live reloading during development
- **Production**: Optimized for production deployment
- **App-only**: Runs only the Node.js application without Nginx

```bash
# Run with development profile
docker-compose -f infrastructure/docker-compose.yml --profile development up -d
```

## Nginx Configuration

The `nginx/default.conf` file configures Nginx as a reverse proxy for the Node.js application, providing additional security, performance, and reliability benefits.

### Key Features

- Proxies requests to the Node.js application
- Adds security headers to prevent common web vulnerabilities
- Provides custom error handling
- Includes a dedicated health check endpoint
- Optimizes performance with gzip compression
- Properly forwards client IP and protocol information

### Endpoints

- **/** - Proxies all requests to the Node.js application
- **/hello** - Specifically configured for the Hello World endpoint
- **/health** - Returns a 200 OK response for health monitoring

### Custom Error Pages

- **404** - Not Found
- **500, 502, 503, 504** - Server errors

### Security Headers

- **X-Content-Type-Options**: nosniff
- **X-Frame-Options**: DENY
- **Content-Security-Policy**: Restricts resource loading

## Utility Scripts

The `scripts/` directory contains utility scripts for running and monitoring the application.

### start.sh

The `start.sh` script handles the application startup process:

- Sets up environment variables with defaults if not provided
- Performs pre-flight checks to ensure dependencies are available
- Creates necessary directories (e.g., logs)
- Starts the Node.js application
- Handles signals for graceful shutdown

```bash
# Usage examples
./scripts/start.sh                     # Start with default settings
PORT=8080 ./scripts/start.sh          # Start on custom port
NODE_ENV=development ./scripts/start.sh # Start in development mode
```

### healthcheck.sh

The `healthcheck.sh` script performs health checks on the application:

- Verifies the server is running and accessible
- Checks if the /hello endpoint returns the expected response
- Optionally measures response time
- Returns appropriate exit codes for health status

```bash
# Usage examples
./scripts/healthcheck.sh                      # Check default localhost:3000
./scripts/healthcheck.sh -h 127.0.0.1 -p 8080 # Check custom host and port
./scripts/healthcheck.sh -t 10                # Use 10-second timeout
```

## Deployment Options

The application can be deployed in various environments:

### Local Development

```bash
# Run directly with Node.js
npm start

# Run with nodemon for auto-restart during development
npm run dev
```

### Basic Docker Deployment

```bash
# Build and run with Docker
docker build -t hello-node -f infrastructure/Dockerfile .
docker run -p 3000:3000 hello-node
```

### Docker Compose Deployment

```bash
# Run with Docker Compose
docker-compose -f infrastructure/docker-compose.yml up -d
```

### Cloud Deployment

The containerized application can be deployed to various cloud platforms:

#### AWS

- **ECS/Fargate**: Deploy as a containerized service
- **Elastic Beanstalk**: Upload the source code directly

#### Google Cloud

- **Cloud Run**: Deploy as a containerized service
- **GKE**: Deploy to Kubernetes cluster

#### Azure

- **App Service**: Deploy as a containerized web app
- **AKS**: Deploy to Kubernetes cluster

#### Other Platforms

- **Heroku**: Deploy using the Heroku container registry
- **Digital Ocean**: Deploy to App Platform or Kubernetes

Refer to each platform's documentation for specific deployment instructions.

## Monitoring and Health Checks

### Built-in Health Checks

The application includes built-in health check mechanisms:

- **Docker health check**: Configured in the Dockerfile to periodically check application health
- **Docker Compose health check**: Configured for both app and nginx services
- **Nginx /health endpoint**: Returns 200 OK when Nginx is running
- **Application /hello endpoint**: Verifies the application is functioning correctly

### Using the Health Check Script

The `healthcheck.sh` script can be used for external monitoring:

```bash
# Basic health check
./scripts/healthcheck.sh

# Check with custom parameters
./scripts/healthcheck.sh -h example.com -p 80
```

### Monitoring Recommendations

For production deployments, consider these monitoring approaches:

- **Basic Monitoring**: Use the health check script with a cron job
- **Cloud Monitoring**: Use AWS CloudWatch, Google Cloud Monitoring, or Azure Monitor
- **Third-party Services**: Use services like Datadog, New Relic, or Prometheus
- **Uptime Monitoring**: Use UptimeRobot, Pingdom, or StatusCake

### Logging

Logs are written to the following locations:

- **Application logs**: `/app/logs/` in the container, mounted to `./logs/` with Docker Compose
- **Nginx access logs**: `/var/log/nginx/access.log` in the Nginx container
- **Nginx error logs**: `/var/log/nginx/error.log` in the Nginx container

For production deployments, consider forwarding logs to a centralized logging system.

## Troubleshooting

### Common Issues

#### Container Won't Start

- Check if the port is already in use: `lsof -i :3000`
- Verify environment variables are set correctly
- Check container logs: `docker logs <container_id>`

#### Health Check Failing

- Verify the application is running: `curl http://localhost:3000/hello`
- Check application logs for errors
- Ensure network connectivity between services

#### Nginx Returns 502 Bad Gateway

- Verify the Node.js application is running
- Check Nginx configuration for correct upstream address
- Ensure the internal network is functioning

### Debugging

```bash
# Check container status
docker ps -a

# View container logs
docker logs <container_id>

# Inspect container
docker inspect <container_id>

# Execute commands in container
docker exec -it <container_id> /bin/sh

# Check network connectivity
docker exec -it <container_id> wget -O- http://app:3000/hello
```

### Getting Help

If you encounter issues not covered here, please:

1. Check the main project README.md for additional information
2. Review the application logs for error messages
3. Open an issue in the project repository with detailed information about the problem