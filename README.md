#  MERN Stack E-Commerce Application

A full-featured E-Commerce web application built using the MERN Stack
(MongoDB, Express, React, Node.js).

This application supports role-based authentication, product management,
coupon system, cart functionality, order tracking, invoice generation,
and simulated payment integration.

------------------------------------------------------------------------

##  Tech Stack

### Frontend

-   React (Vite)
-   React Router DOM
-   Axios
-   Tailwind CSS
-   Context API
-   Framer Motion

### Backend

-   Node.js
-   Express.js
-   MongoDB
-   Mongoose
-   JWT Authentication
-   bcryptjs
-   Multer
-   Helmet
-   Express Rate Limit

------------------------------------------------------------------------

##  Project Structure (Monorepo)

```bash
ecommerce-mern-app/ 
│
├── client/ # React Vite frontend
├── server/ # Express backend
└── README.md
```
------------------------------------------------------------------------

##  Features

###  Admin

-   Add / Edit / Delete Products
-   Upload Product Images
-   Manage Coupons
-   View All Orders
-   Update Order Status (Pending → Shipped → Delivered)

###  User

-   Signup & Login
-   Add Products to Cart
-   Apply Coupons
-   Checkout Process
-   Add Shipping Address
-   Simulated Payment
-   Order Tracking
-   Invoice View & Download

------------------------------------------------------------------------

##  Database Collections

-   users
-   products
-   carts
-   orders
-   coupons

------------------------------------------------------------------------

#   Installation & Setup

##  Clone Repository

git clone https://github.com/SharatChandra23/ecommerce-mern-app.git cd
ecommerce-mern-app

------------------------------------------------------------------------

##  Backend Setup

cd server npm install

Create `.env` file inside `server/`:

PORT=5000 MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Run backend:

npm run dev

Backend runs at: http://localhost:5000

------------------------------------------------------------------------

##  Frontend Setup

cd client npm install npm run dev

Frontend runs at: http://localhost:5173

------------------------------------------------------------------------

##  Application Flow

1.  User registers or logs in
2.  Adds products to cart
3.  Applies coupon
4.  Proceeds to checkout
5.  Adds shipping address
6.  Simulated payment success
7.  Order created
8.  Cart cleared
9.  Admin updates order status

------------------------------------------------------------------------

##  Security Implemented

-   JWT Authentication
-   Password Hashing (bcrypt)
-   Helmet Security Middleware
-   Express Rate Limiting
-   CORS Protection

------------------------------------------------------------------------

##  Author

Sharat Maganti
