#!/bin/sh
# healthcheck.sh - Health check script for Node.js Hello World application
# 
# This script verifies that the Node.js Hello World application is running properly
# by checking the server availability and the /hello endpoint response.

# Set shell options for better error handling
set -o nounset  # Error on unset variables
set -e          # Exit on error

# Default values for global variables
HOST=${HOST:-"localhost"}
PORT=${PORT:-3000}
TIMEOUT=${TIMEOUT:-5}
EXPECTED_RESPONSE=${EXPECTED_RESPONSE:-"Hello world"}
VERBOSE=0
MAX_RESPONSE_TIME=50  # Maximum acceptable response time in milliseconds

# Print usage information
print_usage() {
  echo "Usage: $(basename $0) [options]"
  echo ""
  echo "Health check script for Node.js Hello World application"
  echo ""
  echo "Options:"
  echo "  -h, --host HOST     Host address to check (default: ${HOST})"
  echo "  -p, --port PORT     Port to check (default: ${PORT})"
  echo "  -t, --timeout SEC   Connection timeout in seconds (default: ${TIMEOUT})"
  echo "  -e, --expected TXT  Expected response text (default: '${EXPECTED_RESPONSE}')"
  echo "  -v, --verbose       Enable verbose output"
  echo "  --help              Display this help message and exit"
  echo ""
  echo "Examples:"
  echo "  $(basename $0)                    # Run with default settings"
  echo "  $(basename $0) -h 127.0.0.1 -p 8080   # Check server on 127.0.0.1:8080"
  echo "  HOST=example.com PORT=8080 $(basename $0)  # Use environment variables"
  echo "  $(basename $0) -t 10              # Use 10 second timeout"
  echo ""
  echo "Exit codes:"
  echo "  0 - Server is healthy"
  echo "  1 - Dependency check failed (curl not installed)"
  echo "  2 - Server is not running or unreachable"
  echo "  3 - Hello endpoint returned unexpected response"
}

# Parse command line arguments
parse_arguments() {
  while [ $# -gt 0 ]; do
    case "$1" in
      -h|--host)
        HOST="$2"
        shift 2
        ;;
      -p|--port)
        PORT="$2"
        shift 2
        ;;
      -t|--timeout)
        TIMEOUT="$2"
        shift 2
        ;;
      -e|--expected)
        EXPECTED_RESPONSE="$2"
        shift 2
        ;;
      -v|--verbose)
        VERBOSE=1
        shift
        ;;
      --help)
        print_usage
        exit 0
        ;;
      *)
        echo "Error: Unknown option '$1'" >&2
        print_usage
        exit 1
        ;;
    esac
  done

  # Validate PORT is a number
  if ! echo "$PORT" | grep -qE '^[0-9]+$'; then
    echo "Error: PORT must be a number" >&2
    exit 1
  fi

  # Validate TIMEOUT is a number
  if ! echo "$TIMEOUT" | grep -qE '^[0-9]+$'; then
    echo "Error: TIMEOUT must be a number" >&2
    exit 1
  fi
}

# Check if required dependencies are installed
check_dependencies() {
  if ! command -v curl >/dev/null 2>&1; then
    echo "Error: curl is not installed. Please install curl to run this script." >&2
    return 1
  fi
  
  if [ $VERBOSE -eq 1 ]; then
    echo "Dependency check passed: curl is installed."
  fi
  
  return 0
}

# Check if the server is running
check_server_running() {
  if [ $VERBOSE -eq 1 ]; then
    echo "Checking if server is running at ${HOST}:${PORT}..."
  fi
  
  # Try to connect to the server with timeout
  if ! curl -s --head --fail --max-time "$TIMEOUT" "http://${HOST}:${PORT}" >/dev/null 2>&1; then
    echo "Error: Server is not running or is unreachable at ${HOST}:${PORT}" >&2
    return 2
  fi
  
  if [ $VERBOSE -eq 1 ]; then
    echo "Server is running at ${HOST}:${PORT}."
  fi
  
  return 0
}

# Check if the /hello endpoint returns the expected response
check_hello_endpoint() {
  if [ $VERBOSE -eq 1 ]; then
    echo "Checking /hello endpoint response..."
  fi
  
  # Get response from the /hello endpoint
  RESPONSE=$(curl -s --max-time "$TIMEOUT" "http://${HOST}:${PORT}/hello")
  
  # Check exit status of curl command
  if [ $? -ne 0 ]; then
    echo "Error: Failed to get response from /hello endpoint" >&2
    return 2
  fi
  
  # Check if response matches expected value
  if [ "$RESPONSE" != "$EXPECTED_RESPONSE" ]; then
    echo "Error: Unexpected response from /hello endpoint" >&2
    echo "  Expected: '$EXPECTED_RESPONSE'" >&2
    echo "  Actual:   '$RESPONSE'" >&2
    return 3
  fi
  
  if [ $VERBOSE -eq 1 ]; then
    echo "Hello endpoint returned expected response: '$RESPONSE'"
  fi
  
  return 0
}

# Check if the response time is within acceptable limits
check_response_time() {
  if [ $VERBOSE -eq 1 ]; then
    echo "Checking response time..."
  fi
  
  # Create a temporary file for curl timing data
  TIMING_FILE=$(mktemp)
  
  # Measure response time using curl
  curl -s -o /dev/null -w "%{time_total}" \
    --max-time "$TIMEOUT" \
    "http://${HOST}:${PORT}/hello" > "$TIMING_FILE" 2>/dev/null
  
  # Check exit status of curl command
  if [ $? -ne 0 ]; then
    rm -f "$TIMING_FILE"
    echo "Error: Failed to measure response time" >&2
    return 0  # Not critical, continue with warnings
  fi
  
  # Read timing data and convert to milliseconds (curl returns seconds as float)
  TIME_SEC=$(cat "$TIMING_FILE")
  rm -f "$TIMING_FILE"
  
  # Convert to milliseconds (multiply by 1000)
  TIME_MS=$(echo "$TIME_SEC * 1000" | bc -l | awk '{printf "%.0f", $0}')
  
  if [ $VERBOSE -eq 1 ]; then
    echo "Response time: ${TIME_MS}ms (threshold: ${MAX_RESPONSE_TIME}ms)"
  fi
  
  # Check if response time exceeds threshold
  if [ "$TIME_MS" -gt "$MAX_RESPONSE_TIME" ]; then
    echo "Warning: Response time (${TIME_MS}ms) exceeds threshold (${MAX_RESPONSE_TIME}ms)" >&2
    # Return 0 as this is a warning, not a critical failure
    return 0
  fi
  
  return 0
}

# Main function
main() {
  local EXIT_CODE=0
  
  # Parse command line arguments
  parse_arguments "$@"
  
  # Check dependencies
  if ! check_dependencies; then
    return 1
  fi
  
  # Check if server is running
  if ! check_server_running; then
    return 2
  fi
  
  # Check hello endpoint
  if ! check_hello_endpoint; then
    return 3
  fi
  
  # Check response time
  check_response_time
  
  # If we got here, all checks passed
  echo "Health check passed: Node.js Hello World application is healthy."
  
  return 0
}

# Run the main function with all arguments
main "$@"
exit $?