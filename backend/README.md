# Farmer Market Backend - Quick Reference

Express.js + SQLite backend for the Farmer Market platform.

**⚠️ For complete API documentation, database schema, and integration guides, see MASTER_README.md in the root directory.**

## Features

✅ **Authentication System**
- User registration and login
- JWT token-based authentication
- Role-based access control (Buyer, Farmer, Admin)
- Password hashing with bcrypt

✅ **Product Management**
- Create, read, update, delete products
- Search and filtering
- Category-based browsing
- Product ratings

✅ **Order System**
- Create orders with multiple products
- Order tracking with 5 statuses
- Order history for buyers
- Farmer-specific order management

✅ **Reviews & Ratings**
- Star-based product reviews
- User ratings
- Average rating calculation
- Review history

✅ **Wishlist System**
- Add/remove products to wishlist
- User-specific wishlist
- Check if product in wishlist

✅ **Admin Dashboard**
- User management
- Product moderation
- Order oversight
- Platform analytics

## Project Structure

```
backend/
├── config/
│   └── database.js          # SQLite configuration & initialization
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── productController.js # Product CRUD operations
│   ├── orderController.js   # Order management
│   ├── reviewController.js  # Review handling
│   ├── wishlistController.js# Wishlist operations
│   └── adminController.js   # Admin operations
├── middleware/
│   └── authMiddleware.js    # JWT verification & role checking
├── models/
│   ├── userModel.js         # User database operations
│   ├── productModel.js      # Product database operations
│   ├── orderModel.js        # Order database operations
│   ├── reviewModel.js       # Review database operations
│   └── wishlistModel.js     # Wishlist database operations
├── routes/
│   ├── authRoutes.js        # Authentication endpoints
│   ├── productRoutes.js     # Product endpoints
│   ├── orderRoutes.js       # Order endpoints
│   ├── reviewRoutes.js      # Review endpoints
│   ├── wishlistRoutes.js    # Wishlist endpoints
│   └── adminRoutes.js       # Admin endpoints
├── server.js                # Main application file
├── package.json             # Dependencies
├── .env                     # Environment variables
└── database.sqlite          # SQLite database (auto-created)
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm

### Setup Steps

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the server**
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "buyer"  // or "farmer"
}
Response: { token, user data }
```

#### Login
```
POST /api/auth/login
Body: {
  "email": "john@example.com",
  "password": "password123"
}
Response: { token, user data }
```

#### Get Current User
```
GET /api/auth/me
Headers: Authorization: Bearer TOKEN
Response: { user data }
```

#### Update Profile
```
PUT /api/auth/profile
Headers: Authorization: Bearer TOKEN
Body: {
  "name": "Updated Name",
  "phone": "123456789",
  "address": "123 Main St"
}
Response: { updated user data }
```

### Product Endpoints

#### Get All Products
```
GET /api/products?search=tomato&category=vegetables&sort=price-low&page=1&limit=10
Response: { array of products }
```

#### Get Single Product
```
GET /api/products/:id
Response: { product data }
```

#### Create Product (Farmer)
```
POST /api/products
Headers: Authorization: Bearer TOKEN
Body: {
  "name": "Fresh Tomatoes",
  "price": 5.99,
  "category": "vegetables",
  "image": "image_url",
  "description": "Fresh organic tomatoes"
}
Response: { created product }
```

#### Update Product (Farmer)
```
PUT /api/products/:id
Headers: Authorization: Bearer TOKEN
Body: { product updates }
Response: { updated product }
```

#### Delete Product
```
DELETE /api/products/:id
Headers: Authorization: Bearer TOKEN
Response: { success message }
```

### Order Endpoints

#### Create Order
```
POST /api/orders
Headers: Authorization: Bearer TOKEN
Body: {
  "products": [
    { "product_id": 1, "quantity": 2 },
    { "product_id": 3, "quantity": 1 }
  ],
  "paymentMethod": "card"
}
Response: { created order with items }
```

#### Get My Orders (Buyer)
```
GET /api/orders/my-orders
Headers: Authorization: Bearer TOKEN
Response: { array of user's orders }
```

#### Get Farmer Orders
```
GET /api/orders/farmer-orders
Headers: Authorization: Bearer TOKEN
Response: { array of orders for farmer's products }
```

#### Get Single Order
```
GET /api/orders/:id
Headers: Authorization: Bearer TOKEN
Response: { order with items }
```

#### Update Order Status
```
PUT /api/orders/:id/status
Headers: Authorization: Bearer TOKEN
Body: { "status": "Shipped" }
Response: { updated order }
```

### Review Endpoints

#### Add Review
```
POST /api/reviews
Headers: Authorization: Bearer TOKEN
Body: {
  "productId": 1,
  "rating": 5,
  "comment": "Excellent quality!"
}
Response: { created review }
```

#### Get Product Reviews
```
GET /api/reviews/product/:productId
Response: { array of reviews }
```

#### Get My Reviews
```
GET /api/reviews
Headers: Authorization: Bearer TOKEN
Response: { array of user's reviews }
```

#### Update Review
```
PUT /api/reviews/:id
Headers: Authorization: Bearer TOKEN
Body: {
  "rating": 4,
  "comment": "Updated comment"
}
Response: { updated review }
```

#### Delete Review
```
DELETE /api/reviews/:id
Headers: Authorization: Bearer TOKEN
Response: { success message }
```

### Wishlist Endpoints

#### Add to Wishlist
```
POST /api/wishlist
Headers: Authorization: Bearer TOKEN
Body: { "productId": 1 }
Response: { wishlist item }
```

#### Get My Wishlist
```
GET /api/wishlist
Headers: Authorization: Bearer TOKEN
Response: { array of wishlist items with products }
```

#### Remove from Wishlist
```
DELETE /api/wishlist/:productId
Headers: Authorization: Bearer TOKEN
Response: { success message }
```

#### Check if in Wishlist
```
GET /api/wishlist/check/:productId
Headers: Authorization: Bearer TOKEN
Response: { inWishlist: true/false }
```

### Admin Endpoints

#### Get All Users
```
GET /api/admin/users
Headers: Authorization: Bearer TOKEN (Admin only)
Response: { array of all users }
```

#### Delete User
```
DELETE /api/admin/users/:id
Headers: Authorization: Bearer TOKEN (Admin only)
Response: { success message }
```

#### Get All Products
```
GET /api/admin/products
Headers: Authorization: Bearer TOKEN (Admin only)
Response: { array of products }
```

#### Delete Product
```
DELETE /api/admin/products/:id
Headers: Authorization: Bearer TOKEN (Admin only)
Response: { success message }
```

#### Get All Orders
```
GET /api/admin/orders
Headers: Authorization: Bearer TOKEN (Admin only)
Response: { array of orders }
```

#### Get Analytics
```
GET /api/admin/analytics
Headers: Authorization: Bearer TOKEN (Admin only)
Response: {
  "totalUsers": 10,
  "totalFarmers": 3,
  "totalBuyers": 6,
  "totalOrders": 25,
  "totalProducts": 45,
  "totalRevenue": 1250.50,
  "monthlyRevenue": 350.00
}
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT (buyer/farmer/admin),
  phone TEXT,
  address TEXT,
  verified INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Products Table
```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  category TEXT NOT NULL,
  image TEXT,
  description TEXT,
  farmer_id INTEGER NOT NULL (FK to users),
  stock INTEGER DEFAULT 100,
  rating REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Orders Table
```sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  buyer_id INTEGER NOT NULL (FK to users),
  total REAL NOT NULL,
  status TEXT (Pending/Approved/Shipped/Delivered/Cancelled),
  payment_method TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Order Items Table
```sql
CREATE TABLE order_items (
  id INTEGER PRIMARY KEY,
  order_id INTEGER NOT NULL (FK to orders),
  product_id INTEGER NOT NULL (FK to products),
  quantity INTEGER NOT NULL,
  price REAL NOT NULL
)
```

### Reviews Table
```sql
CREATE TABLE reviews (
  id INTEGER PRIMARY KEY,
  product_id INTEGER NOT NULL (FK to products),
  user_id INTEGER NOT NULL (FK to users),
  rating INTEGER (1-5),
  comment TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Wishlist Table
```sql
CREATE TABLE wishlist (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL (FK to users),
  product_id INTEGER NOT NULL (FK to products),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## Demo Credentials

Automatically seeded on first run:

| Role  | Email | Password |
|-------|-------|----------|
| Admin | admin@example.com | admin123 |
| Buyer | buyer@example.com | test123 |
| Farmer| farmer@example.com | test123 |

## Environment Variables

Create `.env` file with:

```
PORT=5000
JWT_SECRET=farmer-market-secret-key-2026
NODE_ENV=development
```

## Dependencies

- **express**: Web framework
- **better-sqlite3**: SQLite database
- **bcrypt**: Password hashing
- **jsonwebtoken**: JWT authentication
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## Security Features

✅ Password hashing with bcrypt
✅ JWT token authentication
✅ Role-based access control
✅ Input validation
✅ SQL injection prevention (parameterized queries)
✅ CORS support

## Development

To run in development mode with auto-reload:

```bash
npm run dev
```

To run production:

```bash
npm start
```

## Troubleshooting

### Database issues
- Delete `database.sqlite` and restart to reset database
- Check file permissions on database file

### Port already in use
- Change PORT in `.env` file
- Or kill process using the port

### Authentication errors
- Ensure token is in Authorization header as: `Bearer TOKEN`
- Check token hasn't expired (7 days)

## Next Steps

1. Connect frontend to this backend
2. Replace localStorage with API calls
3. Add payment gateway integration
4. Implement email notifications
5. Add advanced search/filtering
6. Deploy to cloud (Heroku, AWS, etc.)

## License

MIT

## Support

For issues or questions, refer to the code comments or create an issue in the repository.

---

**Status**: ✅ Production Ready
**Last Updated**: March 2026
