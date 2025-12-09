# 🔐 Guia de Segurança - NPS-IPB

## ⚠️ AVISOS CRÍTICOS DE SEGURANÇA

### 🚨 NUNCA faça isso:

1. ❌ **NUNCA** commite arquivos `.env` no git
2. ❌ **NUNCA** use senhas fracas em produção (ex: "password", "123456")
3. ❌ **NUNCA** use o mesmo JWT_SECRET em dev e prod
4. ❌ **NUNCA** exponha credenciais em logs ou mensagens de erro
5. ❌ **NUNCA** use credenciais padrão em produção

### ✅ SEMPRE faça isso:

1. ✅ Use o script `generate-env.sh` para criar credenciais fortes
2. ✅ Mantenha backups seguros das credenciais
3. ✅ Rotate credenciais periodicamente
4. ✅ Use HTTPS em produção
5. ✅ Mantenha o sistema atualizado

## 🔑 Gerando Credenciais Seguras

### Método 1: Script Automatizado (Recomendado)

```bash
./generate-env.sh
```

O script irá:
- Gerar senha forte de 32 caracteres para o banco
- Gerar JWT secret de 64 bytes em base64
- Criar arquivo `.env` automaticamente
- Fazer backup se `.env` já existir

### Método 2: Manual

```bash
# 1. Copie o template
cp .env.example .env

# 2. Gere senha forte para o banco (32 caracteres)
openssl rand -base64 32 | tr -d "=+/" | cut -c1-32

# 3. Gere JWT secret (64 bytes)
openssl rand -base64 64 | tr -d "\n"

# 4. Edite o .env e substitua os placeholders
nano .env
```

## 🛡️ Checklist de Segurança

### Antes de Deploy em Produção

- [ ] **Credenciais Fortes**
  - [ ] POSTGRES_PASSWORD com no mínimo 32 caracteres aleatórios
  - [ ] JWT_SECRET com no mínimo 64 bytes em base64
  - [ ] Usuário de banco diferente de "user", "admin", "postgres"

- [ ] **Ambiente**
  - [ ] NODE_ENV=production no .env
  - [ ] Arquivo .env não está no git
  - [ ] .env possui permissões 600 (`chmod 600 .env`)

- [ ] **Rede**
  - [ ] Firewall configurado (apenas portas 22, 80, 443)
  - [ ] SSL/TLS configurado e funcionando
  - [ ] Certificado SSL válido (não auto-assinado)

- [ ] **Docker**
  - [ ] Containers rodando com restart policy
  - [ ] Volumes de dados com backup configurado
  - [ ] Imagens atualizadas

- [ ] **Aplicação**
  - [ ] CORS configurado corretamente
  - [ ] Rate limiting habilitado (se aplicável)
  - [ ] Logs não expõem credenciais
  - [ ] Validação de input em todas as rotas

## 🔒 Proteção de Credenciais

### Permissões de Arquivo

```bash
# .env deve ser legível apenas pelo owner
chmod 600 .env

# Scripts não devem ser world-writable
chmod 755 *.sh

# Verifique permissões
ls -la .env*
```

### Verificando se .env está no Git

```bash
# Deve retornar vazio
git ls-files | grep ".env$"

# Se aparecer algo, remova:
git rm --cached .env
git commit -m "Remove .env from git"
```

## 🔐 Gestão de Segredos em Produção

### Opção 1: Variáveis de Ambiente do Sistema

```bash
# No servidor, adicione ao ~/.bashrc ou /etc/environment
export POSTGRES_PASSWORD="senha-super-segura"
export JWT_SECRET="jwt-secret-super-seguro"

# Ou crie um arquivo seguro fora do projeto
sudo nano /etc/nps-ipb/.env
sudo chmod 600 /etc/nps-ipb/.env
sudo chown root:root /etc/nps-ipb/.env

# Use no docker-compose
docker compose --env-file /etc/nps-ipb/.env up -d
```

### Opção 2: Docker Secrets (Docker Swarm)

```bash
# Crie secrets
echo "senha-super-segura" | docker secret create db_password -
echo "jwt-secret-super-seguro" | docker secret create jwt_secret -

# Use no docker-compose.yml (modo swarm)
secrets:
  - db_password
  - jwt_secret
```

### Opção 3: Vault/Gestores de Segredos

Para ambientes enterprise, considere:
- HashiCorp Vault
- AWS Secrets Manager
- Azure Key Vault
- Google Cloud Secret Manager

## 🚨 Rotação de Credenciais

### Quando Rotacionar

- ✅ A cada 90 dias (boa prática)
- ✅ Quando um membro da equipe sai
- ✅ Após suspeita de vazamento
- ✅ Após incidente de segurança

### Como Rotacionar

```bash
# 1. Gere novas credenciais
./generate-env.sh

# 2. Faça backup do banco
docker compose exec database pg_dump -U usuario_antigo nps_db > backup.sql

# 3. Atualize credenciais no banco
docker compose exec database psql -U usuario_antigo -d nps_db
# ALTER USER usuario_antigo WITH PASSWORD 'nova_senha';

# 4. Reinicie os serviços
docker compose down
docker compose --profile prod up -d

# 5. Teste a aplicação
curl http://localhost/api/health
```

## 🔍 Auditoria de Segurança

### Verificar Credenciais Fracas

```bash
# Procurar por senhas óbvias no código
grep -r "password\|123456\|admin" --include="*.js" --include="*.ts"

# Verificar se há .env commitado
git log --all --full-history -- "**/.env"

# Escanear por segredos (use ferramenta gitleaks)
docker run -v $(pwd):/path zricethezav/gitleaks:latest detect --source="/path" -v
```

### Scan de Vulnerabilidades

```bash
# Backend (npm audit)
cd backend && npm audit

# Frontend (npm audit)
cd frontend && npm audit

# Containers (trivy)
docker run aquasec/trivy image NPS-IPB-backend:latest
docker run aquasec/trivy image NPS-IPB-frontend:latest
```

## 📋 Incidentes de Segurança

### Se Credenciais Forem Vazadas

1. **IMEDIATAMENTE**:
   ```bash
   # Pare todos os serviços
   docker compose down
   
   # Gere novas credenciais
   ./generate-env.sh
   
   # Rotacione no banco
   # (ver seção "Como Rotacionar")
   ```

2. **Investigue**:
   - Como ocorreu o vazamento?
   - Quais sistemas foram afetados?
   - Houve acesso não autorizado?

3. **Documente**:
   - Registre o incidente
   - Ações tomadas
   - Lições aprendidas

4. **Previna**:
   - Revise políticas de segurança
   - Implemente controles adicionais
   - Treine a equipe

## 🔧 Ferramentas Recomendadas

### Validação de Segredos

```bash
# Instalar gitleaks para escanear histórico
wget https://github.com/gitleaks/gitleaks/releases/download/v8.18.0/gitleaks_8.18.0_linux_x64.tar.gz
tar xvzf gitleaks_8.18.0_linux_x64.tar.gz
./gitleaks detect
```

### Geradores de Senha

```bash
# OpenSSL (já usado no script)
openssl rand -base64 32

# pwgen
apt install pwgen
pwgen -s 32 1

# /dev/urandom
tr -dc A-Za-z0-9 </dev/urandom | head -c 32
```

## 📞 Contato em Caso de Incidente

Se você descobrir uma vulnerabilidade de segurança:

1. **NÃO** crie issue pública no GitHub
2. **NÃO** divulgue publicamente
3. **ENVIE** email privado para: diogobenicio@hotmail.com
4. Inclua:
   - Descrição da vulnerabilidade
   - Passos para reproduzir
   - Impacto potencial
   - Sua sugestão de correção (se houver)

## 📚 Referências

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Docker Security Best Practices](https://docs.docker.com/engine/security/)
- [PostgreSQL Security](https://www.postgresql.org/docs/current/security.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

**Última atualização:** Dezembro 2025  
**Mantenha este documento atualizado** conforme a aplicação evolui.
