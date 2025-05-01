#!/bin/sh
# start.sh - Startup script for Node.js Hello World application
# 
# This script handles the startup process for the Node.js application,
# including environment setup, pre-flight checks, and application launch.

# Exit immediately if a command exits with a non-zero status
set -e

# Function to set up environment variables with defaults
setup_environment() {
  # Set PORT environment variable if not already set (default: 3000)
  if [ -z "${PORT}" ]; then
    export PORT=3000
  fi

  # Set HOST environment variable if not already set (default: 0.0.0.0)
  if [ -z "${HOST}" ]; then
    export HOST="0.0.0.0"
  fi

  # Set NODE_ENV environment variable if not already set (default: production)
  if [ -z "${NODE_ENV}" ]; then
    export NODE_ENV="production"
  fi

  # Print configured environment values for debugging
  echo "Environment Configuration:"
  echo "  PORT: ${PORT}"
  echo "  HOST: ${HOST}"
  echo "  NODE_ENV: ${NODE_ENV}"
}

# Function to verify that Node.js is installed and available
check_node_installation() {
  echo "Checking Node.js installation..."
  
  # Check if node command is available
  if ! command -v node >/dev/null 2>&1; then
    echo "Error: Node.js is not installed or not in PATH" >&2
    return 1
  fi

  # Check Node.js version to ensure compatibility
  NODE_VERSION=$(node -v | cut -d 'v' -f 2)
  NODE_MAJOR_VERSION=$(echo "${NODE_VERSION}" | cut -d '.' -f 1)
  
  if [ "${NODE_MAJOR_VERSION}" -lt 14 ]; then
    echo "Warning: Node.js version ${NODE_VERSION} is below recommended (v14.x LTS or higher)" >&2
  else
    echo "Node.js version ${NODE_VERSION} detected"
  fi

  return 0
}

# Function to verify that required application files exist
check_application_files() {
  echo "Checking application files..."
  
  # Check if package.json exists
  if [ ! -f "./package.json" ]; then
    echo "Error: package.json not found in the current directory" >&2
    return 1
  fi

  # Check for server.js or index.js (default main files)
  if [ -f "./server.js" ]; then
    MAIN_FILE="server.js"
  elif [ -f "./index.js" ]; then
    MAIN_FILE="index.js"
  else
    # Try to determine the main file from package.json if jq is available
    if command -v jq >/dev/null 2>&1; then
      MAIN_FILE=$(jq -r '.main // ""' ./package.json)
      if [ -z "${MAIN_FILE}" ] || [ ! -f "./${MAIN_FILE}" ]; then
        echo "Error: Could not determine main file from package.json" >&2
        return 1
      fi
    else
      echo "Error: Neither server.js nor index.js found, and jq not available to check package.json" >&2
      return 1
    fi
  fi

  echo "Main application file found: ${MAIN_FILE}"
  export MAIN_FILE="${MAIN_FILE}"
  return 0
}

# Function to create log directory if it doesn't exist
create_log_directory() {
  # For container environments, logs should go to stdout/stderr
  # This function is mainly for non-containerized environments
  
  # Check if we're running in a container (common container detection)
  if [ -f "/.dockerenv" ] || [ -f "/run/.containerenv" ]; then
    echo "Container environment detected, skipping log directory creation"
    return 0
  fi
  
  echo "Setting up log directory..."
  
  # Check if logs directory exists
  if [ ! -d "./logs" ]; then
    echo "Creating logs directory..."
    mkdir -p ./logs
  fi

  # Set appropriate permissions on logs directory
  chmod 755 ./logs
  echo "Log directory setup complete"
}

# Function to start the Node.js application
start_application() {
  echo "Starting Node.js Hello World application..."
  echo "  - Listening on: http://${HOST}:${PORT}"
  echo "  - Environment: ${NODE_ENV}"
  echo "  - Main file: ${MAIN_FILE}"
  
  # Check if we're running in a container
  IN_CONTAINER=0
  if [ -f "/.dockerenv" ] || [ -f "/run/.containerenv" ]; then
    IN_CONTAINER=1
  fi
  
  # Set up signal handling for graceful shutdown
  trap 'echo "Received SIGTERM signal, shutting down..."; exit 143' TERM
  trap 'echo "Received SIGINT signal, shutting down..."; exit 130' INT

  # Start the application with appropriate configuration
  if [ ${IN_CONTAINER} -eq 1 ] || [ "${NODE_ENV}" = "development" ]; then
    # In container or development mode, output to console
    echo "Starting with console output"
    exec node "${MAIN_FILE}"
  else
    # In production mode (not in container), log to files
    echo "Starting with file logging"
    exec node "${MAIN_FILE}" > ./logs/app.log 2> ./logs/error.log
  fi
  
  # This should not be reached due to exec, but just in case
  return $?
}

# Main function that orchestrates the startup process
main() {
  # Call setup_environment function
  setup_environment
  
  # Call check_node_installation function
  check_node_installation
  NODE_CHECK_RESULT=$?
  
  # Exit if Node.js check fails
  if [ ${NODE_CHECK_RESULT} -ne 0 ]; then
    echo "Node.js pre-flight check failed, exiting" >&2
    return ${NODE_CHECK_RESULT}
  fi
  
  # Call check_application_files function
  check_application_files
  FILES_CHECK_RESULT=$?
  
  # Exit if application files check fails
  if [ ${FILES_CHECK_RESULT} -ne 0 ]; then
    echo "Application files check failed, exiting" >&2
    return ${FILES_CHECK_RESULT}
  fi
  
  # Call create_log_directory function
  create_log_directory
  
  # Call start_application function
  start_application
  APP_RESULT=$?
  
  # Return the exit code from start_application
  return ${APP_RESULT}
}

# Execute the main function
main
EXIT_CODE=$?

# Exit with appropriate exit code
exit ${EXIT_CODE}