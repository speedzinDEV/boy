'use strict';

// Servidor HTTP minimo para o Render (plano free) nao hibernar.
// O UptimeRobot pinga /health a cada 14 min, mantendo o bot vivo.
const http = require('http');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3000;

function startHealthServer() {
  const server = http.createServer((req, res) => {
    if (req.url === '/health' || req.url === '/') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', uptime: process.uptime() }));
    } else {
      res.writeHead(404);
      res.end();
    }
  });

  server.listen(PORT, () => {
    logger.info(`Health check server rodando na porta ${PORT}`);
  });

  server.on('error', (err) => {
    logger.error('Erro no health check server', err);
  });

  return server;
}

module.exports = { startHealthServer };
