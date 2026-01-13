// The Infinite Closet - Minimal Express Server
// This is a placeholder server. Replace with your actual application.

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    service: 'The Infinite Closet API',
    timestamp: new Date().toISOString()
  });
});

// API endpoints
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    message: 'The Infinite Closet API is running'
  });
});

// Default route
app.get('/', (req, res) => {
  res.json({
    service: 'The Infinite Closet (TIC)',
    version: '0.1.0',
    description: 'AI + AR + SocialFi Fashion Metaverse',
    endpoints: {
      health: '/health',
      api_health: '/api/health'
    },
    status: 'Server is running. Configure with your actual application code.'
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║     The Infinite Closet (TIC) - Docker Container Running      ║
║            AI + AR + SocialFi Fashion Metaverse              ║
╚═══════════════════════════════════════════════════════════════╝

✅ Server running on port ${PORT}
📍 Environment: ${process.env.NODE_ENV || 'development'}
🏗️  Service: API Gateway / Web Server
⏰ Started: ${new Date().toISOString()}

Available endpoints:
  GET  /health      - Health check
  GET  /api/health  - API health check
  GET  /            - Welcome info

Note: This is a placeholder server. To deploy the full application:
1. Add your NestJS backend code to apps/api-gateway/
2. Add your React frontend to apps/web-mirror/
3. Configure environment variables in .env.local
4. Rebuild with: docker-compose build --no-cache
5. Restart with: docker-compose up -d

📚 Documentation: See DOCKER_SETUP.md
🔗 Project: https://github.com/MrsNovember/The-Infinite-Closet-TIC-
  `);
});

module.exports = app;
