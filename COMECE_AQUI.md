# 🚀 COMECE AQUI - Deploy Frontend SingulAI

## ⚡ Quick Start (5 minutos)

Você está logado no VPS? Ótimo! Copie e cole este comando:

```bash
curl -fsSL https://raw.githubusercontent.com/GrupoWinS/frontMVP1/main/deploy-vps.sh | bash
```

**Pronto!** O frontend está rodando em http://72.60.147.56:8080

---

## 📋 Se Preferir Passo a Passo

### 1️⃣ Clonar o Frontend
```bash
git clone https://github.com/GrupoWinS/frontMVP1.git /root/singulai-platform/frontend
cd /root/singulai-platform/frontend
```

### 2️⃣ Instalar Dependências
```bash
npm install
```

### 3️⃣ Compilar
```bash
npm run build
```

### 4️⃣ Criar Serviço Systemd
```bash
sudo tee /etc/systemd/system/singulai-frontend.service > /dev/null << 'EOL'
[Unit]
Description=SingulAI Frontend - Vite React
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
EOL
```

### 5️⃣ Ativar
```bash
sudo systemctl daemon-reload
sudo systemctl enable singulai-frontend
sudo systemctl start singulai-frontend
```

### 6️⃣ Verificar
```bash
sudo systemctl status singulai-frontend
```

---

## ✅ Validação

Abra no navegador:

**http://72.60.147.56:8080**

---

## 🔧 Próximos Comandos Úteis

```bash
# Ver logs
journalctl -u singulai-frontend -f

# Reiniciar
systemctl restart singulai-frontend

# Parar
systemctl stop singulai-frontend

# Ver status do backend também
systemctl status singulai-api
```

---

## 📡 URLs Finais

- **Frontend:** http://72.60.147.56:8080
- **Backend API:** http://72.60.147.56:3004/api/v1
- **Swagger:** http://72.60.147.56:3004/api/docs

---

## ❓ Dúvidas?

- **Não inicia?** → `journalctl -u singulai-frontend -n 50`
- **Porta ocupada?** → `lsof -i :8080`
- **Sem conexão?** → `curl http://localhost:3004/api/v1/blockchain/health`

---

## 📚 Documentação

- `RESUMO_EXECUTIVO.md` - Visão geral completa
- `DEPLOY_GUIDE.md` - Guia detalhado
- `QUICK_DEPLOY.md` - Troubleshooting
- `RUN_DEPLOY.txt` - Instruções visuais

---

**Status:** ✅ Pronto para Produção!

**Desenvolvido:** 01/01/2026
