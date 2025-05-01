# Build stage for installing dependencies and preparing the application
FROM node:18-alpine AS build

# Set working directory in the container
WORKDIR /app

# Copy package files for dependency installation
# This is done before copying the application code to leverage Docker's layer caching
COPY package*.json ./

# Install only production dependencies to keep the image size small
# Use 'npm ci' instead of 'npm install' for faster, more reliable builds
RUN npm ci --only=production

# Copy application source code
COPY . .

# Set environment variable
ENV NODE_ENV=production

# Final stage for creating a minimal production image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Create a non-root user to run the application (security best practice)
RUN addgroup -g 1000 nodeuser && \
    adduser -u 1000 -G nodeuser -s /bin/sh -D nodeuser && \
    mkdir -p /app/logs && \
    chown -R nodeuser:nodeuser /app

# Copy built application from build stage
COPY --from=build --chown=nodeuser:nodeuser /app ./

# Copy start script from host to container
COPY --chown=nodeuser:nodeuser infrastructure/scripts/start.sh ./start.sh

# Make start script executable
RUN chmod +x ./start.sh

# Define volume for logs
VOLUME ["/app/logs"]

# Expose port for HTTP access
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Switch to non-root user for better security
USER nodeuser

# Configure health check to verify application availability
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/hello || exit 1

# Set entry point to the start script
ENTRYPOINT ["./start.sh"]