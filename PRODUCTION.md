# 🚀 Guia Rápido de Deploy em Produção

## Pré-requisitos

✅ Servidor Linux (Ubuntu 20.04+ recomendado)  
✅ Acesso SSH ao servidor  
✅ Domínio configurado apontando para o IP do servidor  

## 1. Preparação do Servidor

```bash
# Conecte ao servidor via SSH
ssh usuario@seu-servidor.com

# Atualize o sistema
sudo apt update && sudo apt upgrade -y

# Instale Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instale Docker Compose
sudo apt install docker-compose-plugin -y

# Adicione seu usuário ao grupo docker
sudo usermod -aG docker $USER

# Faça logout e login novamente para aplicar
exit
ssh usuario@seu-servidor.com
```

## 2. Clone e Configure o Projeto

```bash
# Clone o repositório
git clone https://github.com/DiogoBenicio/NPS-IPB.git
cd NPS-IPB

# Crie o arquivo de ambiente
cp .env.example .env
nano .env
```

### Configure o arquivo .env:

```env
# Database - USE SENHAS FORTES!
POSTGRES_DB=nps_db
POSTGRES_USER=nps_admin
POSTGRES_PASSWORD=SuaSenhaForte123!@#

# Backend
DATABASE_URL=postgresql://nps_admin:SuaSenhaForte123!@#@database:5432/nps_db?schema=public
JWT_SECRET=ChaveJWTMuitoSeguraAleatoria123!@#
PORT=5000
NODE_ENV=production

# Frontend
VITE_API_URL=/api
VITE_API_PROXY_TARGET=http://backend:5000

# Domínio (opcional)
DOMAIN=seu-dominio.com
```

Salve com `Ctrl+X`, depois `Y`, depois `Enter`.

## 3. Configure o Firewall

```bash
# Permitir HTTP
sudo ufw allow 80/tcp

# Permitir HTTPS
sudo ufw allow 443/tcp

# Permitir SSH (importante!)
sudo ufw allow 22/tcp

# Ativar firewall
sudo ufw enable

# Verificar status
sudo ufw status
```

## 4. Execute a Aplicação

```bash
# Build e start em modo produção
docker compose --profile prod up -d --build

# Aguarde alguns minutos para o build completar
# Verifique o status
docker compose ps

# Verifique os logs
docker compose logs -f
```

## 5. Verificação

```bash
# Teste se está acessível
curl http://localhost

# Ou acesse pelo navegador
# http://seu-dominio.com
```

## 6. SSL/HTTPS (Recomendado)

### Opção A: Let's Encrypt (Gratuito)

```bash
# Instale certbot
sudo apt install certbot -y

# Pare o nginx temporariamente
docker compose --profile prod stop nginx-prod

# Gere certificados
sudo certbot certonly --standalone -d seu-dominio.com -d www.seu-dominio.com

# Copie certificados para o projeto
sudo mkdir -p nginx/ssl
sudo cp /etc/letsencrypt/live/seu-dominio.com/fullchain.pem nginx/ssl/certificate.crt
sudo cp /etc/letsencrypt/live/seu-dominio.com/privkey.pem nginx/ssl/private.key
sudo chown -R $USER:$USER nginx/ssl

# Reinicie o nginx
docker compose --profile prod start nginx-prod
```

### Opção B: Certificado Auto-Assinado (Apenas Teste)

```bash
# Crie pasta
mkdir -p nginx/ssl

# Gere certificado
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/private.key \
  -out nginx/ssl/certificate.crt
```

## 7. Manutenção

### Ver Logs
```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f nginx-prod
```

### Backup do Banco
```bash
# Criar backup
docker compose exec database pg_dump -U nps_admin nps_db > backup_$(date +%Y%m%d).sql

# Restaurar backup
docker compose exec -T database psql -U nps_admin -d nps_db < backup_20231209.sql
```

### Atualizar Aplicação
```bash
# Pare os serviços
docker compose --profile prod down

# Atualize o código
git pull origin main

# Reconstrua e reinicie
docker compose --profile prod up -d --build
```

### Reiniciar Serviços
```bash
# Reiniciar tudo
docker compose --profile prod restart

# Reiniciar apenas um serviço
docker compose restart backend
```

## 8. Monitoramento

```bash
# Status dos containers
docker compose ps

# Uso de recursos
docker stats

# Espaço em disco
df -h

# Logs do sistema
journalctl -u docker
```

## 9. Troubleshooting

### Problema: Container não inicia
```bash
# Verifique logs detalhados
docker compose logs nome-do-servico

# Reconstrua sem cache
docker compose build --no-cache nome-do-servico
docker compose up -d nome-do-servico
```

### Problema: Sem espaço em disco
```bash
# Limpe containers e imagens não utilizadas
docker system prune -a

# Limpe volumes não utilizados (CUIDADO!)
docker volume prune
```

### Problema: Banco de dados não conecta
```bash
# Verifique se está rodando
docker compose ps database

# Teste conexão
docker compose exec database pg_isready -U nps_admin

# Acesse o banco diretamente
docker compose exec database psql -U nps_admin -d nps_db
```

### Problema: Erro 502 Bad Gateway
```bash
# Verifique se backend está rodando
docker compose ps backend

# Verifique logs do backend
docker compose logs backend

# Reinicie backend
docker compose restart backend
```

## 10. Checklist de Segurança

- [ ] Senhas fortes no `.env`
- [ ] JWT_SECRET aleatório e forte
- [ ] Firewall configurado (apenas portas 22, 80, 443)
- [ ] SSL/HTTPS configurado
- [ ] Backups automáticos agendados
- [ ] Atualizações de segurança do sistema
- [ ] Logs sendo monitorados

## 11. Dicas de Performance

```bash
# Limite recursos de um container
docker compose up -d --memory="512m" --cpus="0.5" backend

# Configure swap se necessário
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs: `docker compose logs -f`
2. Consulte o README.md principal
3. Abra uma issue no GitHub
4. Entre em contato: diogobenicio@hotmail.com

---

**Bom deploy! 🚀**
