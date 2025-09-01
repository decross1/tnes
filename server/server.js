import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server
  credentials: true
}));
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'tnes-backend-proxy'
  });
});

// Claude API Proxy Endpoint
app.post('/api/claude/messages', async (req, res) => {
  const apiKey = process.env.VITE_CLAUDE_API_KEY;
  
  if (!apiKey) {
    console.error('❌ Claude API key not found in environment');
    return res.status(500).json({ 
      error: 'Claude API key not configured',
      code: 'MISSING_API_KEY'
    });
  }

  try {
    console.log('🤖 Proxying request to Claude API...');
    console.log('📝 Request data:', {
      model: req.body.model,
      maxTokens: req.body.max_tokens,
      temperature: req.body.temperature,
      systemPrompt: req.body.system?.substring(0, 100) + '...',
      userPromptLength: req.body.messages?.[0]?.content?.length || 0
    });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Claude API error:', response.status, errorText);
      return res.status(response.status).json({
        error: 'Claude API request failed',
        status: response.status,
        message: errorText
      });
    }

    const data = await response.json();
    console.log('✅ Claude API response received:', {
      contentLength: data.content?.[0]?.text?.length || 0,
      usage: data.usage
    });

    res.json(data);
  } catch (error) {
    console.error('❌ Backend proxy error:', error);
    res.status(500).json({
      error: 'Backend proxy error',
      message: error.message
    });
  }
});

// Image Generation Proxy (for future use)
app.post('/api/images/generate', async (req, res) => {
  // Placeholder for image generation proxy
  res.status(501).json({ error: 'Image generation not implemented yet' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('🚨 Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 TNES Backend Proxy Server Started');
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`🔗 Frontend origin: http://localhost:5173`);
  console.log(`🔑 Claude API Key: ${process.env.VITE_CLAUDE_API_KEY ? '✅ Loaded' : '❌ Missing'}`);
  console.log('');
  console.log('🛡️  CORS Policy: Frontend requests allowed');
  console.log('📋 Available endpoints:');
  console.log('  GET  /health - Health check');
  console.log('  POST /api/claude/messages - Claude API proxy');
  console.log('  POST /api/images/generate - Image generation proxy (future)');
});