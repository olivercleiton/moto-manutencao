FROM node:18-alpine

WORKDIR /app

# 1. Instalar dependências do BACKEND
COPY backend/package.json backend/package-lock.json ./
RUN npm install

# 2. Instalar e buildar FRONTEND
COPY frontend/ ./frontend/
RUN cd frontend && npm install && npm run build

# 3. Copiar código do BACKEND
COPY backend/ ./

EXPOSE 3000

CMD ["npm", "start"]