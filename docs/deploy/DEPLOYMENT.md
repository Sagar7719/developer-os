# Developer OS — Multi-Platform Production Deployment Guide

## Quick-Start Summary
Deploying Developer OS to production requires:
1. A MongoDB database instance (MongoDB Atlas cluster or Docker container).
2. Deployed Express API Server (`apps/server`) configured with production environment variables.
3. Deployed React SPA Client (`apps/client`) pointing to the server API domain.

---

## 1. Deploying to Render

### Quick-Start
Connect GitHub repo to Render, create a Web Service for `apps/server`, and a Static Site for `apps/client`.

### Prerequisites
- Render account (render.com).
- Connected GitHub repository.
- MongoDB Atlas database connection string.

### Environment Variables
Configure in Render Dashboard under **Environment**:
- `NODE_ENV`: `production`
- `PORT`: `5000`
- `MONGO_URI`: `mongodb+srv://<user>:<password>@cluster.mongodb.net/developer_os`
- `JWT_ACCESS_SECRET`: `<secure-random-string>`
- `JWT_REFRESH_SECRET`: `<secure-random-string>`
- `CLIENT_ORIGIN`: `https://developer-os-client.onrender.com`
- `CONTACT_RECEIVER_EMAIL`: `admin@developer-os.dev`

### Deployment Steps
1. Create a new **Web Service** on Render for the API backend:
   - Root Directory: `apps/server`
   - Build Command: `pnpm install`
   - Start Command: `node src/server.js`
2. Create a new **Static Site** on Render for the frontend:
   - Build Command: `pnpm --filter @developer-os/client run build`
   - Publish Directory: `apps/client/dist`
   - Rewrite Rule: `/*` -> `/index.html` (SPA routing)

### Verification
- API Health: `https://developer-os-server.onrender.com/api/v1/health`
- Client UI: Navigate to frontend domain and verify page load.

### Rollback
Render Dashboard -> **Deploys** -> Select previous successful build -> Click **Rollback**.

### Troubleshooting
- If server fails boot, verify all environment variables in Render Dashboard match required keys.

---

## 2. Deploying to Railway

### Quick-Start
Connect GitHub repo to Railway, add a Railway MongoDB template, and configure Railway services for server and client Dockerfiles.

### Prerequisites
- Railway account (railway.app).
- Railway CLI (optional).

### Environment Variables
- `NODE_ENV=production`
- `MONGO_URI=${{MongoDB.MONGO_URL}}`
- `JWT_ACCESS_SECRET=<secure-key>`
- `CONTACT_RECEIVER_EMAIL=admin@developer-os.dev`

### Deployment Steps
1. Click **New Project** in Railway -> **Deploy from GitHub Repo**.
2. Add **MongoDB** database service from Railway marketplace.
3. Configure API service Dockerfile path: `apps/server/Dockerfile`.
4. Configure Client service Dockerfile path: `apps/client/Dockerfile`.

### Verification
- Test API route: `GET /api/v1/health` (HTTP 200 OK).

### Rollback
Railway Dashboard -> **Deployments** -> Select past deployment -> Click **Redeploy**.

---

## 3. Deploying to a Docker VPS (Ubuntu / Debian)

### Quick-Start
SSH into VPS, clone repo, copy `.env.example` to `.env`, and launch production Docker Compose.

### Prerequisites
- VPS (Ubuntu 22.04 LTS or Debian 12).
- Docker and Docker Compose installed.
- Domain name pointing to VPS public IP.

### Environment Variables
Populate `.env` file on host VPS machine.

### Deployment Steps
```bash
git clone https://github.com/Sagar7719/developer-os.git
cd developer-os
cp .env.example .env
# Edit .env with production credentials
docker compose -f docker-compose.prod.yml up -d --build
```

### Verification
`curl -I http://localhost/api/v1/health`

### Rollback
```bash
docker compose -f docker-compose.prod.yml down
git checkout <previous-commit-hash>
docker compose -f docker-compose.prod.yml up -d --build
```

---

## 4. Deploying to DigitalOcean App Platform

### Quick-Start
Create an App in DigitalOcean, connect GitHub repository, configure server and static client components, set Environment Variables, and deploy.

### Prerequisites
- DigitalOcean account.
- Managed MongoDB database or MongoDB Atlas.

### Deployment Steps
1. Go to **Apps** -> **Create App** -> Select GitHub repository.
2. Add Web Service (`apps/server`) and Static Site (`apps/client`).
3. Add Environment Variables under App Settings.
4. Click **Launch App**.

---

## 5. Deploying to AWS EC2

### Quick-Start
Launch Ubuntu EC2 instance, install Docker, attach Security Group opening ports 80, 443, 22, clone repository, and run Docker Compose.

### Prerequisites
- AWS Account with EC2 access.
- Keypair `.pem` file for SSH.

### Deployment Steps
1. Launch Ubuntu 22.04 LTS EC2 Instance (t3.micro or t3.small).
2. Configure Security Group:
   - HTTP (Port 80)
   - HTTPS (Port 443)
   - SSH (Port 22)
3. SSH into EC2 instance:
   ```bash
   ssh -i key.pem ubuntu@ec2-ip-address
   ```
4. Install Docker & Docker Compose:
   ```bash
   sudo apt update && sudo apt install -y docker.io docker-compose-v2
   sudo usermod -aG docker ubuntu
   ```
5. Clone and start app:
   ```bash
   git clone https://github.com/Sagar7719/developer-os.git
   cd developer-os
   cp .env.example .env
   docker compose -f docker-compose.prod.yml up -d --build
   ```
