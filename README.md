# 🛡 ResQNet — Disaster Management System

A full-stack disaster management system built for college project submission.
Premium dark glassmorphism UI with real-time capabilities.

---

## 🚀 Quick Start (2 commands)

### Prerequisites
- Node.js v18+ → https://nodejs.org
- MongoDB Community → https://www.mongodb.com/try/download/community
  - OR use MongoDB Atlas (free cloud DB)

### 1. Start MongoDB
```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Windows — start MongoDB service from Services panel
# OR use MongoDB Atlas connection string in backend/.env
```

### 2. Install & Run

```bash
# Terminal 1 — Backend
cd backend
npm install
npm run dev

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
```

### 3. Open App
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api/health

---

## 🔑 Demo Credentials (auto-seeded)

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@demo.com | admin123 |
| **Responder** | responder@demo.com | responder123 |
| **Citizen** | citizen@demo.com | citizen123 |

---

## 📁 Project Structure

```
disaster-mgmt/
├── backend/
│   ├── models/          # MongoDB schemas
│   │   ├── User.js
│   │   ├── Incident.js
│   │   ├── Resource.js
│   │   ├── ReliefCamp.js
│   │   └── Alert.js
│   ├── routes/          # Express API routes
│   │   ├── auth.js
│   │   ├── incidents.js
│   │   ├── resources.js
│   │   ├── volunteers.js
│   │   ├── reliefcamps.js
│   │   ├── alerts.js
│   │   └── dashboard.js
│   ├── socket/
│   │   └── socketHandler.js  # Real-time events
│   ├── middleware/
│   │   └── auth.js           # JWT middleware
│   ├── utils/
│   │   └── seed.js           # Demo data seeder
│   ├── server.js             # Main entry point
│   └── .env                  # Environment variables
│
└── frontend/
    └── src/
        ├── context/
        │   ├── AuthContext.jsx   # Auth + Axios
        │   └── SocketContext.jsx # Socket.io client
        ├── components/
        │   ├── Layout.jsx        # Sidebar + Topbar
        │   ├── StatCard.jsx
        │   ├── PageHeader.jsx
        │   ├── SOSButton.jsx
        │   └── NotificationToast.jsx
        └── pages/
            ├── Login.jsx
            ├── Register.jsx
            ├── Dashboard.jsx     # Analytics + charts
            ├── MapPage.jsx       # Leaflet live map
            ├── Incidents.jsx     # CRUD incidents
            ├── IncidentDetail.jsx
            ├── Resources.jsx     # Resource tracking
            ├── Volunteers.jsx    # Volunteer network
            ├── ReliefCamps.jsx   # Camp management
            ├── Alerts.jsx        # Broadcast alerts
            ├── Helpline.jsx      # Emergency contacts
            └── Profile.jsx       # User profile
```

---

## 🧩 Features Implemented

| Feature | Status |
|---------|--------|
| JWT Authentication (login/register) | ✅ |
| Role-based access (admin/responder/citizen) | ✅ |
| Incident reporting with GPS | ✅ |
| SOS emergency button | ✅ |
| Live disaster map (Leaflet + dark tiles) | ✅ |
| Resource management & status tracking | ✅ |
| Volunteer network with skill filters | ✅ |
| Relief camp capacity tracker | ✅ |
| Government alert broadcasting | ✅ |
| Real-time updates (Socket.io) | ✅ |
| Admin dashboard with charts (Recharts) | ✅ |
| Emergency helpline directory | ✅ |
| Demo data seeding | ✅ |
| Anonymous incident reporting | ✅ |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Custom CSS (Glassmorphism) |
| Maps | React-Leaflet + CartoDB Dark |
| Charts | Recharts |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Real-time | Socket.io |
| Auth | JWT (jsonwebtoken + bcryptjs) |

---

## ⚙️ Environment Variables (backend/.env)

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/disastermgmt
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

For MongoDB Atlas:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/disastermgmt
```

---

## 📊 API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

GET    /api/incidents
POST   /api/incidents
GET    /api/incidents/:id
PUT    /api/incidents/:id
DELETE /api/incidents/:id
POST   /api/incidents/sos

GET    /api/resources
POST   /api/resources
PUT    /api/resources/:id

GET    /api/reliefcamps
POST   /api/reliefcamps
PUT    /api/reliefcamps/:id

GET    /api/alerts
POST   /api/alerts
PUT    /api/alerts/:id/deactivate

GET    /api/volunteers
PUT    /api/volunteers/availability

GET    /api/dashboard/stats
```

---

## 🎓 College Project Notes

- **Use Case**: Chennai floods, Cyclone Michaung (demo data)
- **ER Diagram**: Users → Incidents ← Resources; Users → ReliefCamps; Alerts → Incidents
- **Architecture**: REST API + WebSocket (Socket.io) + React SPA
- **Deploy**: Backend → Railway/Render; Frontend → Vercel

Built with ❤️ for college project — ResQNet Disaster Management System
