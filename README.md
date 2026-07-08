# VYSTA

# 🛒 E-Commerce Platform API

A production-ready **E-Commerce Backend API** built with **Node.js**, **Express.js**, **PostgreSQL**, and **Prisma ORM**. The project follows a scalable architecture with secure authentication, role-based authorization, rate limiting, and RESTful API design.

## 🚀 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma ORM
- **Authentication:** JWT, BCrypt
- **Authorization:** Role-Based Access Control (RBAC)
- **Rate Limiting:** Token Bucket Algorithm
- **Deployment:** Render
- **Database Hosting:** Neon PostgreSQL
- **API Testing:** Postman
- **Version Control:** Git & GitHub

---

## ✨ Features

- 🔐 JWT Authentication
- 🔑 BCrypt Password Hashing
- 👤 Role-Based Authorization (Admin/User)
- 🛍️ Product Management
- 🛒 Shopping Cart
- 📦 Order Management
- 📄 RESTful API Architecture
- ⚡ Prisma ORM for Efficient Database Operations
- 🚦 Rate Limiting using **Token Bucket Algorithm**
- 🛡️ Input Validation & Centralized Error Handling
- 🌐 Cloud Deployment (Render + Neon PostgreSQL)

---

## 📂 Project Structure

```
src/
│── controllers/
│── middleware/
│── routes/
│── services/
│── prisma/
│── utils/
│── config/
│── app.js
│── server.js
```

---

## 🔒 Authentication & Authorization

- User Registration
- User Login
- JWT Token Generation
- Protected Routes
- Role-Based Access Control
  - Admin
  - User

Only authorized users can access restricted resources.

---

## 🚦 Rate Limiting

To protect APIs from abuse and brute-force attacks, the project implements a **Token Bucket Algorithm**.

### Benefits
- Prevents API spam
- Controls request bursts
- Improves server stability
- Enhances API security

---

## 🛠 API Modules

- Authentication
- Users
- Products
- Categories
- Cart
- Orders

---

## ⚙️ Installation

```bash
git clone <repository-url>

cd ecommerce-platform

npm install
```

Create a `.env` file

```env
DATABASE_URL=
JWT_SECRET=
PORT=5000
```

Run Prisma Migration

```bash
npx prisma migrate dev
```

Generate Prisma Client

```bash
npx prisma generate
```

Start Server

```bash
npm run dev
```

---

## 📬 API Testing

All endpoints were tested using **Postman**.

---

## 🌍 Deployment

- Backend → Render
- Database → Neon PostgreSQL

---

## 📈 Future Enhancements

- 💳 Stripe/Razorpay Payment Integration
- ❤️ Wishlist Feature
- ⭐ Product Reviews & Ratings
- 🔍 Advanced Search & Filtering
- 📧 Email Verification & Password Reset
- 📦 Order Tracking
- 🔔 Notifications
- 📊 Admin Dashboard & Analytics
- 🖼️ Image Upload with Cloudinary
- 🧾 Invoice Generation (PDF)
- 🐳 Docker Support
- ⚡ Redis Caching
- 🔄 Refresh Token Authentication
- 📱 Mobile Friendly API Documentation using Swagger

---

## 🤝 Contributing

Contributions, suggestions, and feature requests are welcome.

---

## 👨‍💻 Author

Developed with ❤️ by **Your Name**

```

### 💯 Bonus (GitHub par aur professional lagega)

README ke top me badges laga dena:

```md
![Node.js](https://img.shields.io/badge/Node.js-20-green)
![Express](https://img.shields.io/badge/Express.js-Backend-black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![License](https://img.shields.io/badge/License-MIT-green)
```

Aur agar screenshots, Postman collection aur Swagger docs bhi add kar doge, to README **senior-level open-source project** jaisi lagegi.
