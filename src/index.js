'use strict';

const config = require('./config/constants');
const logger = require('./utils/logger');
const { createClient } = require('./bot/client');
const { loadEvents } = require('./bot/loadEvents');
const { startHealthServer } = require('./healthcheck');

async function main() {
  if (!config.discord.token) {
    logger.error('DISCORD_TOKEN nao definido. Configure o arquivo .env antes de iniciar o bot.');
    process.exit(1);
  }

  // Sobe o servidor HTTP de health check para o Render nao hibernar
  startHealthServer();

  const client = createClient();
  loadEvents(client);

  let encerrando = false;
  async function encerrarGraciosamente(sinal) {
    if (encerrando) return;
    encerrando = true;
    logger.info(`Sinal ${sinal} recebido. Encerrando graciosamente...`);
    try {
      client.destroy();
      logger.info('Conexao com o Discord encerrada. Ate logo.');
    } catch (err) {
      logger.error('Erro ao encerrar a conexao com o Discord', err);
    } finally {
      process.exit(0);
    }
  }

  process.on('SIGTERM', () => encerrarGraciosamente('SIGTERM'));
  process.on('SIGINT', () => encerrarGraciosamente('SIGINT'));

  process.on('unhandledRejection', (err) => {
    logger.error('Promise rejeitada sem tratamento', err);
  });

  process.on('uncaughtException', (err) => {
    logger.error('Excecao nao tratada. Encerrando para reinicio limpo.', err);
    process.exit(1);
  });

  await client.login(config.discord.token);
  logger.info('Bot inicializado.');
}

main();
