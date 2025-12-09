# NPS-IPB - Sistema de Pesquisa de Satisfação NPS

Sistema completo para gerenciamento de campanhas NPS (Net Promoter Score) com interface moderna e analytics detalhados.

![NPS Survey Application](https://img.shields.io/badge/Status-Production%20Ready-green)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🚀 Características

- **Landing Page Responsiva** - Interface moderna com design glassmorphism
- **Gerenciamento de Campanhas** - Crie, edite e exclua campanhas NPS
- **Pesquisas Customizáveis** - Adicione perguntas adicionais (sim/não ou texto livre)
- **Analytics Completo** - Visualize NPS geral, distribuição e tendências
- **Identificação Opcional** - Usuários podem optar por se identificar ou responder anonimamente
- **QR Code** - Gere QR codes para compartilhar pesquisas
- **Contatos** - Gerencie respondentes identificados
- **Docker** - Deploy facilitado com containers

## 🛠️ Tecnologias

### Frontend
- **React 19** com TypeScript
- **Material-UI (MUI) v7** - Componentes modernos
- **ApexCharts** - Gráficos interativos
- **Vite** - Build rápido e otimizado

### Backend
- **Node.js** com Express
- **Prisma ORM** - Gestão de banco de dados
- **PostgreSQL** - Banco de dados relacional
- **Winston** - Logging estruturado

### DevOps
- **Docker & Docker Compose** - Containerização
- **Nginx** - Reverse proxy e servidor web
- **SSL/TLS** - Suporte HTTPS em produção

## 📋 Pré-requisitos

- **Docker** >= 20.10
- **Docker Compose** >= 2.0
- **Git**

## ⚙️ Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/DiogoBenicio/NPS-IPB.git
cd NPS-IPB
```

### 2. Configure as variáveis de ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env e configure suas variáveis
nano .env
```

**Variáveis importantes para produção:**
```env
# Database
POSTGRES_DB=nps_db
POSTGRES_USER=seu_usuario
POSTGRES_PASSWORD=senha_forte_aqui

# Backend
DATABASE_URL=postgresql://seu_usuario:senha_forte_aqui@database:5432/nps_db?schema=public
JWT_SECRET=chave_jwt_muito_segura_aleatoria
PORT=5000
NODE_ENV=production

# Frontend
VITE_API_URL=/api
VITE_API_PROXY_TARGET=http://backend:5000

# Production (opcional para SSL)
DOMAIN=seu-dominio.com
SSL_EMAIL=seu-email@dominio.com
```

## 🚀 Executando a Aplicação

### Modo Desenvolvimento

```bash
# Inicia todos os serviços em modo dev com hot reload
docker compose --profile dev up -d

# Ou sem nginx (acesso direto ao frontend na porta 3000)
docker compose up -d database backend frontend
```

**Acessos em desenvolvimento:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Nginx (se usando --profile dev): http://localhost
- Database: localhost:5432

### Modo Produção

```bash
# Build e start dos containers em produção
docker compose --profile prod up -d --build

# Verificar logs
docker compose logs -f

# Parar os serviços
docker compose --profile prod down
```

**Acessos em produção:**
- Aplicação: http://localhost (ou seu domínio configurado)
- HTTPS: https://localhost (se SSL configurado)

## 🔐 Configuração SSL (Produção)

Para habilitar HTTPS em produção:

### 1. Gere ou obtenha certificados SSL

**Opção A: Let's Encrypt (Recomendado para produção)**
```bash
# Instale certbot
sudo apt install certbot

# Gere certificados
sudo certbot certonly --standalone -d seu-dominio.com
```

**Opção B: Certificado auto-assinado (apenas para testes)**
```bash
mkdir -p nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/private.key \
  -out nginx/ssl/certificate.crt
```

### 2. Configure o nginx para SSL

Edite `nginx/nginx.prod.conf` e descomente as seções SSL.

### 3. Reinicie o nginx
```bash
docker compose --profile prod restart nginx-prod
```

## 📊 Estrutura do Projeto

```
NPS-IPB/
├── backend/                 # API Node.js + Express
│   ├── prisma/             # Schema e migrations
│   ├── routes/             # Rotas da API
│   ├── middlewares/        # Middlewares customizados
│   └── tests/              # Testes unitários
├── frontend/               # React + TypeScript
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── services/       # Chamadas API
│   │   └── types/          # TypeScript types
│   └── public/
├── nginx/                  # Configurações Nginx
│   ├── Dockerfile.dev
│   ├── Dockerfile.prod
│   ├── nginx.dev.conf
│   └── nginx.prod.conf
├── database/               # PostgreSQL Dockerfile
├── docker-compose.yml      # Orquestração dos containers
└── .env.example           # Template de variáveis de ambiente
```

## 🔧 Comandos Úteis

### Docker

```bash
# Ver logs de um serviço específico
docker compose logs -f backend

# Reconstruir um serviço
docker compose build frontend

# Executar comando dentro de um container
docker compose exec backend npm run prisma:migrate

# Limpar tudo e reiniciar
docker compose down -v
docker compose up -d --build
```

### Backend

```bash
# Acessar o container do backend
docker compose exec backend sh

# Executar migrations do Prisma
docker compose exec backend npm run prisma:migrate

# Ver status do Prisma
docker compose exec backend npx prisma studio
```

### Frontend

```bash
# Acessar o container do frontend
docker compose exec frontend sh

# Rebuild do frontend
docker compose exec frontend npm run build
```

### Database

```bash
# Acessar o PostgreSQL
docker compose exec database psql -U user -d nps_db

# Backup do banco de dados
docker compose exec database pg_dump -U user nps_db > backup.sql

# Restaurar backup
docker compose exec -T database psql -U user -d nps_db < backup.sql
```

## 🌐 Deploy em Servidor

### 1. Preparação do Servidor

```bash
# Atualize o sistema
sudo apt update && sudo apt upgrade -y

# Instale Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instale Docker Compose
sudo apt install docker-compose-plugin

# Adicione seu usuário ao grupo docker
sudo usermod -aG docker $USER
```

### 2. Clone e Configure

```bash
# Clone o repositório
git clone https://github.com/DiogoBenicio/NPS-IPB.git
cd NPS-IPB

# Configure variáveis de ambiente
cp .env.example .env
nano .env
```

### 3. Execute em Produção

```bash
# Build e start
docker compose --profile prod up -d --build

# Verifique se está rodando
docker compose ps
```

### 4. Configure Firewall (UFW)

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

## 📈 Monitoramento

### Logs

```bash
# Ver todos os logs
docker compose logs -f

# Logs específicos
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f nginx-prod
```

### Health Check

```bash
# Verificar status dos containers
docker compose ps

# Verificar saúde do backend
curl http://localhost/api/health

# Verificar uso de recursos
docker stats
```

## 🔄 Atualizações

```bash
# Pare os serviços
docker compose --profile prod down

# Atualize o código
git pull origin main

# Reconstrua e reinicie
docker compose --profile prod up -d --build
```

## 🐛 Troubleshooting

### Container não inicia

```bash
# Verifique os logs
docker compose logs nome-do-servico

# Reconstrua sem cache
docker compose build --no-cache nome-do-servico
```

### Banco de dados não conecta

```bash
# Verifique se o container está rodando
docker compose ps database

# Teste a conexão
docker compose exec database pg_isready -U user
```

### Erro de permissão

```bash
# Dê permissões corretas
sudo chown -R $USER:$USER .
```

## 📝 Variáveis de Ambiente

| Variável | Descrição | Padrão | Obrigatório |
|----------|-----------|--------|-------------|
| `POSTGRES_DB` | Nome do banco de dados | `nps_db` | Sim |
| `POSTGRES_USER` | Usuário do PostgreSQL | `user` | Sim |
| `POSTGRES_PASSWORD` | Senha do PostgreSQL | `password` | Sim |
| `DATABASE_URL` | URL de conexão completa | - | Sim |
| `JWT_SECRET` | Chave secreta para JWT | - | Sim |
| `NODE_ENV` | Ambiente (development/production) | `development` | Não |
| `PORT` | Porta do backend | `5000` | Não |
| `DOMAIN` | Domínio em produção | `localhost` | Não |

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👤 Autor

**Diogo Silveira Benício**

- GitHub: [@DiogoBenicio](https://github.com/DiogoBenicio)
- Email: diogobenicio@hotmail.com

## 🙏 Agradecimentos

- Material-UI pela biblioteca de componentes
- Prisma pela excelente ORM
- ApexCharts pelos gráficos interativos

---

⭐ Se este projeto foi útil para você, considere dar uma estrela!
