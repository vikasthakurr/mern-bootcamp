# TalentBridge API — Freelance Job Marketplace Backend

A REST API for a freelance job marketplace, built with **Express** using the
**MVC pattern**. Clients post jobs, freelancers submit proposals, and the API
is protected with JWT auth, role guards, validation, rate limiting, CORS, and
security headers.

## Features

- **MVC structure** — models, controllers, routes kept separate
- **Auth** — register / login with JWT (`jsonwebtoken`)
- **Role-based access** — `client` vs `freelancer` guards
- **Validation** — a small schema-based request validator
- **Security** — `helmet` headers + `cors`
- **Rate limiting** — global limiter + a stricter one on auth routes
- **Central error handling** — one error handler, consistent error shape
- **Logging** — `morgan` request logs
- **Config modules** — MongoDB, Redis, Cloudinary, and Swagger (all optional)
- **API docs** — Swagger UI at `/api/docs`

Every external integration (MongoDB, Redis, Cloudinary) **fails soft**: if its
env vars are not set, the app logs a warning and keeps running on in-memory
data. This lets you start the API with zero setup, then enable each service
one at a time.

## Getting started

```bash
npm install
cp .env.example .env
npm run dev          # auto-restart with node --watch
# or
npm start
```

Server runs at `http://localhost:4000`. Swagger docs at
`http://localhost:4000/api/docs`.

## Demo accounts

| Role       | Email          | Password      |
| ---------- | -------------- | ------------- |
| Client     | alice@demo.com | password123   |
| Freelancer | bob@demo.com   | password123   |

## API endpoints

Base URL: `/api`

### Auth

| Method | Path             | Access | Body                              |
| ------ | ---------------- | ------ | --------------------------------- |
| POST   | `/auth/register` | public | name, email, password, role       |
| POST   | `/auth/login`    | public | email, password                   |
| GET    | `/auth/me`       | token  | —                                 |

### Jobs

| Method | Path         | Access         | Notes                                   |
| ------ | ------------ | -------------- | --------------------------------------- |
| GET    | `/jobs`      | public         | filter, search, sort, paginate          |
| GET    | `/jobs/:id`  | public         | single job                              |
| POST   | `/jobs`      | client only    | create a job                            |
| PUT    | `/jobs/:id`  | client (owner) | update own job                          |
| DELETE | `/jobs/:id`  | client (owner) | delete own job                          |

Query params on `GET /jobs`: `category`, `search`, `minBudget`, `maxBudget`,
`sort` (`budget_asc` | `budget_desc`), `page`, `limit`.

### Proposals

| Method | Path                    | Access           | Notes                         |
| ------ | ----------------------- | ---------------- | ----------------------------- |
| GET    | `/jobs/:jobId/proposals`| client (owner)   | proposals on your job         |
| POST   | `/jobs/:jobId/proposals`| freelancer only  | submit a proposal             |

## Example requests

```bash
# Login (grab the token)
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@demo.com","password":"password123"}'

# Create a job (client)
curl -X POST http://localhost:4000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"title":"Mobile app","description":"iOS app","budget":2000,"category":"mobile"}'

# List jobs with filters
curl "http://localhost:4000/api/jobs?category=web&sort=budget_desc&page=1&limit=10"
```

## Response shape

Success:

```json
{ "success": true, "data": { ... } }
```

Error:

```json
{ "success": false, "error": "message here" }
```

## Project structure

```
server.js                 # starts the server (connects DB/Redis/Cloudinary)
src/
  app.js                  # express app + middleware wiring
  config/
    env.js                # environment variables in one object
    db.js                 # MongoDB (Mongoose) connection
    redis.js              # Redis client + cache helpers
    cloudinary.js         # Cloudinary config + upload helper
    swagger.js            # Swagger/OpenAPI docs
  models/                 # in-memory data stores
    userModel.js
    jobModel.js
    proposalModel.js
  controllers/            # request/response logic
    authController.js
    jobController.js
    proposalController.js
  routes/                 # endpoint definitions
    index.js
    authRoutes.js
    jobRoutes.js
  middleware/
    authenticate.js       # verify JWT
    authorize.js          # role guard
    validate.js           # request body validation
    rateLimiter.js        # rate limiters
    notFound.js           # 404 handler
    errorHandler.js       # central error handler
  utils/
    ApiError.js           # custom error class
    asyncHandler.js       # async try/catch wrapper
```

## Notes for learners

- Passwords are stored in plain text **only** for this demo. A real app must
  hash them (e.g. with `bcrypt`).
- Data lives in memory, so it resets when the server restarts. Set `MONGO_URI`
  to persist with MongoDB.
```
