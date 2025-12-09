#!/bin/bash

# Script para gerar variáveis de ambiente seguras
# Uso: ./generate-env.sh

echo "🔐 Gerador de Variáveis de Ambiente Seguras"
echo "============================================"
echo ""

# Verifica se .env já existe
if [ -f .env ]; then
    echo "⚠️  ATENÇÃO: Arquivo .env já existe!"
    read -p "Deseja sobrescrever? (s/N): " overwrite
    if [[ ! $overwrite =~ ^[Ss]$ ]]; then
        echo "Operação cancelada."
        exit 0
    fi
    mv .env .env.backup.$(date +%Y%m%d_%H%M%S)
    echo "✅ Backup criado"
fi

# Gera senha forte para o banco de dados
DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)

# Gera JWT secret forte
JWT_SECRET=$(openssl rand -base64 64 | tr -d "\n")

# Solicita informações
echo ""
echo "📋 Configurações Básicas:"
read -p "Nome do banco de dados [nps_db]: " DB_NAME
DB_NAME=${DB_NAME:-nps_db}

read -p "Usuário do banco de dados [nps_admin]: " DB_USER
DB_USER=${DB_USER:-nps_admin}

read -p "Porta do backend [5000]: " PORT
PORT=${PORT:-5000}

read -p "Ambiente (development/production) [development]: " NODE_ENV
NODE_ENV=${NODE_ENV:-development}

# Para produção, solicita domínio
DOMAIN=""
SSL_EMAIL=""
if [ "$NODE_ENV" = "production" ]; then
    echo ""
    echo "🌐 Configurações de Produção:"
    read -p "Domínio (ex: exemplo.com): " DOMAIN
    read -p "Email para SSL: " SSL_EMAIL
fi

# Cria arquivo .env
cat > .env << EOF
# Database Configuration
# Gerado automaticamente em $(date)
POSTGRES_DB=$DB_NAME
POSTGRES_USER=$DB_USER
POSTGRES_PASSWORD=$DB_PASSWORD

# Backend Configuration
DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@database:5432/$DB_NAME?schema=public
JWT_SECRET=$JWT_SECRET
PORT=$PORT
NODE_ENV=$NODE_ENV

# Frontend Configuration
VITE_API_URL=/api
VITE_API_PROXY_TARGET=http://backend:$PORT
EOF

# Adiciona configurações de produção se aplicável
if [ -n "$DOMAIN" ]; then
    cat >> .env << EOF

# Production Configuration
DOMAIN=$DOMAIN
SSL_EMAIL=$SSL_EMAIL
EOF
fi

echo ""
echo "✅ Arquivo .env criado com sucesso!"
echo ""
echo "🔑 Credenciais Geradas:"
echo "   Usuário DB: $DB_USER"
echo "   Senha DB: $DB_PASSWORD"
echo "   JWT Secret: [${#JWT_SECRET} caracteres]"
echo ""
echo "⚠️  IMPORTANTE:"
echo "   1. Mantenha o arquivo .env seguro e NUNCA o commite"
echo "   2. Faça backup destas credenciais em local seguro"
echo "   3. O arquivo .env está no .gitignore"
echo ""
echo "📝 Para iniciar a aplicação:"
if [ "$NODE_ENV" = "production" ]; then
    echo "   docker compose --profile prod up -d --build"
else
    echo "   docker compose --profile dev up -d"
fi
echo ""
