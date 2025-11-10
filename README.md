# E-Commerce Website Submission

## Submission Details
Submit the assessment by 10th November 2025, 9:00 AM. Please share the live website link along with a brief document outlining the tools used, architecture, and data flow.

## Live Website Link
[https://real-time-e-commerce-website-develo.vercel.app/](https://real-time-e-commerce-website-develo.vercel.app/)

## Tools Used
### Frontend
- **React**: JavaScript library for building user interfaces.
- **TypeScript**: Typed superset of JavaScript for better code quality and maintainability.
- **Vite**: Fast build tool and development server for modern web projects.
- **TailwindCSS**: Utility-first CSS framework for rapid UI development.
- **Axios**: HTTP client for making API requests to the backend.
- **React Router DOM**: Library for routing in React applications.

### Backend
- **Node.js**: JavaScript runtime for server-side development.
- **Express**: Web framework for Node.js to handle HTTP requests and routing.
- **TypeScript**: For type-safe backend development.
- **MongoDB**: NoSQL database for storing user, product, and order data.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js.
- **JWT (JSON Web Tokens)**: For user authentication and session management.
- **Bcrypt**: For hashing user passwords securely.
- **Razorpay**: Payment gateway integration for handling transactions.
- **Nodemailer**: For sending email notifications (e.g., order confirmations).
- **CORS**: Middleware for enabling cross-origin resource sharing between frontend and backend.

### Development Tools
- **Nodemon**: For automatic server restarts during development.
- **ESLint**: For code linting and maintaining code quality.
- **Vite Plugin React**: For React integration with Vite.

## Architecture
The application follows a full-stack architecture with a clear separation between the frontend and backend:

### Frontend (Client-Side)
- Built with React and TypeScript, providing a dynamic and responsive user interface.
- Uses React Router for client-side routing to navigate between pages (e.g., Home, Products, Cart, Checkout).
- Context API is used for state management:
  - **AuthContext**: Manages user authentication state, login, signup, and logout.
  - **CartContext**: Handles cart operations like adding/removing items and calculating totals.
- Axios is configured with a base URL and credentials for secure API communication.
- Pages include:
  - Home: Landing page.
  - Signup/Login: User authentication.
  - Products: Display and browse products.
  - Cart: View and manage cart items.
  - Checkout: Process payments.
  - MyOrders: View order history.
- Protected routes ensure authenticated access to certain pages.

### Backend (Server-Side)
- Built with Node.js and Express, providing RESTful APIs.
- TypeScript ensures type safety.
- Routes are organized into modules:
  - **Auth Routes**: Handle user registration, login, and profile retrieval.
  - **Product Routes**: Fetch product listings.
  - **Payment Routes**: Create and verify Razorpay orders.
  - **Order Routes**: Retrieve user orders.
- Middleware includes:
  - **Authentication Middleware**: Verifies JWT tokens for protected endpoints.
  - **CORS**: Allows requests from the frontend domain.
- Models (using Mongoose):
  - **User**: Stores user details (name, email, hashed password).
  - **Product**: Stores product information (name, description, price, image).
  - **Order**: Tracks orders with user ID, products, amount, payment status, etc.
- Utilities:
  - **Email Service**: Sends order confirmation emails via Nodemailer.
- Database: MongoDB for persistent data storage.
- Payment Integration: Razorpay for secure payment processing.

### Deployment
- Frontend deployed on Vercel.
- Backend likely deployed on a platform like Vercel or Heroku (based on CORS configuration).

## Data Flow
1. **User Registration/Login**:
   - User submits form on frontend (Signup/Login page).
   - Frontend sends POST request to `/api/auth/signup` or `/api/auth/login` via Axios.
   - Backend validates input, hashes password (if signup), generates JWT token.
   - Token and user data returned to frontend, stored in localStorage, and AuthContext updated.

2. **Browsing Products**:
   - On Products page load, frontend fetches products via GET `/api/products`.
   - Backend queries MongoDB for products and returns JSON array.
   - Products displayed in UI; user can add to cart.

3. **Cart Management**:
   - Cart state managed locally in CartContext (persisted in localStorage).
   - User adds/removes items; total calculated dynamically.

4. **Checkout and Payment**:
   - User proceeds to Checkout; cart data sent to backend via POST `/api/payment/create-order`.
   - Backend creates Razorpay order, saves pending order in MongoDB.
   - Frontend redirects to Razorpay payment gateway.
   - After payment, Razorpay callback triggers POST `/api/payment/verify-payment`.
   - Backend verifies payment signature, updates order status to 'completed', sends confirmation email.

5. **Order History**:
   - On MyOrders page, frontend fetches user orders via GET `/api/orders` (authenticated).
   - Backend queries orders by user ID, populates product details, returns data.
   - Orders displayed with product info and status.

6. **Email Notifications**:
   - Post-payment verification, backend uses Nodemailer to send HTML email with order details to user.

Overall, data flows from frontend UI actions to backend APIs, interacting with MongoDB for persistence and external services (Razorpay, Gmail) for payments and emails. Authentication ensures secure access to user-specific data.
