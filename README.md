# 🛒 VYSTA - E-Commerce Platform API

![Node.js](https://img.shields.io/badge/Node.js-20-green)
![Express](https://img.shields.io/badge/Express.js-Backend-black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![License](https://img.shields.io/badge/License-MIT-green)

A secure, scalable, and production-ready **RESTful E-Commerce Backend API** built with **Node.js**, **Express.js**, **PostgreSQL**, and **Prisma ORM**. VYSTA provides authentication, role-based authorization, shopping cart, product & order management, and advanced API protection using the **Token Bucket Rate Limiting Algorithm**.

---

## 🚀 Tech Stack

| Category | Technologies |
|----------|--------------|
| Backend | Node.js, Express.js |
| Database | PostgreSQL (Neon) |
| ORM | Prisma ORM |
| Authentication | JWT + BCrypt |
| Authorization | Role-Based Access Control (RBAC) |
| Security | Token Bucket Rate Limiting |
| Deployment | Render |
| API Testing | Postman |
| Version Control | Git & GitHub |

---

# ✨ Features

- 🔐 Secure JWT Authentication
- 🔑 Password Hashing using BCrypt
- 👥 Role-Based Authorization (Admin & User)
- 🛍️ Product CRUD Operations
- 🛒 Shopping Cart Management
- 📦 Order Management
- ⚡ Prisma ORM Integration
- 🚦 Token Bucket Rate Limiting
- 🛡️ Input Validation & Global Error Handling
- 🌐 Cloud Deployment on Render & Neon PostgreSQL
- 📄 Modular & Scalable Project Structure

---

# 📁 Project Structure

```text
src/
│── config/
│── controllers/
│── middleware/
│── prisma/
│── routes/
│── services/
│── utils/
│── app.js
└── server.js
```

---

# 🔒 Authentication & Authorization

### Authentication

- User Registration
- User Login
- JWT Access Token
- Protected Routes

### Authorization

Role-Based Access Control (RBAC)

- 👑 Admin
- 👤 User

Only authorized users can access restricted resources based on their assigned roles.

---

# 🚦 API Security

VYSTA implements a **Token Bucket Rate Limiting Algorithm** to safeguard APIs against abuse.

### Benefits

- Prevents API Spam
- Protects against Brute Force Attacks
- Controls Burst Traffic
- Improves Server Stability
- Enhances Overall API Security

---

# 🛠 API Modules

- Authentication
- Users
- Products
- Categories
- Cart
- Orders

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/your-username/vysta.git
```

Move to project

```bash
cd vysta
```

Install dependencies

```bash
npm install
```

Create `.env`

```env
DATABASE_URL=
JWT_SECRET=
PORT=5000
```

Run migrations

```bash
npx prisma migrate dev
```

Generate Prisma Client

```bash
npx prisma generate
```

Start the development server

```bash
npm run dev
```

---

# 📬 API Testing

API endpoints are tested using **Postman**.

---

# 🌍 Deployment

| Service | Platform |
|----------|----------|
| Backend | Render |
| Database | Neon PostgreSQL |

---

# 📈 Roadmap

Upcoming features planned for future releases.

- 💳 Stripe / Razorpay Integration
- ❤️ Wishlist
- ⭐ Product Reviews & Ratings
- 🔍 Search & Filtering
- 📧 Email Verification
- 🔄 Password Reset
- 📦 Order Tracking
- 🔔 Notifications
- 📊 Admin Dashboard
- 🖼️ Cloudinary Image Upload
- 🧾 PDF Invoice Generation
- 🐳 Docker Support
- ⚡ Redis Caching
- 🔄 Refresh Token Authentication
- 📖 Swagger API Documentation

---

# 🤝 Contributing

Contributions are always welcome.

Feel free to fork the repository, open issues, or submit pull requests.

---

# 👨‍💻 Author

**Developed by Your Name**

If you found this project helpful, don't forget to ⭐ the repository.
