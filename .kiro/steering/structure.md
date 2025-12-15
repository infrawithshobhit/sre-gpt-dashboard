# Project Structure & Organization

## Directory Layout

```
sre-gpt/
├── src/                          # Source code root
│   ├── app.js                    # Main application entry point
│   ├── analyzers/                # Health analysis logic
│   │   └── healthAnalyzer.js     # Core health analysis engine
│   ├── chat/                     # AI chat functionality
│   │   └── chatHandler.js        # Natural language processing & responses
│   ├── dashboard/                # Frontend dashboard
│   │   ├── dashboard.js          # Client-side JavaScript
│   │   └── index.html            # Dashboard HTML template
│   ├── dynatrace/                # Dynatrace integration
│   │   └── dynatraceService.js   # API client for Dynatrace
│   ├── routes/                   # Express.js API routes
│   │   ├── chatRoutes.js         # Chat API endpoints
│   │   ├── dashboardRoutes.js    # Dashboard data endpoints
│   │   └── dynatraceRoutes.js    # Dynatrace proxy endpoints
│   └── utils/                    # Shared utilities
│       └── logger.js             # Winston logging configuration
├── logs/                         # Application logs (created at runtime)
├── config/                       # Configuration files (Docker volume)
├── .env.example                  # Environment template
├── package.json                  # Node.js dependencies & scripts
├── docker-compose.yml            # Multi-service Docker setup
└── Dockerfile                    # Container build instructions
```

## Architectural Patterns

### Layered Architecture
- **Presentation Layer**: Dashboard UI + REST API routes
- **Business Logic Layer**: Analyzers + Chat handlers
- **Data Access Layer**: Dynatrace service integration
- **Cross-cutting**: Logging, error handling, configuration

### Service Organization
- **Single Responsibility**: Each service class handles one domain
- **Dependency Injection**: Services receive dependencies via constructor
- **Interface Consistency**: All services return standardized response objects

## File Naming Conventions

### Backend Files
- **Services**: `{domain}Service.js` (e.g., `dynatraceService.js`)
- **Analyzers**: `{type}Analyzer.js` (e.g., `healthAnalyzer.js`)
- **Handlers**: `{feature}Handler.js` (e.g., `chatHandler.js`)
- **Routes**: `{domain}Routes.js` (e.g., `dashboardRoutes.js`)
- **Utilities**: `{function}.js` (e.g., `logger.js`)

### Frontend Files
- **Main Scripts**: `{component}.js` (e.g., `dashboard.js`)
- **Templates**: `index.html` for main pages

## Code Organization Principles

### Module Structure
- **Class-based Services**: Use ES6 classes for stateful services
- **Functional Utilities**: Pure functions for shared utilities
- **Route Handlers**: Express router modules with grouped endpoints

### Error Handling Strategy
- **Service Level**: Return status objects with error states
- **Route Level**: HTTP status codes with JSON error responses
- **Application Level**: Winston logging for all errors

### Configuration Management
- **Environment Variables**: All configuration via `.env` files
- **Defaults**: Sensible fallbacks in code
- **Validation**: Required variables checked at startup

## API Design Patterns

### REST Endpoints
- **Resource-based URLs**: `/api/{domain}/{resource}`
- **HTTP Methods**: GET for queries, POST for actions
- **Response Format**: Consistent JSON structure with data/error fields

### WebSocket Events
- **Client → Server**: `{action}_message` (e.g., `chat_message`)
- **Server → Client**: `{type}_response` or `{type}_update`
- **Error Events**: `{type}_error` with error details

## Development Guidelines

### Adding New Features
1. **Services**: Create in appropriate domain folder (`src/{domain}/`)
2. **Routes**: Add to existing route file or create new one
3. **Frontend**: Extend dashboard.js or create new component
4. **Tests**: Add corresponding test files (when implementing tests)

### Integration Points
- **Dynatrace**: All external API calls go through `dynatraceService.js`
- **Chat**: Natural language processing in `chatHandler.js`
- **Health Analysis**: Centralized in `healthAnalyzer.js`
- **Real-time Updates**: Socket.IO events from main app class