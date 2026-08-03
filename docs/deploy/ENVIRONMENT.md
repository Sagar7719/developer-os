# Developer OS — Environment Variables & GitHub Secrets Matrix

## Quick-Start Summary
Never commit `.env` files to Git. Populate local environment variables in `.env` and production secrets in GitHub Secrets or Cloud Provider Dashboards.

---

## Environment Variable Matrix

| Variable Name | Required | Default / Mode | Description |
| :--- | :---: | :---: | :--- |
| `NODE_ENV` | **Yes** | `development` / `production` | Execution mode |
| `PORT` | **Yes** | `5000` | Express API server port |
| `CLIENT_ORIGIN` | **Yes** | `http://localhost:5173` | Allowed CORS domain |
| `MONGO_URI` | **Yes** | — | MongoDB connection string |
| `JWT_ACCESS_SECRET` | **Yes** | — | Secret key for access tokens |
| `JWT_REFRESH_SECRET` | **Yes** | — | Secret key for refresh tokens |
| `CONTACT_RECEIVER_EMAIL` | Production | `admin@developer-os.dev` | Recipient email for contact form notifications |
| `TRUST_PROXY` | Production | `1` | Enables reverse proxy client IP extraction |

---

## GitHub Secrets Setup Guide
When configuring GitHub Actions CI/CD workflows, set the following secrets in GitHub Repository Settings -> **Secrets and Variables** -> **Actions**:
- `MONGO_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `CONTACT_RECEIVER_EMAIL`
