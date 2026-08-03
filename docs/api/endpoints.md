# Active Implemented API Endpoints Reference (v0.3.0)

> **Purpose**: Complete endpoint reference manual for all active, implemented Developer OS endpoints (Health check and Authentication routes).  
> **Document Status**: Active  
> **Audience**: Frontend Engineers, API Consumers, and Integration Developers  
> **Last Updated Version**: v0.3.0  
> **Estimated Reading Time**: 6 min read  
> **Related Documents**: [API Overview](README.md) | [Identity & Auth Specs](../authentication/README.md) | [Backend Engine Specs](../backend/README.md)

---

## Navigation
**[← API Overview](README.md)** | **[Endpoints Reference](endpoints.md)** | **[Next: Database Specs →](../database/README.md)**

---

## 1. Health Diagnostics API

### `GET /api/v1/health`

- **Purpose**: Verifies that the Express service is running and tests database connectivity via MongoDB ping.
- **Method**: `GET`
- **URL**: `/api/v1/health`
- **Authentication Required**: No (Public)
- **Headers**: None
- **Request Body**: None

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Developer OS API Service is healthy and operational.",
  "data": {
    "service": "Developer OS API Service",
    "brand": "Sagar.dev",
    "environment": "development",
    "uptime": 142.89,
    "memory": {
      "rss": "42 MB",
      "heapTotal": "28 MB",
      "heapUsed": "18 MB"
    },
    "database": {
      "isConnected": true,
      "state": "connected",
      "pingMs": 12
    }
  },
  "timestamp": "2026-08-03T00:00:00.000Z"
}
```

#### Possible Error Responses:
- **`500 Internal Server Error`**: Returned if MongoDB ping fails or database connection drops.

---

## 2. Authentication & Identity APIs

### `POST /api/v1/auth/register`

- **Purpose**: Registers a new user account, hashes password using `bcryptjs`, issues Access Token, sets SHA-256 hashed Refresh Token `httpOnly` cookie, and returns sanitized `UserDTO`.
- **Method**: `POST`
- **URL**: `/api/v1/auth/register`
- **Authentication Required**: No (Public)
- **Request Body**:
  ```json
  {
    "name": "Sagar Dev",
    "email": "sagar@sagar.dev",
    "password": "SecurePassword123!",
    "role": "ADMIN"
  }
  ```

#### Success Response (`201 Created`):
*Sets Set-Cookie header*: `refreshToken=...; HttpOnly; Path=/api/v1/auth; SameSite=Strict`

```json
{
  "success": true,
  "statusCode": 201,
  "message": "User registered successfully.",
  "data": {
    "user": {
      "id": "65b2f8c2e4b0123456789abc",
      "name": "Sagar Dev",
      "email": "sagar@sagar.dev",
      "role": "ADMIN",
      "isActive": true,
      "createdAt": "2026-08-03T00:00:00.000Z",
      "updatedAt": "2026-08-03T00:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2026-08-03T00:00:00.000Z"
}
```

#### Possible Error Responses:
- **`400 Bad Request`**: Validation error (invalid email format, password under 8 chars, missing name).
- **`409 Conflict`**: An account with the specified email already exists.

---

### `POST /api/v1/auth/login`

- **Purpose**: Authenticates user credentials, issues Access Token, and sets `httpOnly` Refresh Token cookie.
- **Method**: `POST`
- **URL**: `/api/v1/auth/login`
- **Authentication Required**: No (Public)
- **Request Body**:
  ```json
  {
    "email": "sagar@sagar.dev",
    "password": "SecurePassword123!"
  }
  ```

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Authentication successful.",
  "data": {
    "user": {
      "id": "65b2f8c2e4b0123456789abc",
      "name": "Sagar Dev",
      "email": "sagar@sagar.dev",
      "role": "ADMIN",
      "isActive": true,
      "createdAt": "2026-08-03T00:00:00.000Z",
      "updatedAt": "2026-08-03T00:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2026-08-03T00:00:00.000Z"
}
```

#### Possible Error Responses:
- **`400 Bad Request`**: Missing email or password fields.
- **`401 Unauthorized`**: Generic error message (`"Invalid email or password."`) on credential mismatch or inactive user account.

---

### `POST /api/v1/auth/logout`

- **Purpose**: Revokes the active session by removing the SHA-256 refresh token hash from database and clearing the `httpOnly` cookie.
- **Method**: `POST`
- **URL**: `/api/v1/auth/logout`
- **Authentication Required**: Yes (`Authorization: Bearer <access_token>`)
- **Request Body**: Optional `{ "refreshToken": "..." }` if cookie is absent.

#### Success Response (`200 OK`):
*Clears Set-Cookie header*: `refreshToken=; Path=/api/v1/auth; Expires=Thu, 01 Jan 1970 00:00:00 GMT`

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Logged out successfully.",
  "data": null,
  "timestamp": "2026-08-03T00:00:00.000Z"
}
```

#### Possible Error Responses:
- **`401 Unauthorized`**: Missing or invalid Bearer access token.

---

### `POST /api/v1/auth/refresh-token`

- **Purpose**: Verifies refresh token, rotates session token in database, sets new `httpOnly` cookie, and returns new Access Token.
- **Method**: `POST`
- **URL**: `/api/v1/auth/refresh-token`
- **Authentication Required**: No (Uses `httpOnly` Cookie `refreshToken` or body field).
- **Request Body**: Optional `{ "refreshToken": "..." }`.

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Access token refreshed successfully.",
  "data": {
    "user": {
      "id": "65b2f8c2e4b0123456789abc",
      "name": "Sagar Dev",
      "email": "sagar@sagar.dev",
      "role": "ADMIN",
      "isActive": true,
      "createdAt": "2026-08-03T00:00:00.000Z",
      "updatedAt": "2026-08-03T00:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2026-08-03T00:00:00.000Z"
}
```

#### Possible Error Responses:
- **`400 Bad Request`**: Refresh token missing from cookies and request body.
- **`401 Unauthorized`**: Token invalid/expired, or reuse attack detected (triggers full session revocation).

---

### `GET /api/v1/auth/me`

- **Purpose**: Returns the sanitized `UserDTO` profile for the currently authenticated user.
- **Method**: `GET`
- **URL**: `/api/v1/auth/me`
- **Authentication Required**: Yes (`Authorization: Bearer <access_token>`)
- **Headers**: `Authorization: Bearer <access_token>`

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation completed successfully.",
  "data": {
    "user": {
      "id": "65b2f8c2e4b0123456789abc",
      "name": "Sagar Dev",
      "email": "sagar@sagar.dev",
      "role": "ADMIN",
      "isActive": true,
      "createdAt": "2026-08-03T00:00:00.000Z",
      "updatedAt": "2026-08-03T00:00:00.000Z"
    }
  },
  "timestamp": "2026-08-03T00:00:00.000Z"
}
```

#### Possible Error Responses:
- **`401 Unauthorized`**: Missing, malformed, or expired Bearer access token.
- **`404 Not Found`**: User account disabled or deleted.

---

## Navigation
**[← API Overview](README.md)** | **[Endpoints Reference](endpoints.md)** | **[Next: Database Specs →](../database/README.md)**
