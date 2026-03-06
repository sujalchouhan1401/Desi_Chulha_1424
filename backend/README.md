# Desi Chulha Backend API

Backend API system for the Desi Chulha restaurant application, providing real APIs to replace localStorage utilities.

## Features

- **Menu Management**: CRUD operations for menu items with categories, pricing, and availability
- **Order Management**: Complete order lifecycle with status tracking and payment handling
- **Combo Management**: Special combo deals with dynamic pricing and item bundling
- **Offer System**: Discount codes and promotional offers with validation
- **Analytics Dashboard**: Comprehensive analytics for sales, customers, and revenue
- **User Authentication**: JWT-based authentication with role-based access control
- **Security**: Rate limiting, CORS, helmet security headers, and input validation

## API Endpoints

### Menu Management
- `GET /api/menu` - Get all menu items (with filtering)
- `GET /api/menu/:id` - Get specific menu item
- `GET /api/menu/category/:category` - Get items by category
- `GET /api/menu/search?q=query` - Search menu items
- `POST /api/menu` - Create new menu item (admin)
- `PUT /api/menu/:id` - Update menu item (admin)
- `DELETE /api/menu/:id` - Delete menu item (admin)
- `PATCH /api/menu/:id/availability` - Toggle availability (admin)

### Order Management
- `GET /api/orders` - Get all orders (with pagination and filtering)
- `GET /api/orders/:id` - Get specific order
- `GET /api/orders/customer/:email` - Get orders by customer
- `GET /api/orders/status/:status` - Get orders by status
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status
- `PUT /api/orders/:id/payment` - Update payment status
- `PATCH /api/orders/:id/cancel` - Cancel order
- `GET /api/orders/stats` - Get order statistics

### Combo Management
- `GET /api/combos` - Get all combos
- `GET /api/combos/:id` - Get specific combo
- `GET /api/combos/category/:category` - Get combos by category
- `GET /api/combos/popular` - Get popular combos
- `GET /api/combos/search?q=query` - Search combos
- `POST /api/combos` - Create new combo (admin)
- `PUT /api/combos/:id` - Update combo (admin)
- `DELETE /api/combos/:id` - Delete combo (admin)

### Offer Management
- `GET /api/offers` - Get all offers
- `GET /api/offers/active` - Get active offers
- `GET /api/offers/:id` - Get specific offer
- `GET /api/offers/validate/:code` - Validate offer code
- `POST /api/offers` - Create new offer (admin)
- `PUT /api/offers/:id` - Update offer (admin)
- `DELETE /api/offers/:id` - Delete offer (admin)
- `POST /api/offers/:id/use` - Record offer usage

### Analytics
- `GET /api/analytics/dashboard` - Dashboard statistics
- `GET /api/analytics/sales` - Sales analytics
- `GET /api/analytics/top-items` - Top selling items
- `GET /api/analytics/customers` - Customer analytics
- `GET /api/analytics/orders` - Order analytics
- `GET /api/analytics/revenue` - Revenue analytics

### Health Check
- `GET /api/health` - Server health status

## Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

5. Update the `.env` file with your configuration

6. Make sure MongoDB is running on your system

7. Start the server:
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `JWT_SECRET`: Secret key for JWT tokens
- `FRONTEND_URL`: Frontend application URL for CORS

## Database Schema

The backend uses MongoDB with the following collections:

- **users**: Customer and admin user accounts
- **menuitems**: Restaurant menu items
- **orders**: Customer orders and order history
- **combos**: Special combo deals
- **offers**: Discount codes and promotions

## Security Features

- JWT-based authentication
- Role-based access control (customer, staff, admin)
- Rate limiting to prevent abuse
- CORS configuration
- Helmet security headers
- Input validation and sanitization
- Password hashing with bcrypt

## Error Handling

The API includes comprehensive error handling with:
- Validation error responses
- Duplicate key error handling
- Cast error handling for invalid IDs
- Generic error responses with appropriate HTTP status codes

## Development

For development with hot reload:
```bash
npm run dev
```

This uses nodemon to automatically restart the server when files change.

## Testing

Run tests with:
```bash
npm test
```

## License

MIT License
