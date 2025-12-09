# Sistema NPS IPB

Sistema de Net Promoter Score para cursos de teologia da Igreja Presbiteriana do Brasil.

## Arquitetura

- **Frontend**: React + MUI (TypeScript)
- **Backend**: Node.js + Express + Prisma
- **Database**: PostgreSQL
- **Proxy**: Nginx
- **Orquestração**: Docker Compose

## Como executar

### Desenvolvimento
```bash
docker-compose --profile dev up --build
```

### Produção
```bash
docker-compose --profile prod up --build
```

Acesse:
- Dev: http://localhost
- Prod: https://localhost

## Estrutura
- `/frontend`: Aplicação React
- `/backend`: API Node.js
- `/database`: Config Postgres
- `/nginx`: Config Nginx

## Funcionalidades
- Campanhas NPS
- Dashboard admin
- Autenticação JWT
- QR Code para campanhas