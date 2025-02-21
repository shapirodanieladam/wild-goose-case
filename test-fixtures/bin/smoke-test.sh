#!/bin/bash

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo_step() {
    echo -e "\n${BLUE}=== $1 ===${NC}"
}

echo_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

echo_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Wait for services to be ready
echo_step "Waiting for services to be ready..."
sleep 5

# Test S3-Data Service
echo_step "Testing S3-Data Service (Direct) - Port 9090"

echo "Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s http://localhost:9090/health)
if [[ $HEALTH_RESPONSE == *"healthy"* ]]; then
    echo_success "Health check passed"
else
    echo_error "Health check failed"
    exit 1
fi

echo "Testing data creation..."
CREATE_RESPONSE=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d '{"name":"test-record","value":"test-value"}' \
    http://localhost:9090/data)
echo_success "Created record in S3: $CREATE_RESPONSE"

# Extract ID for later use
ID=$(echo $CREATE_RESPONSE | sed 's/.*"id":"\([^"]*\).*/\1/')

echo "Testing single record retrieval..."
RECORD_RESPONSE=$(curl -s http://localhost:9090/data/$ID)
echo_success "Retrieved record from S3: $RECORD_RESPONSE"

# Test S2-API Service
echo_step "Testing S2-API Service (Gateway) - Port 8080"

echo "Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s http://localhost:8080/health)
if [[ $HEALTH_RESPONSE == *"healthy"* ]]; then
    echo_success "Health check passed"
else
    echo_error "Health check failed"
    exit 1
fi

echo "Testing protected record creation..."
GATEWAY_CREATE=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -H "X-API-Key: test-api-key" \
    -d '{"name":"gateway-test","value":"from-gateway"}' \
    http://localhost:8080/api/records)
echo_success "Created record through gateway: $GATEWAY_CREATE"

# Extract ID from gateway creation
GATEWAY_ID=$(echo $GATEWAY_CREATE | sed 's/.*"id":"\([^"]*\).*/\1/')

echo "Testing record retrieval through gateway..."
GATEWAY_GET=$(curl -s http://localhost:8080/api/records/$GATEWAY_ID)
echo_success "Retrieved record through gateway: $GATEWAY_GET"

echo "Testing internal stats endpoint..."
STATS=$(curl -s -H "X-API-Key: test-api-key" http://localhost:8080/internal/records/stats)
echo_success "Retrieved stats: $STATS"

# Test Error Cases
echo_step "Testing Error Cases"

echo "Testing missing API key (should fail)..."
ERROR_RESPONSE=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d '{"name":"test","value":"data"}' \
    http://localhost:8080/api/records)
if [[ $ERROR_RESPONSE == *"Invalid or missing API key"* ]]; then
    echo_success "API key check working as expected"
else
    echo_error "API key check failed"
    exit 1
fi

echo "Testing invalid record ID (should return 404)..."
ERROR_RESPONSE=$(curl -s http://localhost:8080/api/records/nonexistent-id)
if [[ $ERROR_RESPONSE == *"Record not found"* ]]; then
    echo_success "404 handling working as expected"
else
    echo_error "404 handling failed"
    exit 1
fi

echo "Testing invalid request body (should fail validation)..."
ERROR_RESPONSE=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -H "X-API-Key: test-api-key" \
    -d '{"name":""}' \
    http://localhost:8080/api/records)
if [[ $ERROR_RESPONSE == *"Name and value are required"* ]]; then
    echo_success "Validation working as expected"
else
    echo_error "Validation failed"
    exit 1
fi

echo_step "All tests completed successfully! 🎉"