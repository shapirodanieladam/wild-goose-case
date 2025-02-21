# Wild Goose Case

A test automation framework demonstrating end-to-end testing against a microservices mesh.

## Project Structure

```
.
├── bin/                    # CLI tools and utilities
├── cli-frontend/          # Frontend test automation
├── cli-backend/           # Backend test automation
├── cli-orchestrator/      # Python-based test orchestration
└── test-fixtures/         # Test environment services
    ├── s1-frontend/       # Web frontend (React)
    ├── s2-api/            # API service
    └── s3-data/           # Persistence layer
```

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js (v18+)
- Python 3.8+
- Chrome/Chromium (for UI tests)

### Setting Up the Test Environment

1. Start the test fixtures with live reload:

```bash
cd test-fixtures
docker compose up -d --watch
```

This launches:
- Frontend service (http://localhost:3000)
- API service (http://localhost:3001)
- Data service (http://localhost:3002)

The `--watch` flag enables automatic rebuilding when service files change.

2. Verify the services are running by executing the smoke test script:

```bash
cd test-fixtures
./bin/smoke-test.sh
```

This script performs a comprehensive health check of all services, including:
- Service health verification
- Data creation and retrieval
- API gateway functionality
- Error case validation

### Running Tests

The project includes a unified test runner via `bin/start`. Available commands:

```bash
# Run all tests (including E2E)
bin/start run-all --include-e2e

# Run just E2E tests
bin/start e2e

# Run E2E tests in watch mode (opens Cypress UI)
bin/start e2e --watch

# Generate new tests
bin/start generate --service [frontend|backend|all]
```

### Test Architecture

The framework uses:
- **Cypress** for E2E testing against the Records Manager web app
- **Python orchestration** for coordinating test execution
- **Docker Compose** for managing the test environment

#### E2E Test Structure

Tests are organized in the cli-frontend package:

```
cli-frontend/
├── cypress/
│   ├── e2e/
│   │   └── records-manager/    # Test suites
│   │       └── basic.cy.js     # Core functionality tests
│   └── support/               # Test helpers and commands
```

Key test areas:
- UI Elements and Dark Mode
- Record Management (CRUD operations)
- Data Persistence
- API Integration
- Visual Styling

### Development Workflow

1. **Start the Environment**
   ```bash
   cd test-fixtures
   docker compose up -d --watch
   ```

2. **Make Changes**
   - Edit frontend code in `test-fixtures/s1-frontend/`
   - Edit API code in `test-fixtures/s2-api/`
   - Services will automatically rebuild

3. **Run Tests**
   ```bash
   # For active development with Cypress UI
   bin/start e2e --watch
   
   # For CI/CD or full test suite
   bin/start run-all --include-e2e
   ```

### Debugging

- **Service Logs**:
  ```bash
  docker compose logs -f [service_name]
  ```

- **Test Artifacts**:
  - Screenshots: `cli-frontend/cypress/screenshots/`
  - Videos (if enabled): `cli-frontend/cypress/videos/`

- **API Debugging**:
  - Frontend API: http://localhost:3000/api
  - Backend API: http://localhost:3001/api
  - Data Service: http://localhost:3002/api

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run the full test suite: `bin/start run-all --include-e2e`
5. Submit a pull request

### Known Issues

- Terminal warnings about `experimentalSessionAndOrigin` in Cypress can be ignored
- Some tty/terminal related warnings during test execution don't affect functionality

## License

This project is open-source under the MIT license.