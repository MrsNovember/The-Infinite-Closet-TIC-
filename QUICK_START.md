# The Infinite Closet - Quick Start Guide

## 🚀 System is Running!

All 9 Docker containers are operational and healthy.

## ⚡ Quick Commands

### View Status
```bash
cd /www/wwwroot/talkmalk.com
docker-compose ps
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs api-gateway -f
docker-compose logs postgres -f
```

### Stop/Start
```bash
# Stop all services
docker-compose down

# Start all services
docker-compose up -d
```

### Access Services

**Main Application (Nginx)**
- http://localhost:8080

**API Gateway**
- http://localhost:3010/health

**Web Mirror**
- http://localhost:3011/

**Databases**
- PostgreSQL: localhost:5433
- MongoDB: localhost:27018
- Redis: localhost:6380

### Database Access

```bash
# PostgreSQL
docker exec -it tic_postgres psql -U tic_user -d tic_main

# MongoDB
docker exec -it tic_mongodb mongosh --username tic_admin --authenticationDatabase admin

# Redis
docker exec -it tic_redis redis-cli
```

## 📝 Configuration Files

- **.env.local** - Environment variables (auto-generated with secure passwords)
- **docker-compose.yml** - Service configuration
- **Dockerfile** - Application image
- **infra/nginx.conf** - Reverse proxy config
- **infra/init-db.sql** - Database schema

## 📚 Documentation

- **DEPLOYMENT_STATUS.md** - Current deployment status and architecture
- **DOCKER_SETUP.md** - Comprehensive Docker setup guide
- **.env.example** - Environment variables template

## 🔧 Next Steps

1. **Add Your Code**
   - Place NestJS backend in `apps/api-gateway/`
   - Place React frontend in `apps/web-mirror/`
   - Update microservices in `microservices/`

2. **Rebuild & Deploy**
   ```bash
   docker-compose build --no-cache
   docker-compose up -d
   ```

3. **Run Migrations**
   ```bash
   docker exec -i tic_postgres psql -U tic_user -d tic_main < infra/init-db.sql
   ```

## 💡 Tips

- All services auto-restart on failure
- Databases use persistent volumes
- Services communicate via internal Docker network
- Use `.env.local` for secrets (not in git)
- Check `DOCKER_SETUP.md` for SSL/TLS setup

---

**Status**: ✅ All systems operational
**Services**: 9/9 healthy
**Network**: tic_network (172.20.0.0/16)
**Isolation**: Complete (no conflicts with other apps)
