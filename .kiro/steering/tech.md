# Technology Stack & Build System

## Core Technologies

### Backend
- **Runtime**: Node.js 18+ (Alpine-based Docker images)
- **Framework**: Express.js for REST API and static file serving
- **Real-time Communication**: Socket.IO for WebSocket connections
- **HTTP Client**: Axios for Dynatrace API integration
- **Logging**: Winston with structured JSON logging
- **Scheduling**: node-cron for automated health monitoring

### Frontend
- **Client-side**: Vanilla JavaScript (ES6+)
- **Styling**: Tailwind CSS (referenced in dashboard)
- **Real-time Updates**: Socket.IO client for live data streaming

### Security & Middleware
- **Security Headers**: Helmet.js
- **CORS**: cors middleware
- **Rate Limiting**: rate-limiter-flexible
- **Authentication**: JWT (configured via environment)

### External Integrations
- **Primary**: Dynatrace API v1/v2 for monitoring data
- **Optional**: OpenAI API for enhanced chat capabilities
- **Optional**: Redis for session storage and caching

## Development Dependencies
- **Development Server**: nodemon for auto-restart
- **Testing**: Jest framework
- **Linting**: ESLint (implied from code style)

## Common Commands

### Development
```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Run tests
npm test

# Build client-side assets
npm run build
npm run build:client
```

### Docker Operations
```bash
# Build and run with Docker Compose
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f sre-gpt

# Stop services
docker-compose down
```

### Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit environment variables (required)
# - DYNATRACE_URL
# - DYNATRACE_API_TOKEN
# - Optional: OPENAI_API_KEY
```

## Architecture Patterns

### Module System
- **CommonJS**: All backend modules use `require()`/`module.exports`
- **Class-based**: Services use ES6 classes with dependency injection
- **Singleton Services**: DynatraceService, HealthAnalyzer instances

### Error Handling
- **Centralized Logging**: Winston logger used throughout
- **Graceful Degradation**: Services return status objects with error states
- **API Error Responses**: Consistent JSON error format with HTTP status codes

### Configuration Management
- **Environment Variables**: dotenv for configuration
- **Default Values**: Fallbacks provided for optional settings
- **Validation**: Environment variables validated at startup