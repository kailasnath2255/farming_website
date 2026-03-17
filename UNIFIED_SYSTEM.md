# 🟢 Unified Frontend-Backend System

## Overview
The entire Farmer Market platform now runs as a **single integrated system** on one Express server.

## Architecture

```
SINGLE SERVER (Port 5000)
├── Frontend Files (HTML, CSS, JS)
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   └── frontend-config.js
├── API Endpoints
│   ├── /api/auth/login
│   ├── /api/auth/register
│   ├── /api/products
│   └── ... other endpoints
└── Database (SQLite)
```

## How to Run

**Only ONE command needed:**
```bash
cd backend
npm start
```

The server will:
- ✅ Start on http://localhost:5000
- ✅ Serve all frontend files
- ✅ Serve all API endpoints
- ✅ Initialize SQLite database automatically
- ✅ Seed demo users

## Access Points

| Page | URL |
|------|-----|
| Home | http://localhost:5000/ or http://localhost:5000/index.html |
| Login | http://localhost:5000/login.html |
| Register | http://localhost:5000/register.html |
| Admin | http://localhost:5000/admin.html |
| Farmer | http://localhost:5000/farmer.html |
| Buyer | http://localhost:5000/buyer.html |

## API Base URL

Changed from absolute to relative:
```javascript
// OLD (cross-origin issue)
const API_BASE_URL = 'http://localhost:5000/api';

// NEW (same-origin, no CORS issues)
const API_BASE_URL = '/api';
```

## Demo Credentials

```
Admin:  admin@example.com / admin123
Buyer:  buyer@example.com / test123
Farmer: farmer@example.com / test123
```

## No More Issues

❌ **Eliminated:**
- Cross-origin requests
- Port conflicts
- CORS headers
- Separate server management

✅ **Benefits:**
- Single server to manage
- Same-origin requests
- Simplified debugging
- Easier deployment

## Git Status

Latest commit: `Unified frontend and backend into single Express server`
