# ==========================================
# ESTÁGIO 1: Build (Compilar o Vue.js)
# ==========================================
FROM node:20-alpine AS build
WORKDIR /app

# Copia os arquivos de dependência e instala (cria cache)
COPY package*.json ./
RUN npm install

# Copia o resto do código e gera o build de produção (pasta /dist)
COPY . .
RUN npm run build

# ==========================================
# ESTÁGIO 2: Run (Servidor Nginx)
# ==========================================
FROM nginx:alpine

# Copia a pasta /dist gerada no Estágio 1 para a pasta pública do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Configura o Nginx para entender as rotas do Vue Router, permite F5 na página sem Erro 404.
RUN echo "server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files \$uri \$uri/ /index.html; \
    } \
}" > /etc/nginx/conf.d/default.conf

# Expõe a porta 80 (padrão web)
EXPOSE 80

# Inicia o Nginx
CMD ["nginx", "-g", "daemon off;"]