FROM node:18-alpine

WORKDIR /app

# 1. Instalar dependências do BACKEND
COPY backend/package.json ./
RUN npm install

# 2. Copiar código do BACKEND
COPY backend/ ./

# 3. Copiar FRONTEND (arquivos estáticos)
COPY frontend/ ./frontend/

EXPOSE 3000

CMD ["npm", "start"]