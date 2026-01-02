#!/bin/bash

# Script para configurar SSL/HTTPS na VPS
# Instala Certbot e gera certificado Let's Encrypt

set -e

DOMAIN="singulai.site"
EMAIL="admin@singulai.site"

echo "🔐 Configurando SSL/HTTPS para $DOMAIN"
echo "========================================"
echo ""

# 1. Instalar Certbot
echo "1️⃣ Instalando Certbot..."
apt-get update -qq
apt-get install -y -qq certbot python3-certbot-nginx

# 2. Gerar certificado
echo "2️⃣ Gerando certificado SSL..."
certbot certonly --nginx \
  -d $DOMAIN \
  -d www.$DOMAIN \
  --non-interactive \
  --agree-tos \
  -m $EMAIL \
  --expand

# 3. Atualizar configuração nginx com SSL
echo "3️⃣ Atualizando configuração nginx..."
cat > /etc/nginx/sites-available/$DOMAIN << 'EOF'
# HTTP - Redirecionar para HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name singulai.site www.singulai.site;
    return 301 https://$server_name$request_uri;
}

# HTTPS - Frontend React
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name singulai.site www.singulai.site;

    # Certificados SSL
    ssl_certificate /etc/letsencrypt/live/singulai.site/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/singulai.site/privkey.pem;

    # Configurações SSL seguras
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Root directory
    root /root/singulai-platform/frontend/dist;
    index index.html;

    # Logs
    access_log /var/log/nginx/singulai-access.log;
    error_log /var/log/nginx/singulai-error.log;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/javascript application/json;
    gzip_min_length 1000;

    # Cache de assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # API Proxy (se tiver backend)
    location /api/ {
        proxy_pass http://localhost:3004/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

# 4. Ativar site no nginx
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/$DOMAIN
rm -f /etc/nginx/sites-enabled/default

# 5. Testar configuração nginx
echo "4️⃣ Testando configuração nginx..."
nginx -t

# 6. Recarregar nginx
echo "5️⃣ Recarregando nginx..."
systemctl reload nginx

# 7. Configurar auto-renovação
echo "6️⃣ Configurando auto-renovação de certificado..."
cat > /etc/systemd/system/certbot-renew.service << 'EOF2'
[Unit]
Description=Certbot renewal service
After=network.target

[Service]
Type=oneshot
ExecStart=/usr/bin/certbot renew --quiet --agree-tos
EOF2

cat > /etc/systemd/system/certbot-renew.timer << 'EOF2'
[Unit]
Description=Run Certbot renewal daily
Requires=certbot-renew.service

[Timer]
OnCalendar=daily
OnBootSec=1h
Persistent=true

[Install]
WantedBy=timers.target
EOF2

systemctl daemon-reload
systemctl enable certbot-renew.timer
systemctl start certbot-renew.timer

# 8. Sucesso!
echo ""
echo "✅ SSL CONFIGURADO COM SUCESSO!"
echo "=================================="
echo ""
echo "🔒 Certificado instalado para:"
echo "   - singulai.site"
echo "   - www.singulai.site"
echo ""
echo "🌐 Acesse seu site:"
echo "   - https://singulai.site"
echo "   - https://www.singulai.site"
echo ""
echo "🔄 Auto-renovação:"
echo "   - Timer ativado (diariamente)"
echo "   - Verificar: systemctl status certbot-renew.timer"
echo ""
echo "📊 Verificar certificado:"
echo "   certbot certificates"
echo ""
echo "🔐 Testar segurança:"
echo "   https://www.ssllabs.com/ssltest/analyze.html?d=singulai.site"
echo ""
