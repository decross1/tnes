# TNES Backend Proxy Server

Backend proxy server for the D&D Solo Adventure App to handle API requests and resolve CORS issues.

## Architecture

```
Frontend (localhost:5173) → Backend Proxy (localhost:3001) → Claude API
```

## Features

- **CORS Resolution**: Handles cross-origin requests to Claude API
- **API Key Security**: Keeps API keys on server-side 
- **Request Logging**: Comprehensive request/response logging
- **Error Handling**: Proper error handling and user-friendly messages
- **Health Monitoring**: Health check endpoint for monitoring

## Development

### Setup
```bash
cd server
npm install
```

### Environment Variables
Backend reads from `../.env`:
```bash
VITE_CLAUDE_API_KEY=your_claude_api_key_here
```

### Start Backend Only
```bash
cd server
npm run dev
```

### Start Full Development Environment
From project root:
```bash
./start-dev.sh
```

## API Endpoints

### Health Check
```
GET /health
Response: { status: "healthy", timestamp: "...", service: "tnes-backend-proxy" }
```

### Claude API Proxy
```
POST /api/claude/messages
Headers: Content-Type: application/json
Body: Claude API request format
Response: Claude API response format
```

### Image Generation (Future)
```
POST /api/images/generate
Status: 501 Not Implemented
```

## Production Deployment

For production, this backend should be deployed to a cloud service (Vercel, Railway, Render, etc.) and the frontend should be configured to use the production backend URL instead of `localhost:3001`.

## Security Notes

- API keys are kept server-side only
- CORS is configured for specific frontend origins
- All requests are logged for debugging
- Error responses don't expose sensitive information