# Developer OS — Pre-Flight Production Deployment Checklist

## Quick-Start Summary
Complete every verification step below before marking a release production-ready.

---

## 1. Environment & Security
- [ ] `.env` and secret files are excluded from Git repository (`.gitignore` verified).
- [ ] All mandatory production variables (`MONGO_URI`, `JWT_ACCESS_SECRET`, `CONTACT_RECEIVER_EMAIL`) are configured in cloud dashboard.
- [ ] `TRUST_PROXY=1` is set when running behind Nginx or load balancers.

---

## 2. Build & Verification
- [ ] `pnpm --filter @developer-os/client run build` completes with zero errors.
- [ ] `pnpm run lint` passes cleanly.
- [ ] Docker images compile cleanly without cache errors.

---

## 3. Health & Monitoring
- [ ] Endpoint `GET /api/v1/health` returns HTTP 200 OK.
- [ ] Client static SPA pages load without console errors.
- [ ] MongoDB container health status is `healthy`.
