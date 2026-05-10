# Traveloop

Traveloop is a full-stack travel planning app for creating trips, building itineraries, tracking budgets, managing packing lists, saving trip notes, and browsing shared community trips.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express.js
- Database: PostgreSQL with Prisma
- Auth: JWT
- Deployment: Render-ready backend with a health endpoint

## Features

- User registration and login
- Trip creation and trip management
- Multi-stop itinerary builder
- Activity and city search
- Budget and invoice tracking
- Packing checklist
- Trip notes
- Public/community trip sharing
- Admin stats and user management
- Health endpoint for deployment monitoring

## Project Structure

```text
Traveloop/
├── client/              # React + Vite frontend
│   ├── src/
│   └── package.json
├── server/              # Express backend
│   ├── routes/
│   ├── prisma/
│   ├── index.js
│   └── package.json
└── README.md
```

## Backend Setup

```bash
cd server
npm install
```

Create `server/.env`:

```env
DATABASE_URL="your_postgresql_connection_string"
JWT_SECRET="your_jwt_secret"
PORT=5050
```

Run Prisma migration:

```bash
npx prisma migrate dev
```

Start the backend:

```bash
npm start
```

Backend runs on:

```text
http://127.0.0.1:5050
```

Health check:

```text
http://127.0.0.1:5050/health
```

Expected response:

```json
{"status":"ok"}
```

## Frontend Setup

```bash
cd client
npm install
```

Create `client/.env` if using a custom API URL:

```env
VITE_API_URL="http://127.0.0.1:5050/api"
```

Start the frontend:

```bash
npm run dev
```

Frontend runs on:

```text
http://127.0.0.1:5173
```

## Useful Commands

Frontend:

```bash
cd client
npm run dev
npm run build
npm run lint
```

Backend:

```bash
cd server
npm start
npx prisma migrate dev
npx prisma studio
```

## API Overview

Base API URL:

```text
/api
```

Main routes:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/trips`
- `POST /api/trips`
- `GET /api/trips/:id`
- `PUT /api/trips/:id`
- `DELETE /api/trips/:id`
- `POST /api/stops`
- `GET /api/activities/search`
- `GET /api/activities/global`
- `GET /api/packing/:tripId`
- `GET /api/notes/:tripId`
- `GET /api/invoices/:tripId`
- `GET /api/admin/stats`
- `GET /health`

Protected routes require:

```text
Authorization: Bearer <token>
```

## Render Deployment Notes

For backend deployment on Render:

- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`
- Branch: `main`

Set environment variables in Render:

```env
DATABASE_URL="your_postgresql_connection_string"
JWT_SECRET="your_jwt_secret"
```

Production health endpoint:

```text
https://traveloop-api-68et.onrender.com/health
```

Expected response:

```json
{"status":"ok"}
```

## Security Notes

- Do not commit `.env` files.
- Rotate database passwords immediately if a connection string is shared publicly.
- Keep `JWT_SECRET` private and unique for production.

## License

This project is for educational and hackathon use.
