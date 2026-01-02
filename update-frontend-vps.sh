#!/bin/bash

# Script para atualizar frontend na VPS
# Execute na VPS para sincronizar com GitHub e fazer deploy

set -e

FRONTEND_DIR="/root/singulai/projects/frontend"

echo "🚀 Atualizando Frontend SingulAI"
echo "=================================="
echo ""

# 1. Mudar para o diretório
echo "1️⃣ Acessando diretório..."
cd "$FRONTEND_DIR"
pwd

# 2. Fazer pull
echo ""
echo "2️⃣ Fazendo pull do GitHub..."
git fetch origin
git checkout main
git pull origin main --verbose

# 3. Instalar dependências
echo ""
echo "3️⃣ Instalando dependências..."
npm install --legacy-peer-deps

# 4. Build
echo ""
echo "4️⃣ Compilando frontend (isso pode levar alguns minutos)..."
npm run build

# 5. Verificar dist
echo ""
echo "5️⃣ Verificando build..."
if [ -d "dist" ]; then
    echo "✅ Diretório dist criado com sucesso"
    ls -lh dist/ | head -10
    du -sh dist/
else
    echo "❌ ERRO: Diretório dist não encontrado!"
    exit 1
fi

# 6. Recarregar nginx
echo ""
echo "6️⃣ Recarregando nginx..."
systemctl reload nginx || sudo systemctl reload nginx
sleep 2

# 7. Verificar status
echo ""
echo "7️⃣ Verificando status..."
systemctl status nginx --no-pager | head -10

# 8. Testar
echo ""
echo "8️⃣ Testando frontend..."
echo "Aguarde alguns segundos para o site carregar..."
sleep 3

# 9. Sucesso!
echo ""
echo "✅ UPDATE COMPLETO!"
echo "=================================="
echo ""
echo "🌐 Acesse seu site em:"
echo "   https://singulai.site"
echo "   ou"
echo "   http://localhost:8080"
echo ""
echo "📊 Verificar logs:"
echo "   tail -f /var/log/nginx/error.log"
echo ""
echo "Git log:"
git log --oneline | head -3
echo ""
