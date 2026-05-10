# 🌍 Traveloop: Enterprise-Grade Travel Planning Platform
> **Dream. Design. Discover.**
> A robust full-stack ecosystem developed by **Team Sakshi & Anand**.

[![Status](https://img.shields.io/badge/Status-Live-success?style=for-the-badge)]()
[![Frontend](https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel)](https://traveloop-wc1h.vercel.app/)
[![Backend](https://img.shields.io/badge/Backend-Render-lightgrey?style=for-the-badge&logo=render)](https://traveloop-api-xuzt.onrender.com)
[![DB](https://img.shields.io/badge/Database-PostgreSQL-blue?style=for-the-badge&logo=postgresql)]()

---

## 🚀 Live Production Environment
- **💻 Live Web App:** [https://traveloop-wc1h.vercel.app/](https://traveloop-wc1h.vercel.app/)
- **⚙️ Backend API:** [https://traveloop-api-xuzt.onrender.com](https://traveloop-api-xuzt.onrender.com)
- **🟢 System Health:** [https://traveloop-api-xuzt.onrender.com/health](https://traveloop-api-xuzt.onrender.com/health)

---

## 📖 Project Overview
Traveloop is a comprehensive SaaS travel planning application. It solves the complexity of multi-city travel by offering a unified interface for itinerary building, automated budgeting, and collaborative sharing.

### **Core Capabilities:**
- **Customized Multi-City Itineraries:** Structured day-wise planning.
- **Automated Budgeting:** Real-time expense tracking and invoice generation.
- **Global Search:** Discover cities and activities with popularity and cost indices.
- **Utility Suite:** Integrated packing checklists and digital travel journals.

---

## 🛠️ Tech Stack

**Frontend:**
- `React 19.2.5` + `Vite` (Build Tool)
- `Tailwind CSS 4.3.0` (Modern Styling)
- `React Router 7.15.0` (Routing)
- `Axios` (HTTP Client) & `Recharts` (Analytics Visualization)

**Backend:**
- `Node.js` + `Express 5.2.1`
- `Prisma 7.8.0` (ORM)
- `PostgreSQL` (Neon Managed DB)
- `JWT` & `bcryptjs` (Security & Hashing)

---

## 📐 System Architecture

<details>
<summary>📂 View Full Project Structure</summary>

```text
Traveloop/
├── 📱 client/            # React + Vite Frontend
│   ├── src/
│   │   ├── pages/        # 14 specialized screens (Login, Builder, Admin, etc.)
│   │   ├── components/   # Modular UI (Navbar, TripCards)
│   │   ├── api/          # Axios HTTP client configuration
│   │   └── App.jsx       # Central Routing Logic
├── ⚙️ server/            # Express Backend
│   ├── routes/           # 10 modular API controllers
│   ├── middleware/       # JWT Auth & Security verification
│   ├── prisma/           # Data Models & Migrations
│   ├── index.js          # Express entry point & Health Check
└── README.md
