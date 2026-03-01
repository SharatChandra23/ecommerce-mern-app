#  Server - Node.js + Express Backend

This is the backend API for the MERN E-Commerce Application.

------------------------------------------------------------------------

##  Tech Stack

-   Node.js
-   Express.js
-   MongoDB
-   Mongoose
-   JWT
-   bcryptjs
-   Multer
-   Helmet
-   CORS
-   Express Rate Limit

------------------------------------------------------------------------

##  Folder Structure
```bash
│
├── config/
│ └── db.js
├── controllers/
├── middleware/
├── models/
├── routes/
├── uploads/
├── server.js
└── seedAdmin.js

------------------------------------------------------------------------

##  Authentication

-   JWT-based authentication
-   Password hashing using bcrypt
-   Role-based authorization (Admin / User)

------------------------------------------------------------------------

##  API Modules

### Auth

-   Register User
-   Login User

### Products

-   Create Product (Admin)
-   Update Product (Admin)
-   Delete Product (Admin)
-   Get Products

### Cart

-   Add to Cart
-   Remove from Cart
-   Get Cart Items

### Coupons

-   Create Coupon (Admin)
-   Apply Coupon
-   Delete Coupon

### Orders

-   Create Order
-   Get User Orders
-   Update Order Status (Admin)

------------------------------------------------------------------------

##  Setup

Install dependencies:

npm install

Create `.env` file inside `server/`:

PORT=5000 MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Run in development mode:

npm run dev

Run in production mode:

npm start

Server runs at: http://localhost:5000

------------------------------------------------------------------------

##  Database Models

-   User
-   Product
-   Cart
-   Order
-   Coupon

------------------------------------------------------------------------

##  Security

-   Helmet middleware
-   Express rate limiting
-   CORS configuration
-   JWT verification middleware

------------------------------------------------------------------------

##  Author

Sharat Maganti
