# Documentación de Despliegue - TalentHub

## 📋 Información del Servidor

**Proveedor:** Hetzner VPS  
**IP:** `[REDACTED - Ver 1Password/Bitwarden]`  
**OS:** Ubuntu 24.04 LTS  
**RAM:** 4GB  
**Dominio:** https://talent.bitxodev.com  

**Arquitectura:**
- Proxy inverso: Nginx Proxy Manager (Docker)
- SSL: Cloudflare Origin Certificate
- Firewall: UFW + Fail2ban
- CI/CD: GitHub Actions

---

## 🚀 Stack de Producción

### Backend
- **Runtime:** Node.js 20.19-alpine
- **Framework:** Express + TypeScript
- **ORM:** Prisma
- **Base de datos:** PostgreSQL 16-alpine
- **Puerto interno:** 3000
- **API IA:** Google Gemini API

### Frontend
- **Framework:** React + Vite + TypeScript
- **Servidor:** Nginx 1.29.8-alpine
- **Puerto interno:** 80

### Base de Datos
- **Motor:** PostgreSQL 16-alpine
- **Puerto interno:** 5432 (solo red Docker interna)
- **Healthcheck:** `pg_isready -U talenthub`

---

## 🔐 Variables de Entorno (Producción)

### Backend (`backend/.env`)
```bash
NODE_ENV=production
PORT=3000
DATABASE_URL="postgresql://talenthub:[PASSWORD]@talenthub-postgres:5432/talenthub"
JWT_SECRET="[REDACTED - 64 caracteres aleatorios]"
GEMINI_API_KEY="[REDACTED - Ver Google Cloud Console]"
CORS_ORIGIN="https://talent.bitxodev.com"
```

**⚠️ IMPORTANTE:** 
- Los valores reales están SOLO en el servidor en `/home/void/proyectos/talenthub/backend/.env`
- NUNCA commitear archivos `.env` con valores reales
- Usar variables de entorno de GitHub Secrets para CI/CD

---

## 📦 Docker Compose

El proyecto usa multi-stage builds para optimizar las imágenes:

**Servicios:**
- `postgres`: Base de datos PostgreSQL con volumen persistente
- `backend`: API Node.js con Prisma
- `frontend`: Aplicación React servida por Nginx

**Red:** `nginx-proxy_default` (compartida con Nginx Proxy Manager)

**Archivos:**
- `docker-compose.yml` - Configuración base (commiteado)
- `docker-compose.override.yml` - Variables sensibles (NO commiteado)

---

## 🔄 CI/CD - GitHub Actions

### Workflow de Auto-Deploy

**Ubicación:** `.github/workflows/deploy.yml`

**Trigger:** Push a rama `main`

**Pasos:**
1. Conecta al servidor vía SSH (puerto 2222)
2. Ejecuta `git pull origin main`
3. Para contenedores: `docker compose down`
4. Rebuild imágenes: `docker compose up -d --build`
5. Contenedores arrancan automáticamente

**Tiempo de deploy:** ~30-40 segundos (con cache de Docker)

### Secrets de GitHub

Configurados en: `Settings → Secrets and variables → Actions`

- `VPS_HOST`: [IP del servidor]
- `VPS_USER`: void
- `VPS_SSH_KEY`: Clave privada ed25519 (generada específicamente para GitHub Actions)

**⚠️ NUNCA exponer estos valores en código o logs públicos**

---

## 🔧 Configuración del Servidor

### Nginx Proxy Manager

**Proxy Host configurado:**
- Domain: `talent.bitxodev.com`
- Forward: `http://talenthub-frontend:80`
- SSL: Cloudflare Origin Certificate
- Websockets: Habilitado
- Force SSL: Sí

### Firewall UFW

**Puertos abiertos:**
- 80/tcp: HTTP (redirige a 443)
- 443/tcp: HTTPS
- 2222/tcp: SSH (puerto no estándar)
- 10000-20000/udp: RTP Asterisk (otros proyectos)

**Puertos cerrados al exterior:**
- 5432/tcp: PostgreSQL (solo red Docker interna)
- 3000/tcp: Backend (solo red Docker interna)
- 81/tcp: Panel NPM (acceso solo vía SSH tunnel)

### Fail2ban

- Jail SSH activo
- Protección contra brute-force
- Logs en `/var/log/fail2ban.log`

---

## 💾 Backups Automáticos

### PostgreSQL
**Script:** `/home/void/backups/backup-postgres.sh`  
**Frecuencia:** Diaria 3:00 AM UTC  
**Retención:** 7 días  
**Ubicación:** `/home/void/backups/postgres/talenthub_YYYYMMDD_HHMMSS.sql.gz`  
**Log:** `/home/void/backups/postgres.log`

### Cron
```cron
0 3 * * * /home/void/backups/backup-postgres.sh >> /home/void/backups/postgres.log 2>&1
```

### Restaurar desde backup
```bash
# Descomprimir backup
gunzip talenthub_20260419_030000.sql.gz

# Restaurar
docker exec -i talenthub-postgres psql -U talenthub -d talenthub < talenthub_20260419_030000.sql
```

---

## 🚀 Proceso de Deploy Manual

Si necesitas hacer deploy manual (sin GitHub Actions):

```bash
# Conectar al servidor
ssh void@[VPS_IP] -p 2222

# Ir al proyecto
cd ~/proyectos/talenthub

# Pull cambios
git pull origin main

# Rebuild y deploy
docker compose down
docker compose up -d --build

# Verificar logs
docker logs talenthub-backend --tail 50
docker logs talenthub-frontend --tail 20

# Verificar salud
docker ps | grep talenthub
curl https://talent.bitxodev.com
```

---

## 🔍 Troubleshooting

### Backend no arranca

```bash
# Ver logs detallados
docker logs talenthub-backend

# Verificar variables de entorno (SIN mostrar valores)
docker exec talenthub-backend env | grep -E "NODE_ENV|DATABASE_URL" | sed 's/=.*/=***/'

# Verificar conexión a PostgreSQL
docker exec talenthub-postgres pg_isready -U talenthub
```

### Frontend devuelve 502

```bash
# Verificar que Nginx esté corriendo
docker logs talenthub-frontend

# Verificar configuración de NPM
# Acceder vía SSH tunnel al puerto 81 y revisar proxy host
ssh -L 8081:localhost:81 void@[VPS_IP] -p 2222
# Luego abrir http://localhost:8081
```

### Base de datos no conecta

```bash
# Verificar que PostgreSQL esté healthy
docker ps | grep postgres

# Ver logs de PostgreSQL
docker logs talenthub-postgres

# Conectar manualmente a la BBDD
docker exec -it talenthub-postgres psql -U talenthub -d talenthub
```

### GitHub Actions falla

**Errores comunes:**

1. **SSH timeout:** Verificar que UFW permite puerto 2222
2. **SSH key error:** Verificar formato del secret (6 líneas con BEGIN/END)
3. **Git pull fails:** Verificar permisos del directorio en el servidor
4. **Docker build fails:** Revisar logs en GitHub Actions

---

## 📊 Monitoreo

### Endpoints de Health

- **Frontend:** https://talent.bitxodev.com
- **Backend Health:** https://talent.bitxodev.com/api/health
- **Backend debe responder:** `{"status":"ok","timestamp":"..."}`

### Logs en tiempo real

```bash
# Backend
docker logs -f talenthub-backend

# Frontend (Nginx)
docker logs -f talenthub-frontend

# PostgreSQL
docker logs -f talenthub-postgres

# Todos juntos
docker compose logs -f
```

### Métricas de uso

```bash
# Uso de recursos
docker stats

# Espacio en disco
df -h

# Logs de PostgreSQL
docker exec talenthub-postgres psql -U talenthub -d talenthub -c "SELECT pg_size_pretty(pg_database_size('talenthub'));"
```

---

## 🔒 Seguridad

### Medidas implementadas

1. ✅ JWT Secret rotado (64 caracteres aleatorios)
2. ✅ Base de datos NO expuesta públicamente
3. ✅ SSH en puerto no estándar (2222)
4. ✅ Fail2ban protegiendo SSH
5. ✅ SSL/TLS con Cloudflare Origin Certificate
6. ✅ CORS configurado solo para dominio de producción
7. ✅ Passwords de BBDD seguros (64+ caracteres)
8. ✅ Backups automáticos diarios
9. ✅ Actualizaciones de seguridad Node.js (20.19-alpine)
10. ✅ Root login deshabilitado
11. ✅ GitHub Actions con SSH key dedicada (no reutilizada)
12. ✅ Variables de entorno NUNCA en Git

### Archivos NUNCA commitear

Añadidos a `.gitignore`:
backend/.env
frontend/.env
frontend/.env.production
docker-compose.override.yml
*.pem
*.key

### Rotación de credenciales

**Cada 90 días rotar:**
- JWT_SECRET
- Database password
- GitHub Actions SSH key

**Comando para generar JWT_SECRET nuevo:**
```bash
openssl rand -hex 32
```

---

## 📝 Checklist Pre-Deploy

Antes de hacer deploy a producción, verificar:

- [ ] `.env` con valores de producción creado (NO commiteado)
- [ ] `GEMINI_API_KEY` válida y con créditos
- [ ] `JWT_SECRET` generado nuevo (64 caracteres)
- [ ] `DATABASE_URL` apunta a PostgreSQL de producción
- [ ] `CORS_ORIGIN` es dominio de producción
- [ ] Frontend `.env.production` con `VITE_API_URL` correcto
- [ ] Migraciones de Prisma ejecutadas
- [ ] Backups automáticos configurados
- [ ] SSL/TLS configurado en Nginx Proxy Manager
- [ ] Firewall UFW activo y configurado
- [ ] Fail2ban activo
- [ ] GitHub Secrets configurados
- [ ] DNS apuntando al servidor

---

## 🔗 Enlaces Útiles

- **Aplicación:** https://talent.bitxodev.com
- **Repositorio:** https://github.com/Bitxogm/CV-Generator-Gemini_Version
- **GitHub Actions:** https://github.com/Bitxogm/CV-Generator-Gemini_Version/actions
- **Documentación Prisma:** https://www.prisma.io/docs
- **Nginx Proxy Manager:** https://nginxproxymanager.com/guide/

---

## 👥 Equipo

**Desarrolladores:** Otaku&Obama Development  
**Contacto:** [Configurar en GitHub Issues]  
**Última actualización:** 2026-04-19

---

## 📄 Licencia

MIT — ver [LICENSE](LICENSE).