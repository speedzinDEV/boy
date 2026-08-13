#!/bin/sh
set -e

echo "[1/4] Testando conexao com o banco..."
npm run db:test

echo "[2/4] Executando migrations..."
npm run migrate

echo "[3/4] Registrando Slash Commands..."
npm run deploy

echo "[4/4] Iniciando o bot..."
exec node src/index.js
