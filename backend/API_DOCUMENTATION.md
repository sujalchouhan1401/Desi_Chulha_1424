# Desi Chulha Backend API Documentation

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## User Roles

- **user**: Can place orders and view menu/combos/offers
- **admin**: Can manage everything and view analytics

## API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user" // optional, defaults to "user"
}
```

#### Login
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

#### Create Admin (Initial Setup)
```http
POST /api/users/create-admin
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@desichulha.com",
  "password": "admin123"
}
```

---

### Menu Management (Admin Only for Write Operations)

#### Get All Menu Items (Public)
```http
GET /api/menu
```

#### Create Menu Item (Admin Only)
```http
POST /api/menu
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Butter Chicken",
  "category": "main_course",
  "price": 299,
  "image": "butter-chicken.jpg",
  "available": true,
  "bestseller": false
}
```

#### Update Menu Item (Admin Only)
```http
PUT /api/menu/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "price": 319,
  "available": false
}
```

#### Delete Menu Item (Admin Only)
```http
DELETE /api/menu/:id
Authorization: Bearer <admin_token>
```

---

### Order Management

#### Create Order (Authenticated Users)
```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "customerName": "John Doe",
  "items": [
    {
      "menuItemId": "60f7b3b3b3b3b3b3b3b3b3b4",
      "name": "Butter Chicken",
      "quantity": 2,
      "price": 299
    }
  ],
  "totalAmount": 598,
  "status": "pending"
}
```

#### Get All Orders (Admin Only)
```http
GET /api/orders
Authorization: Bearer <admin_token>
```

#### Get My Orders (Authenticated Users)
```http
GET /api/orders/my-orders
Authorization: Bearer <token>
```

#### Update Order Status (Admin Only)
```http
PATCH /api/orders/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "confirmed"
}
```

---

### Combo Management (Admin Only for Write Operations)

#### Get All Combos (Public)
```http
GET /api/combos
```

#### Create Combo (Admin Only)
```http
POST /api/combos
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Special Thali",
  "items": [
    {
      "menuItemId": "60f7b3b3b3b3b3b3b3b3b3b4",
      "name": "Butter Chicken",
      "quantity": 1
    }
  ],
  "comboPrice": 399,
  "active": true
}
```

---

### Offer Management (Admin Only for Write Operations)

#### Get All Offers (Public)
```http
GET /api/offers
```

#### Create Offer (Admin Only)
```http
POST /api/offers
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "code": "SPECIAL20",
  "discountType": "percentage",
  "discountValue": 20,
  "expiryDate": "2024-12-31T23:59:59Z",
  "active": true
}
```

---

### Analytics Dashboard (Admin Only)

#### Get Dashboard Stats
```http
GET /api/analytics/dashboard
Authorization: Bearer <admin_token>
```

#### Get Sales Analytics
```http
GET /api/analytics/sales?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <admin_token>
```

#### Get Top Selling Items
```http
GET /api/analytics/top-items?limit=10
Authorization: Bearer <admin_token>
```

#### Get Customer Analytics
```http
GET /api/analytics/customers
Authorization: Bearer <admin_token>
```

#### Get Order Analytics
```http
GET /api/analytics/orders
Authorization: Bearer <admin_token>
```

#### Get Revenue Analytics
```http
GET /api/analytics/revenue
Authorization: Bearer <admin_token>
```

---

## Data Flow

### Admin Flow
1. **Login** → Get admin token
2. **Manage Menu** → Create/update/delete menu items
3. **Manage Combos** → Create/update combo deals
4. **Manage Offers** → Create discount codes
5. **View Orders** → See all customer orders
6. **Update Status** → Change order status (pending → confirmed → preparing → ready → delivered)
7. **View Analytics** → Dashboard with sales, revenue, customer data

### User Flow
1. **Login/Register** → Get user token
2. **Browse Menu** → View available menu items
3. **View Combos** → See active combo deals
4. **Apply Offers** → Use discount codes
5. **Place Order** → Create new order
6. **Track Orders** → View order status and history

### Dashboard Flow
1. **Admin Authentication** → Verify admin access
2. **Read Analytics** → Get comprehensive business data
3. **Real-time Updates** → Live order and revenue tracking

---

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Access denied. No token provided."
}
```

### 403 Forbidden
```json
{
  "error": "Access denied. Admin rights required."
}
```

### 404 Not Found
```json
{
  "error": "Menu item not found"
}
```

### 400 Bad Request
```json
{
  "error": "Validation Error",
  "details": ["Price is required"]
}
```

---

## Response Formats

### Success Response
```json
{
  "message": "Menu item created successfully",
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "Butter Chicken",
    "category": "main_course",
    "price": 299,
    "available": true,
    "bestseller": false,
    "createdAt": "2024-03-05T18:30:00.000Z",
    "updatedAt": "2024-03-05T18:30:00.000Z"
  }
}
```

### List Response
```json
{
  "data": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "Butter Chicken",
      "price": 299,
      "available": true
    }
  ],
  "total": 25
}
```

---

## MongoDB Schema

All data is stored in MongoDB with the following collections:
- **users** - Authentication and user management
- **menuitems** - Restaurant menu items
- **orders** - Customer orders and tracking
- **combos** - Special combo deals
- **offers** - Discount codes and promotions

This replaces all localStorage operations with persistent database storage.
