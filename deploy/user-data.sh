#!/bin/bash
# User Data de EC2-Frontend (Ubuntu 24.04). Se ejecuta como root en el primer arranque.
exec > /var/log/zt-userdata.log 2>&1
set -euxo pipefail

REPO="https://github.com/Sebasramirez68/zt-frontend-23.git"
DOMAIN="ssycrv.duckdns.org"

export DEBIAN_FRONTEND=noninteractive

# 2) Paquetes
apt-get update -y
apt-get install -y nginx certbot python3-certbot-nginx fail2ban iptables git

# 3) Frontend ya compilado (dist/) desde GitHub
git clone "$REPO" /opt/zt-frontend-23
mkdir -p /var/www/zt-frontend
cp -r /opt/zt-frontend-23/dist/. /var/www/zt-frontend/
chown -R www-data:www-data /var/www/zt-frontend

# 4) Nginx: sitio con proxy al backend y encabezados de seguridad
sed "s/__DOMAIN__/${DOMAIN}/g" /opt/zt-frontend-23/deploy/nginx/zt-frontend.conf > /etc/nginx/sites-available/zt-frontend
ln -sf /etc/nginx/sites-available/zt-frontend /etc/nginx/sites-enabled/zt-frontend
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

# 5) Fail2Ban
cp /opt/zt-frontend-23/deploy/fail2ban/filter.d/nginx-login.conf /etc/fail2ban/filter.d/
cp /opt/zt-frontend-23/deploy/fail2ban/jail.local /etc/fail2ban/jail.local
systemctl enable fail2ban
systemctl restart fail2ban

echo "USER-DATA FRONTEND OK"
