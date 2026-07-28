<h1 align="center">🛒 VYSTA</h1>
<h3 align="center">🚀 Full Stack E-Commerce Platform</h3>

<p align="center">
  <b>Modern • Scalable • Production-Ready</b><br/>
  Built with React, Node.js, Express, PostgreSQL & Prisma
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js" />
  <img src="https://img.shields.io/badge/Framework-Express-black?style=for-the-badge&logo=express" />
  <img src="https://img.shields.io/badge/Database-PostgreSQL-316192?style=for-the-badge&logo=postgresql" />
  <img src="https://img.shields.io/badge/ORM-Prisma-2D3748?style=for-the-badge&logo=prisma" />
  <img src="https://img.shields.io/badge/Auth-JWT-orange?style=for-the-badge" />
</p>

---

## 🔥 Live Preview
🚧 Coming Soon...

---

## 📸 Screenshots
> Add UI screenshots / GIF demo here for better impact

---

## 🚀 Tech Stack

### 🖥️ Frontend
- React.js  
- React Router DOM  
- Context API  
- Tailwind CSS  
- Axios  
- React Hook Form  
- Framer Motion  

### ⚙️ Backend
- Node.js  
- Express.js  
- PostgreSQL (Neon)  
- Prisma ORM  
- JWT Authentication  
- BCrypt  
- Role-Based Access Control  

### ☁️ Deployment
- Frontend → Vercel / Netlify  
- Backend → Render  
- Database → Neon PostgreSQL  

---

## ✨ Features

### 👤 User
- 🔐 Authentication (Signup/Login)  
- 🛍️ Browse Products  
- 🛒 Cart Management  
- 📦 Order Placement  
- 🔍 Search & Filtering  
- 🎨 Smooth UI Animations  

### 👑 Admin
- ➕ Add Products  
- ✏️ Update/Delete Products  
- 📦 Manage Orders  
- 👥 Manage Users  

### ⚡ Backend
- JWT Authentication  
- RBAC Authorization  
- Token Bucket Rate Limiting  
- Input Validation  
- Global Error Handling  

---

## 🧠 Architecture


Frontend (React)
↓
API Layer (Axios)
↓
Backend (Node + Express)
↓
Prisma ORM
↓
PostgreSQL Database


---

## 📁 Project Structure


VYSTA/
│── backend/
│ ├── src/
│ │── controllers/
│ │── routes/
│ │── middleware/
│ │── services/
│ │── prisma/
│ │── utils/
│ │── app.js
│ │── server.js
│
│── frontend/
│ ├── src/
│ │── components/
│ │── pages/
│ │── context/
│ │── hooks/
│ │── services/
│ │── App.jsx
│ │── main.jsx


---

## 🔒 Authentication & Authorization

- JWT-based Authentication  
- Secure Password Hashing (BCrypt)  
- Role-Based Access Control (Admin/User)  
- Protected Routes  

---

## 🚦 API Security

🛡️ Token Bucket Rate Limiting

- Prevents API abuse  
- Protects against brute force attacks  
- Handles traffic spikes  

---

## ⚙️ Installation

### 1️⃣ Clone Repository
```bash
git clone https://github.com/your-username/vysta.git
cd vysta
2️⃣ Backend Setup
cd backend
npm install

Create .env

DATABASE_URL=
JWT_SECRET=
PORT=5000

Run:

npx prisma migrate dev
npx prisma generate
npm run dev
3️⃣ Frontend Setup
cd frontend
npm install
npm run dev
📬 API Testing
Postman
Thunder Client
🌍 Deployment
Service	Platform
Frontend	Vercel / Netlify
Backend	Render
Database	Neon PostgreSQL
📈 Roadmap
💳 Razorpay / Stripe Integration
❤️ Wishlist
⭐ Product Reviews
🔔 Notifications
📊 Admin Dashboard
🐳 Docker Support
⚡ Redis Caching
🧑‍💻 Author

Bhoovesh Vyas

⭐ Support

If you like this project, give it a ⭐ on GitHub!

<p align="center"> Made with ❤️ by Bhoovesh </p> ```