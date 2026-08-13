FROM node:18-slim

WORKDIR /app

# Instala dependencias primeiro (aproveita cache do Docker entre builds)
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copia o resto do codigo
COPY . .

# Entrypoint: testa banco, roda migrations, registra slash commands e so
# entao inicia o bot. Mesma sequencia que ja existia no build.sh.
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

ENV NODE_ENV=production

CMD ["/app/docker-entrypoint.sh"]
