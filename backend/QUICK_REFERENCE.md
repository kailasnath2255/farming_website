# Farmer Market Backend - Quick Reference

## Server Setup

```bash
cd backend
npm install
npm start
```

Server runs on: `http://localhost:5000`

---

## Authentication

All API requests (except login/register) require JWT token in header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Get Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"buyer@example.com","password":"test123"}'
```

---

## Quick API Examples

### 1. Products

**Get all products**
```bash
curl http://localhost:5000/api/products
```

**Create product (Farmer)**
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Tomato",
    "price":5.99,
    "category":"vegetables",
    "description":"Fresh tomatoes"
  }'
```

### 2. Orders

**Create order**
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "products":[{"product_id":1,"quantity":2}],
    "paymentMethod":"card"
  }'
```

**Get my orders**
```bash
curl http://localhost:5000/api/orders/my-orders \
  -H "Authorization: Bearer TOKEN"
```

### 3. Reviews

**Add review**
```bash
curl -X POST http://localhost:5000/api/reviews \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId":1,
    "rating":5,
    "comment":"Great product!"
  }'
```

### 4. Wishlist

**Add to wishlist**
```bash
curl -X POST http://localhost:5000/api/wishlist \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId":1}'
```

**Get my wishlist**
```bash
curl http://localhost:5000/api/wishlist \
  -H "Authorization: Bearer TOKEN"
```

### 5. Admin

**Get analytics**
```bash
curl http://localhost:5000/api/admin/analytics \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## Database

- File: `database.sqlite`
- Automatically created on first run
- Contains all tables with sample data

To reset: Delete `database.sqlite` and restart server

---

## Demo Credentials

```
Admin:  admin@example.com / admin123
Buyer:  buyer@example.com / test123
Farmer: farmer@example.com / test123
```

---

## Response Format

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error details"
}
```

---

## Endpoints Summary

| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| POST | `/api/auth/register` | No | - |
| POST | `/api/auth/login` | No | - |
| GET | `/api/auth/me` | Yes | All |
| PUT | `/api/auth/profile` | Yes | All |
| GET | `/api/products` | No | - |
| POST | `/api/products` | Yes | Farmer |
| PUT | `/api/products/:id` | Yes | Farmer |
| DELETE | `/api/products/:id` | Yes | Farmer/Admin |
| POST | `/api/orders` | Yes | Buyer |
| GET | `/api/orders/my-orders` | Yes | Buyer |
| GET | `/api/orders/farmer-orders` | Yes | Farmer |
| PUT | `/api/orders/:id/status` | Yes | Farmer/Admin |
| POST | `/api/reviews` | Yes | Buyer |
| GET | `/api/reviews/product/:id` | No | - |
| POST | `/api/wishlist` | Yes | Buyer |
| GET | `/api/wishlist` | Yes | Buyer |
| DELETE | `/api/wishlist/:id` | Yes | Buyer |
| GET | `/api/admin/analytics` | Yes | Admin |
| GET | `/api/admin/users` | Yes | Admin |
| DELETE | `/api/admin/users/:id` | Yes | Admin |

---

## Notes

- JWT tokens expire in 7 days
- Passwords hashed with bcrypt
- All dates in ISO format
- Foreign keys enforced (cascade delete)
- Unique constraints on email, wishlist items, reviews

---

**Status**: ✅ Ready to Use
**Last Updated**: March 2026
