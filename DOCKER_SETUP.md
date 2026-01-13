# The Infinite Closet (TIC) - Docker Setup Guide

## Overview

This guide explains how to run **The Infinite Closet** project using Docker with aaPanel. The containerized setup ensures complete isolation from other applications on your server while providing a production-ready architecture.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     talkmalk.com                             │
│              (Nginx Reverse Proxy on port 80)                │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  API Gateway │  │  Web Mirror  │  │   Nginx      │       │
│  │  (NestJS)    │  │   (React)    │  │              │       │
│  │ :3000        │  │   :3001      │  │ Routes       │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│         │                    │                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ AI Stylist   │  │ Avatar Gen   │  │  PostgreSQL  │       │
│  │ (FastAPI)    │  │ (FastAPI)    │  │   :5432      │       │
│  │ :8000        │  │ :8001        │  │              │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│         │                    │                │               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  Redis       │  │   MongoDB    │  │  Volumes     │       │
│  │ :6379        │  │  :27017      │  │ (persistent) │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                     Docker Network (tic_network)
```

## Quick Start

### 1. Copy Environment Configuration

```bash
cd /www/wwwroot/talkmalk.com
cp .env.example .env.local
```

Edit `.env.local` and change all `change_me` passwords to secure values:

```bash
# Generate secure passwords
openssl rand -base64 32  # For DB passwords
openssl rand -base64 32  # For JWT_SECRET

# Edit the file with your values
nano .env.local
```

### 2. Build Docker Image

```bash
cd /www/wwwroot/talkmalk.com

# Build the main application image
docker build -t tic-app:latest .

# Verify the build
docker images | grep tic-app
```

### 3. Start All Services

```bash
# Navigate to the project directory
cd /www/wwwroot/talkmalk.com

# Start all containers in the background
docker-compose up -d

# Check container status
docker-compose ps

# View logs
docker-compose logs -f
```

### 4. Verify Services Are Running

```bash
# Check all containers
docker ps | grep tic_

# Test API Gateway health
curl http://localhost:3000/health

# Test Nginx health
curl http://localhost/health

# Check Docker network
docker network inspect tic_network
```

## Environment Variables

### Critical Security Variables

Create `.env.local` with these minimum settings:

```env
# Database Passwords (generate with: openssl rand -base64 32)
DB_POSTGRES_PASSWORD=your_secure_postgres_password
DB_MONGO_PASSWORD=your_secure_mongo_password
REDIS_PASSWORD=your_secure_redis_password

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=your_secure_jwt_secret

# API Keys
STRIPE_PUBLIC_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key

# Email
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

**Important**: Never commit `.env.local` to git. The file is in `.gitignore`.

## Docker Commands

### Container Management

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# Rebuild images
docker-compose build --no-cache

# View logs
docker-compose logs -f api-gateway
docker-compose logs -f ai-stylist
docker-compose logs -f postgres
```

### Database Access

```bash
# Access PostgreSQL
docker exec -it tic_postgres psql -U tic_user -d tic_main

# Access MongoDB
docker exec -it tic_mongodb mongosh --username tic_admin --authenticationDatabase admin

# Access Redis
docker exec -it tic_redis redis-cli -a your_redis_password
```

### Debugging

```bash
# View container logs
docker-compose logs postgres
docker-compose logs api-gateway

# Execute command in container
docker exec -it tic_api_gateway npm run typeorm migration:run

# Shell access to container
docker exec -it tic_api_gateway /bin/sh

# Check resource usage
docker stats

# Inspect container
docker inspect tic_api_gateway
```

## Integration with aaPanel

### Using Docker in aaPanel

1. **Open aaPanel Dashboard** (port 8888)
   - Navigate to your aaPanel installation

2. **Create New Site**
   - Domain: `talkmalk.com`
   - Create an empty directory or use existing
   - Point to `/www/wwwroot/talkmalk.com`

3. **Configure in aaPanel**
   - Disable PHP (since we're using Docker)
   - Disable default Nginx configuration
   - Use custom Nginx config

4. **Custom Nginx Configuration in aaPanel**
   - Go to: Websites → talkmalk.com → Nginx Reverse Proxy
   - Add reverse proxy rule:
     ```
     Location: /
     Proxy URL: http://127.0.0.1 (our Nginx will handle routing)
     ```

### Alternatively: Use Docker Containers Directly

```bash
# Stop aaPanel's Nginx for this domain
# And manage everything via Docker Compose

# Check if Docker is using the same network as aaPanel
docker-compose up -d
```

## Ports and Access

| Service | Port | URL | Purpose |
|---------|------|-----|---------|
| Nginx (HTTP) | 80 | http://talkmalk.com | Web interface (reverse proxy) |
| API Gateway | 3000 | http://localhost:3000 | NestJS API (internal) |
| Web Mirror | 3001 | http://localhost:3001 | React App (internal) |
| AI Stylist | 8000 | http://localhost:8000 | FastAPI service (internal) |
| Avatar Gen | 8001 | http://localhost:8001 | FastAPI service (internal) |
| PostgreSQL | 5432 | localhost:5432 | Database |
| MongoDB | 27017 | localhost:27017 | Document DB |
| Redis | 6379 | localhost:6379 | Cache |

**Note**: Only port 80 (Nginx) is exposed externally. All other services are on the internal Docker network.

## Volumes and Persistence

The Docker setup uses persistent volumes for data:

```bash
# List volumes
docker volume ls | grep tic_

# Inspect a volume
docker volume inspect talkmalk.com_postgres_data

# Backup PostgreSQL data
docker exec tic_postgres pg_dump -U tic_user -d tic_main > backup.sql

# Restore PostgreSQL data
docker exec -i tic_postgres psql -U tic_user -d tic_main < backup.sql
```

## Monitoring and Health Checks

### Healthchecks

Each service includes automatic healthchecks:

```bash
# View healthcheck status
docker ps --format "table {{.Names}}\t{{.Status}}"

# Sample output:
# tic_postgres        Up 5 minutes (healthy)
# tic_mongodb         Up 5 minutes (healthy)
# tic_redis           Up 5 minutes (healthy)
# tic_api_gateway     Up 5 minutes (healthy)
```

### Resource Monitoring

```bash
# Real-time resource usage
docker stats

# Check disk usage
docker system df

# Cleanup unused images/volumes
docker system prune
```

## Common Issues and Solutions

### Issue: "Address already in use"

```bash
# Find process using the port
lsof -i :80
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or change the port in docker-compose.yml
```

### Issue: Database Connection Failed

```bash
# Check if PostgreSQL is healthy
docker-compose ps postgres

# View PostgreSQL logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

### Issue: Container Keeps Restarting

```bash
# Check logs
docker-compose logs api-gateway

# Check if dependencies are ready
docker-compose logs --follow

# Ensure all services are healthy
docker-compose ps
```

### Issue: Out of Disk Space

```bash
# Check disk usage
df -h

# Clean up Docker
docker system prune -a

# Remove specific volumes (WARNING: deletes data!)
docker volume rm talkmalk.com_postgres_data
```

## Production Deployment

### SSL/TLS Configuration

1. **Generate SSL Certificate** (using Let's Encrypt):

```bash
# Install certbot
apt-get install certbot python3-certbot-nginx

# Generate certificate
certbot certonly --standalone -d talkmalk.com -d www.talkmalk.com

# Copy certificate to project
mkdir -p /www/wwwroot/talkmalk.com/infra/ssl
cp /etc/letsencrypt/live/talkmalk.com/privkey.pem /www/wwwroot/talkmalk.com/infra/ssl/private.key
cp /etc/letsencrypt/live/talkmalk.com/fullchain.pem /www/wwwroot/talkmalk.com/infra/ssl/certificate.crt

# Update .env.local
SSL_ENABLED=true
```

2. **Update nginx.conf** to use HTTPS

### Backup Strategy

```bash
# Daily backup script
#!/bin/bash
BACKUP_DIR="/backup/tic-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

# PostgreSQL backup
docker exec tic_postgres pg_dump -U tic_user -d tic_main | \
    gzip > "$BACKUP_DIR/postgres-dump.sql.gz"

# MongoDB backup
docker exec tic_mongodb mongodump --authenticationDatabase admin \
    -u tic_admin -p "$DB_MONGO_PASSWORD" --out "$BACKUP_DIR/mongodb"

# Backup volumes
docker run --rm -v talkmalk.com_postgres_data:/data \
    -v "$BACKUP_DIR":/backup alpine tar czf /backup/postgres-volume.tar.gz /data

echo "Backup completed: $BACKUP_DIR"
```

### Auto-Restart on System Reboot

Add to `/etc/docker/daemon.json`:

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2"
}
```

Docker Compose restart policy is already set to `unless-stopped` in our config.

## Updating and Maintenance

### Update Containers

```bash
# Pull latest images
docker-compose pull

# Rebuild and restart
docker-compose up -d --build

# Check for updated base images
docker images

# Update specific service
docker-compose build --no-cache api-gateway
docker-compose up -d api-gateway
```

### Database Migrations

```bash
# Run Prisma migrations
docker-compose exec api-gateway npm run prisma:migrate

# Create new migration
docker-compose exec api-gateway npm run prisma:generate
```

## Performance Tuning

### Optimize Docker Resources

```yaml
# In docker-compose.yml, add resource limits:
services:
  api-gateway:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 512M
```

### Enable Docker Buildkit

```bash
# Faster builds
DOCKER_BUILDKIT=1 docker-compose build
```

## Support and Troubleshooting

### Useful Links
- Docker Documentation: https://docs.docker.com/
- Docker Compose: https://docs.docker.com/compose/
- NestJS Documentation: https://docs.nestjs.com/
- FastAPI Documentation: https://fastapi.tiangolo.com/

### Getting Help

1. Check logs: `docker-compose logs -f`
2. Verify containers: `docker-compose ps`
3. Test connectivity: `docker exec tic_api_gateway curl localhost:3000/health`
4. Review environment: `docker-compose config`

---

**The Infinite Closet** is now running in a completely isolated Docker environment, fully managed by Docker Compose, and accessible via `http://talkmalk.com` 🚀
