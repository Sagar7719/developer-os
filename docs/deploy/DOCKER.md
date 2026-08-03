# Developer OS — Docker & Docker Compose Operational Guide

## Quick-Start Summary
Run local development containers:
```bash
docker compose -f docker-compose.yml up -d
```
Run production containers:
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

---

## Prerequisites
- Docker Engine v24+
- Docker Compose v2+

---

## Development Environment Management

### Launch Containers
```bash
docker compose up -d
```

### View Real-time Logs
```bash
docker compose logs -f server
```

### Stop Containers
```bash
docker compose down
```

---

## Production Container Management

### Build & Start Containers
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

### Inspect Container Health Status
```bash
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

---

## Troubleshooting

| Problem | Cause | Resolution |
| :--- | :--- | :--- |
| MongoDB container exits immediately | Permission denied on mapped volume | Run `sudo chown -r 999:999 mongo-data` |
| Server fails healthcheck | Database connection pending | Check `docker logs developer-os-server-prod` |
