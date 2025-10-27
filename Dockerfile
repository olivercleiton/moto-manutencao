FROM node:18-alpine

WORKDIR /app

# 1. Instalar dependências do BACKEND
COPY backend/package.json ./
RUN npm install

# 2. Copiar TODO o código do BACKEND (incluindo routes, middleware, etc)
COPY backend/ ./

# 3. Copiar FRONTEND
COPY frontend/ ./frontend/

EXPOSE 3000

CMD ["node", "server.js"]