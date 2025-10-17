const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy transcription requests directly to backend
  app.use(
    '/transcribe',
    createProxyMiddleware({
      target: 'http://localhost:8000',
      changeOrigin: true,
      pathRewrite: {
        '^/transcribe': '/transcribe'
      }
    })
  );

  // Also proxy health check
  app.use(
    '/health',
    createProxyMiddleware({
      target: 'http://localhost:8000',
      changeOrigin: true,
      pathRewrite: {
        '^/health': '/health'
      }
    })
  );
};