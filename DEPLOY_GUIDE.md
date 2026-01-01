# 📋 GUIA DE DEPLOY - FRONTEND SINGULAI

## Localização do VPS
- **IP:** 72.60.147.56
- **Usuário SSH:** raiz
- **Hostname:** rodrigo.dev
- **Localização do Deploy:** `/root/singulai-platform/frontend`

## 📌 Pré-requisitos
- Node.js 18+ instalado
- npm 8+ instalado
- Git instalado
- Acesso SSH ao VPS

## 🚀 INSTRUÇÕES DE DEPLOY

### 1. Conectar ao VPS
```bash
ssh raiz@72.60.147.56
# Ou
ssh raiz@rodrigo.dev
```

### 2. Preparar Diretório
```bash
mkdir -p /root/singulai-platform/frontend
cd /root/singulai-platform/frontend
```

### 3. Clonar Frontend
```bash
git clone https://github.com/GrupoWinS/frontMVP1.git .
```

### 4. Instalar Dependências
```bash
npm install
```

### 5. Criar .env.production
```bash
cat > .env.production << 'EOF'
# API Backend - Production (VPS Hostinger)
VITE_API_URL=http://localhost:3004/api/v1
VITE_API_TIMEOUT=30000
VITE_API_RETRIES=3

# Blockchain
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com

# Smart Contracts (Sepolia Testnet)
VITE_SGL_TOKEN_ADDRESS=0xF281a68ae5Baf227bADC1245AC5F9B2F53b7EDe1
VITE_AVATAR_BASE_ADDRESS=0x95F531cafca627A447C0F1119B8b6aCC730163E5
VITE_AVATAR_WALLET_LINK_ADDRESS=0x9F475e5D174577f2FB17a9D94a8093e2D8c9ED41
VITE_TIMECAPSULE_ADDRESS=0x6A58aD664071d450cF7e794Dac5A13e3a1DeD172
VITE_LEGACY_ADDRESS=0x0Ee8f5dC7E9BC9AF344eB987B8363b33E737b757

# App
VITE_APP_NAME=SingulAI
EOF
```

### 6. Compilar Frontend
```bash
npm run build
```

### 7. Criar Serviço Systemd
```bash
sudo tee /etc/systemd/system/singulai-frontend.service > /dev/null << 'EOF'
[Unit]
Description=SingulAI Frontend - Vite
Documentation=https://github.com/singulai/platform
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/singulai-platform/frontend
ExecStart=/usr/bin/npm run preview -- --host 0.0.0.0 --port 8080
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF
```

### 8. Ativar Serviço
```bash
sudo systemctl daemon-reload
sudo systemctl enable singulai-frontend
sudo systemctl start singulai-frontend
```

### 9. Verificar Status
```bash
sudo systemctl status singulai-frontend
journalctl -u singulai-frontend -f  # Ver logs em tempo real
```

## ✅ Validação

### Testar Frontend
```bash
# Local (no VPS)
curl http://localhost:8080

# Remoto
curl http://72.60.147.56:8080
```

### Testar Integração com Backend
```bash
curl http://localhost:3004/api/v1/blockchain/health
```

## 📊 URLs em Produção

| Serviço | URL |
|---------|-----|
| **Frontend** | http://72.60.147.56:8080 |
| **Backend API** | http://72.60.147.56:3004/api/v1 |
| **API Health** | http://72.60.147.56:3004/api/v1/blockchain/health |
| **Swagger Docs** | http://72.60.147.56:3004/api/docs |

## 🔧 Comandos Úteis

### Ver Status dos Serviços
```bash
sudo systemctl status singulai-api       # Backend
sudo systemctl status singulai-frontend  # Frontend
```

### Logs
```bash
# Backend
journalctl -u singulai-api -f

# Frontend
journalctl -u singulai-frontend -f

# Últimas 50 linhas
journalctl -u singulai-frontend -n 50
```

### Reiniciar Serviços
```bash
sudo systemctl restart singulai-api
sudo systemctl restart singulai-frontend
```

### Parar Serviços
```bash
sudo systemctl stop singulai-frontend
sudo systemctl stop singulai-api
```

### Atualizar Frontend (Pull Latest)
```bash
cd /root/singulai-platform/frontend
git pull origin main
npm install
npm run build
sudo systemctl restart singulai-frontend
```

## 🐛 Troubleshooting

### Porta 8080 já está em uso
```bash
# Encontrar processo na porta 8080
lsof -i :8080

# Matar processo
kill -9 <PID>
```

### CORS Error do Frontend
Verifique se a API está acessível:
```bash
curl -I http://localhost:3004/api/v1/blockchain/health
```

### Frontend não conecta ao Backend
Cheque variável VITE_API_URL no .env.production:
```bash
grep VITE_API_URL .env.production
```

### Node_modules corrompido
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📈 Monitoramento

### Verificar Espaço em Disco
```bash
df -h
```

### Verificar Memória
```bash
free -h
```

### Verificar CPU
```bash
top -b -n 1 | head -20
```

## 🎯 Próximas Etapas

1. **Configurar Nginx** como reverse proxy (opcional)
2. **Adicionar SSL/TLS** com Let's Encrypt (https://rodrigo.dev)
3. **Configurar CI/CD** com GitHub Actions
4. **Adicionar Monitoring** (Sentry, DataDog)
5. **Otimizar Performance** (Code splitting, lazy loading)

## 📞 Suporte

Para issues ou dúvidas:
1. Verificar logs: `journalctl -u singulai-frontend`
2. Testar conectividade: `curl http://localhost:3004/api/v1/blockchain/health`
3. Checar firewall: `sudo ufw status`

---
**Última Atualização:** 01/01/2026
**Versão:** 1.0
**Status:** ✅ Pronto para Produção
