# TalentBridge — MERN Capstone

A full-stack freelance job marketplace built with the **MERN** stack
(MongoDB, Express, React, Node.js). Clients post jobs, freelancers submit
proposals, and the two chat in **real time** once a proposal exists.

This is the capstone project for the cohort. It ties together everything
from the earlier projects: REST APIs, MVC structure, MongoDB/Mongoose,
JWT auth, React + Tailwind, React Query, and WebSockets (Socket.IO).

```
project-12/
  server/   Express + MongoDB REST API + Socket.IO chat
  client/   React (Vite) + Tailwind frontend
```

## Features

- **Auth** — register / login with JWT, passwords hashed with bcrypt
- **Roles** — `client` (posts jobs) and `freelancer` (sends proposals)
- **Jobs** — create, browse, search, filter by category, sort, paginate
- **Proposals** — freelancers bid on jobs; clients review proposals
- **Profile** — view and edit your name, headline, and bio
- **Real-time chat** — a client and a freelancer who submitted a proposal
  can message each other live (Socket.IO), with history saved in MongoDB
- **Bell notifications** — a navbar bell alerts you to new messages anywhere
  in the app; click one to open that chat
- **Production touches** — CORS, helmet, rate limiting, request logging,
  central error handling, and Swagger docs

## Prerequisites

- **Node.js** 18+
- **MongoDB** — either a local `mongod` or a MongoDB Atlas cluster
  (the project is configured to use a connection string from `.env`)

## Setup

Open two terminals — one for the server, one for the client.

### 1. Backend (`server/`)

```bash
cd server
npm install
cp .env.example .env     # then set MONGO_URI (local or Atlas)
npm run seed             # loads demo users, jobs, and proposals
npm run dev              # starts the API on http://localhost:4000
```

`.env` keys (see `server/.env.example`):

| Key                | Purpose                                         |
| ------------------ | ----------------------------------------------- |
| `PORT`             | API port (default 4000)                         |
| `MONGO_URI`        | MongoDB connection string (required)            |
| `JWT_SECRET`       | secret used to sign login tokens                |
| `JWT_EXPIRES_IN`   | token lifetime (e.g. `1d`)                      |
| `RATE_LIMIT_*`     | rate limiter window and max                     |
| `REDIS_URL`        | optional — caching (fails soft if empty)        |
| `CLOUDINARY_*`     | optional — image uploads (fails soft if empty)  |

### 2. Frontend (`client/`)

```bash
cd client
npm install
npm run dev              # starts the app on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

> The client expects the API at `http://localhost:4000` and the dev server
> is pinned to port **5173** so CORS and the socket origin always match.

## Demo accounts

All demo passwords are `password123`.

| Role       | Email          |
| ---------- | -------------- |
| Client     | alice@demo.com |
| Client     | dave@demo.com  |
| Freelancer | bob@demo.com   |
| Freelancer | carol@demo.com |

## Try the full flow

1. Log in as a **client** (`alice@demo.com`). Post a job from the dashboard.
2. In another browser (or incognito), log in as a **freelancer**
   (`bob@demo.com`). Open that job and submit a proposal.
3. Back as the client, open the job and click **Message** on the proposal.
4. Send a message. The freelancer sees the **bell** light up in the navbar —
   clicking it opens the conversation and they can reply in real time.

## API overview

Base URL: `http://localhost:4000/api` · Swagger: `/api/docs`

| Method | Path                           | Access            |
| ------ | ------------------------------ | ----------------- |
| POST   | `/auth/register`               | public            |
| POST   | `/auth/login`                  | public            |
| GET    | `/auth/me`                     | token             |
| PUT    | `/auth/me`                     | token             |
| GET    | `/jobs`                        | public            |
| GET    | `/jobs/:id`                    | public            |
| POST   | `/jobs`                        | client            |
| PUT    | `/jobs/:id`                    | client (owner)    |
| DELETE | `/jobs/:id`                    | client (owner)    |
| GET    | `/jobs/:jobId/proposals`       | client (owner)    |
| POST   | `/jobs/:jobId/proposals`       | freelancer        |
| GET    | `/chat/conversations`          | token             |
| POST   | `/chat/conversations`          | token (gated)     |
| GET    | `/chat/conversations/:id/messages` | token (member) |

Socket.IO events (auth via JWT in the handshake):

| Event               | Direction        | Purpose                        |
| ------------------- | ---------------- | ------------------------------ |
| `conversation:join` | client → server  | join a conversation room       |
| `message:send`      | client → server  | send a message                 |
| `message:new`       | server → clients | a new message in the room      |
| `notification:new`  | server → user    | alert the recipient (bell)     |
| `typing`            | both             | typing indicator               |

## Response shape

```json
// success
{ "success": true, "data": { ... } }

// error
{ "success": false, "error": "message here" }
```

## Project structure

```
server/
  server.js                 starts HTTP server + Socket.IO
  src/
    app.js                  express app + middleware
    config/                 env, db, redis, cloudinary, swagger
    models/                 User, Job, Proposal, Conversation, Message
    controllers/            auth, job, proposal
    routes/                 auth, job, index
    middleware/             authenticate, authorize, validate, rateLimiter,
                            notFound, errorHandler
    chat/                   socket.js, chatController.js, chatRoutes.js
    utils/                  ApiError, asyncHandler
    seed.js                 demo data loader (npm run seed)

client/
  src/
    main.jsx                providers: Router, Query, Auth, Notification
    App.jsx                 routes + layout
    api/client.js           fetch wrapper (adds JWT, unwraps envelope)
    context/AuthContext.jsx login/register/logout + session
    components/             Navbar, JobCard, ProtectedRoute, Icons
    pages/                  Home, Jobs, JobDetail, Login, Register,
                            Dashboard, Profile
    chat/                   NotificationContext, NotificationBell,
                            ChatPage, MessageThread
```

## Notes for learners

- Passwords are hashed with bcrypt, but tokens and data are kept simple for
  teaching — this is not hardened for production.
- Data resets whenever you run `npm run seed`.
- The optional Redis and Cloudinary integrations "fail soft": if their env
  vars are empty, the app logs a warning and keeps running.
- Notifications are held in memory on the client, so they reset on refresh;
  the chat messages themselves are stored in MongoDB.
