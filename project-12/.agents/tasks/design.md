# TalentBridge MERN Capstone — Requirements & Design

Project root: `/Users/gfg19722-laptop/Desktop/mern-cohort-projects/project-12`

This document covers two deliverables: the requirements for the TalentBridge capstone, and the concrete technical design for implementing it. The backend already exists in `project-12/server/` as a copy of the working in-memory Express REST API from project-11. It is upgraded in place to a real MongoDB-backed MERN backend. The React frontend in `project-12/client/` does not yet exist and is created from scratch.

---

## Part 1 — Requirements

### Summary

TalentBridge is a freelance job marketplace. Clients post jobs; freelancers browse jobs and submit proposals (bids). The capstone delivers a full MERN stack: an Express + MongoDB (Mongoose) backend with JWT auth, bcrypt password hashing, role-based access control, filtering/sorting/pagination, rate limiting, CORS, Swagger docs, and fail-soft Redis/Cloudinary integrations; plus a Vite + React 18 single-page frontend wired end to end against the backend.

The backend is an upgrade of an existing in-memory API. The response envelope, MVC layering, `ApiError` + `asyncHandler` patterns, ES modules (`type: "module"`, `import` only), and comment-free backend style are all preserved. The frontend is new, carries teaching comments, and reuses the project-9 stack and indigo brand.

### Functional Requirements

**Authentication & users**

- FR1. Users register with name, email (unique), password, and role (`client` or `freelancer`). Passwords are hashed with bcrypt before storage.
- FR2. Users log in with email + password and receive a JWT. The token encodes the user id and role.
- FR3. An authenticated user can fetch their own profile (`GET /api/auth/me`).
- FR4. Passwords are never returned in any API response.

**Jobs**

- FR5. Only clients can create jobs (title, description, budget, category).
- FR6. Anyone (authenticated or not) can list jobs and view a single job.
- FR7. Job listing supports filtering by `category`, text `search` across title and description, and `minBudget`/`maxBudget`.
- FR8. Job listing supports sorting: `budget_asc`, `budget_desc`, and default newest-first.
- FR9. Job listing is paginated with `page` and `limit`, returning `count`, `total`, `page`, and `totalPages`.
- FR10. Only the owning client can update or delete their job.

**Proposals**

- FR11. Only freelancers can submit a proposal (cover letter, bid amount) to a job.
- FR12. Only the client who owns a job can list its proposals.
- FR13. A single job's proposal list is retrievable by the owning client.

**Seed & tooling**

- FR14. A seed script (`npm run seed`) clears collections, inserts 2 clients + 2 freelancers (hashed passwords), ~5 jobs across web/design/mobile/marketing, and a couple proposals, then prints a summary and demo login credentials.
- FR15. Swagger docs remain available at `/api/docs`.

**Frontend**

- FR16. Public pages: home (`/`), job browse (`/jobs`), job detail (`/jobs/:id`), login (`/login`), register (`/register`).
- FR17. The job browse page drives search, category, and sort through URL query params.
- FR18. On a job detail page: freelancers see a proposal submission form; the owning client sees the proposals list.
- FR19. A role-aware dashboard (`/dashboard`) is protected and shows client vs freelancer views.
- FR20. The navbar is auth/role-aware and offers logout; protected routes and role guards redirect unauthorized users.
- FR21. The frontend attaches the JWT from `localStorage` as `Authorization: Bearer <token>` on API calls.

### Non-Functional Requirements

- NFR1. ES modules throughout the backend; `import` only, never `require`.
- NFR2. Backend source stays comment-free. Frontend source carries teaching comments.
- NFR3. MVC layering preserved: routes → controllers → models (Mongoose). Cross-cutting concerns stay in middleware; errors flow through `ApiError` + `asyncHandler` + the central error handler.
- NFR4. The response envelope is unchanged: success `{ success: true, data: ... }` (lists add `count/total/page/totalPages`); error `{ success: false, error: "message" }`.
- NFR5. Redis and Cloudinary fail soft: absent credentials log a warning and disable the feature without crashing the server.
- NFR6. CORS allows the Vite dev origin `http://localhost:5173`.
- NFR7. Rate limiting is retained (global API limiter + stricter auth limiter).
- NFR8. The frontend uses the locked stack: Vite + React 18 + Tailwind v3 + react-router-dom v6 + @tanstack/react-query v5, plain JS/JSX.

### Acceptance Criteria

1. `POST /api/auth/register` with a new email creates a user, stores a bcrypt hash (not plaintext), and returns `201 { success:true, data:{ user, token } }` with no `password` field on `user`.
2. Registering a duplicate email returns `409 { success:false, error:"Email is already registered" }`.
3. `POST /api/auth/login` with correct credentials returns `200` with a user + token; wrong credentials return `401 { success:false, error:"Invalid email or password" }`.
4. `GET /api/auth/me` with a valid Bearer token returns the current user; missing/invalid token returns `401`.
5. `POST /api/jobs` as a client creates a job (`201`); as a freelancer returns `403`; unauthenticated returns `401`; missing required fields returns `400`.
6. `GET /api/jobs?category=design&search=logo&minBudget=100&maxBudget=1000&sort=budget_asc&page=1&limit=10` returns a filtered, sorted, paginated list with correct `count`, `total`, `page`, `totalPages`.
7. `GET /api/jobs/:id` returns a job with its client populated (id + name only); an unknown id returns `404 { success:false, error:"Job not found" }`.
8. `PUT /api/jobs/:id` and `DELETE /api/jobs/:id` succeed for the owning client, return `403` for a different client, and `404` for an unknown id.
9. `POST /api/jobs/:jobId/proposals` as a freelancer creates a proposal (`201`); as a client returns `403`; on unknown job returns `404`.
10. `GET /api/jobs/:jobId/proposals` returns proposals for the owning client; a non-owning client returns `403`; unknown job returns `404`.
11. `npm run seed` completes, prints a summary and demo credentials, and those credentials log in successfully afterward.
12. The server starts with empty `REDIS_URL` and empty `CLOUDINARY_*` without crashing, logging warnings for each.
13. The frontend dev server at `http://localhost:5173` reaches the backend at `http://localhost:4000/api` without CORS errors.
14. Logging in on the frontend persists user + token to `localStorage`; a hard refresh keeps the user signed in; logout clears both and returns to a public view.
15. Visiting `/dashboard` while logged out redirects to `/login`; a freelancer visiting a client-only view is blocked by the role guard.
16. No backend source file contains comments; the Mongoose `toJSON` transform strips `password` and normalizes `_id` to `id`.

### Out of Scope

- Payments, escrow, messaging/chat, reviews/ratings, and proposal accept/reject workflow.
- Real image uploads (Cloudinary stays configured-but-optional; no upload endpoint is added in this capstone).
- Real Redis caching behavior beyond the existing fail-soft config (no cache layer is wired into controllers).
- Email verification, password reset, refresh tokens, and OAuth.
- Deployment, CI, and production hardening beyond the existing helmet/rate-limit setup.
- Server-side rendering and TypeScript (frontend is plain JSX per the locked stack).

---

## Part 2 — Technical Design

### Overview

The backend keeps its exact MVC shape (`server.js` → `src/app.js` → `src/routes` → `src/controllers` → `src/models`, with `src/middleware` and `src/config` as cross-cutting layers). The only structural change is that the three models stop being in-memory arrays and become Mongoose models, and the three controllers plus `authenticate` middleware call Mongoose directly with `async/await`. Every public contract — routes, the response envelope, `ApiError` codes, validation middleware, the rate limiters, Swagger — is preserved so the upgrade is invisible from the client's perspective except that data now persists.

The frontend is a new Vite + React 18 SPA under `client/`, mirroring the project-9 toolchain (Tailwind v3, PostCSS, `@vitejs/plugin-react`, the indigo `brand` palette, inline SVG icons, Inter font). It adds `react-router-dom` v6 for routing and `@tanstack/react-query` v5 for server state, with a thin `fetch`-based API client and an `AuthContext` for the session. Server state (jobs, proposals) lives in React Query; session state (user + token) lives in context backed by `localStorage`.

### Technology stack (locked)

Backend: Node.js (ES modules, `type: "module"`), Express 4, Mongoose 8, jsonwebtoken 9, **bcryptjs** (pure-JS, no native build step — chosen over `bcrypt` to avoid compilation issues in a teaching repo), express-rate-limit 7, helmet 7, cors 2, morgan 1, dotenv 16, swagger-jsdoc + swagger-ui-express, ioredis 5 (fail soft), cloudinary 2 (fail soft).

Frontend: Vite 5, React 18, react-dom 18, react-router-dom 6, @tanstack/react-query 5, Tailwind CSS 3, PostCSS, autoprefixer, `@vitejs/plugin-react`. Plain JS/JSX, native `fetch`.

### Backend data model (Mongoose)

All three models live in their existing files and export a default Mongoose model. The in-memory arrays and the `{ model }.all()/.findById()/.create()` object surfaces are removed. **Decision: controllers call Mongoose directly** rather than preserving the old model-object surface. Reason: the old surface (`jobModel.all()`, `userModel.findByEmail()`) was a hand-rolled repository over arrays; keeping a wrapper around Mongoose would add a redundant abstraction, hide query capabilities (`.populate()`, `.sort()`, `.skip()`, `.limit()`, lean queries) the controllers now need, and provide no teaching value. Mongoose documents already are the model layer in MVC. Controllers become `async` and `await` Mongoose calls.

**User** — `src/models/userModel.js`

- Fields: `name` (String, required, trimmed), `email` (String, required, unique, lowercased, trimmed), `password` (String, required, `select: false`), `role` (String, enum `["client", "freelancer"]`, required).
- `timestamps: true`.
- Pre-save hook: if `password` is modified, hash with `bcryptjs` using a salt of 10 rounds.
- Instance method `matchPassword(plain)`: returns `bcrypt.compare(plain, this.password)`.
- `toJSON` transform: configured as the schema option `{ toJSON: { virtuals: true, transform(doc, ret) { ... } } }` — it must be `toJSON` (not `toObject`), because the leak-prevention relies on `res.json` → `JSON.stringify` invoking `toJSON` (Finding 9). The transform deletes `password`, deletes `__v`, sets `ret.id = ret._id.toString()`, and deletes `_id`. This enforces FR4/AC16 at the model layer for every serialization path (register, login, me, populate).
- Because `password` is `select: false`, login must query with `.select("+password")`.

**Job** — `src/models/jobModel.js`

- Fields: `title` (String, required, trimmed), `description` (String, required), `budget` (Number, required, min 0), `category` (String, required, trimmed, lowercased), `client` (ObjectId, ref `"User"`, required).
- `timestamps: true`.
- `toJSON` transform: `__v` removed, `id` set from `_id`, `_id` removed.
- Text search is implemented with case-insensitive `$regex` on `title`/`description` (simple and index-free for a teaching dataset) rather than a Mongo `$text` index; this keeps `search` and `category` filters composable in one `find()` without a text-index/compound-sort conflict.

**Proposal** — `src/models/proposalModel.js`

- Fields: `job` (ObjectId, ref `"Job"`, required), `freelancer` (ObjectId, ref `"User"`, required), `coverLetter` (String, required), `bidAmount` (Number, required, min 0).
- `timestamps: true`.
- `toJSON` transform as above.

Field renames from the in-memory version: `clientId → client`, `jobId → job`, `freelancerId → freelancer`. These names are chosen to match Mongoose ref conventions and are reflected everywhere downstream (controllers, seed, frontend expectations). The response envelope still exposes `id` (via transform), so the frontend keys off `job.id`, `job.client`, `proposal.freelancer`, etc.

### Backend layer changes

**`src/config/env.js`** — one change (Review Finding 3): the in-code `mongoUri` default becomes the local database instead of blank:

```js
mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/talentbridge",
```

**Decision (Finding 3):** adopt option (a) — bake the local default into committed code — so a fresh checkout connects to MongoDB on `npm run dev`/`npm run seed` even if the developer never creates `.env`. Reason: the capstone's defining behavior is "data persists in MongoDB," and that happy path must be reproducible from the repo alone; the previous design left the only Mongo default inside the gitignored `.env`, so a bare clone silently fell to the in-memory warning path and never exercised the Mongoose models. With this default, the in-memory fallback in `db.js` is reachable only if a developer explicitly sets `MONGO_URI=` to empty — it is retained as a deliberate safety net, not the default mode. The shipped `.env` and `.env.example` still set `MONGO_URI` (documentation + override for non-local databases); they now agree with the code default rather than being the sole source of it.

**`server.js`** — unchanged. `connectDB()` already runs before `app.listen`. With the new in-code `mongoUri` default (and/or a populated `MONGO_URI`) it connects on every normal run; the existing "running with in-memory data" warning path is reachable only when a developer explicitly blanks `MONGO_URI`, so it survives as a deliberate safety net rather than the default.

**`src/app.js`** — one change: CORS is configured to allow the Vite origin. Replace `app.use(cors())` with:

```js
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  }),
);
```

Rationale: the frontend sends an `Authorization` header (not cookies), so `credentials: true` is not strictly required, but it is harmless and future-proofs cookie-based flows. The explicit origins satisfy NFR6/AC13; `127.0.0.1:5173` is included alongside `localhost:5173` so a developer hitting the loopback IP is not silently blocked (Finding 8). Everything else in `app.js` (helmet, json, morgan, swagger mount, rate limiter, routes, notFound, errorHandler) is untouched.

**`src/middleware/authenticate.js`** — becomes async, wrapped in `asyncHandler` for consistency with controllers (verified `asyncHandler = (fn) => (req,res,next) => Promise.resolve(fn(req,res,next)).catch(next)`, so any throw/rejection inside the body reaches `next`). **Decision (Finding 7): keep an inner `try/catch` around `jwt.verify` even inside the async body**, because `asyncHandler` forwards the _raw_ thrown error — a bare `jwt.verify` throw would surface jsonwebtoken's own message (`"jwt expired"`, `"invalid signature"`) and break the current contract message `"Invalid or expired token"`. The exact shape:

```js
export const authenticate = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer "))
    throw ApiError.unauthorized("Missing or invalid Authorization header");
  let payload;
  try {
    payload = jwt.verify(header.split(" ")[1], env.jwtSecret);
  } catch {
    throw ApiError.unauthorized("Invalid or expired token");
  }
  const user = await User.findById(payload.id);
  if (!user) throw ApiError.unauthorized("User no longer exists");
  req.user = { id: user.id, name: user.name, role: user.role };
  next();
});
```

Message contract: missing/blank header → `"Missing or invalid Authorization header"`; verify failure (bad/expired token) → `"Invalid or expired token"`; valid token whose user no longer exists → `"User no longer exists"`. All three are `401` (AC4). The user is resolved with `await User.findById(payload.id)` (replacing the in-memory lookup), and `req.user` is the trimmed `{ id, name, role }`.

**`authorize.js`, `validate.js`, `rateLimiter.js`, `notFound.js`, `errorHandler.js`** — unchanged. They already operate on `req.user`/`ApiError` and are storage-agnostic.

### Controller design (async/await, Mongoose)

**`authController.js`**

- `createToken(user)` and token signing unchanged (`{ id, role }`, `env.jwtSecret`, `env.jwtExpiresIn`). The payload uses `user.id`, which is the Mongoose **`.id` virtual** (the hex string of `_id`, always present on a saved/created document regardless of the `toJSON` transform). Note (Review Finding 4): call `createToken(user)` on the live Mongoose document returned by `User.create(...)` / `User.findOne(...)` — do **not** serialize first and pass a `.toJSON()` result, and do not confuse the `.id` virtual with the transform-produced `id` on a plain object. Both resolve to the same hex string here, but the contract is "token is signed from the live document's `.id` virtual."
- `safeUser` helper is removed; the `toJSON` transform already strips `password`, so controllers return the document directly (Express serializes via `toJSON`).
- `register`: check `await User.findOne({ email })`; if found → `ApiError.conflict("Email is already registered")` (AC2). Else `await User.create({ name, email, password, role })` (pre-save hook hashes). Respond `201 { success:true, data:{ user, token } }`.
- `login`: `const user = await User.findOne({ email }).select("+password")`. If no user or `!(await user.matchPassword(password))` → `ApiError.unauthorized("Invalid email or password")` (AC3). The returned user still hides `password` via transform (the selected field is not serialized because `toJSON` deletes it). Respond `200 { success:true, data:{ user, token } }`.
- `me`: `await User.findById(req.user.id)`; if missing → `ApiError.unauthorized("User no longer exists")`. Respond `{ success:true, data:{ user } }`.

**`jobController.js`**

- `listJobs`: build a Mongo `filter` object: `category` → exact match against the **lowercased query value** `filter.category = String(category).toLowerCase()` (Finding 3). Stored categories are lowercased by the schema (`lowercase: true`), so the incoming query param must be lowercased too or `?category=Design` would return zero rows against a stored `design`; `search` → `$or` of `{ title: { $regex, $options:"i" } }` and `{ description: ... }`; `minBudget`/`maxBudget` → `budget: { $gte, $lte }` (added only when present and numeric). Sort map: `budget_asc` → `{ budget: 1 }`, `budget_desc` → `{ budget: -1 }`, default `{ createdAt: -1 }`. Pagination: `page = max(1, Number(page)||1)`, `limit = max(1, Number(limit)||10)`, `skip = (page-1)*limit`. Run `const [items, total] = await Promise.all([Job.find(filter).populate("client", "name").sort(sort).skip(skip).limit(limit), Job.countDocuments(filter)])`. Respond `{ success:true, count: items.length, total, page, totalPages: Math.ceil(total/limit), data: items }` (AC6). This preserves the existing envelope exactly.
- `getJob`: `await Job.findById(req.params.id).populate("client", "name")`. Invalid ObjectId → treat as not found (see Error handling). Missing → `ApiError.notFound("Job not found")`. Respond `{ success:true, data: job }` (AC7).
- `createJob`: `await Job.create({ title, description, budget, category, client: req.user.id })`, then `await job.populate("client", "name")` before responding so `job.client` is the populated `{ id, name }` object (Review Finding 1). Respond `201 { success:true, data: job }` (AC5). Route already enforces `authorize("client")` + `validate`.
- `updateJob`: `await Job.findById(id)` (WITHOUT populate — see the ownership invariant below); missing → `404`; ownership check uses the populate-independent form `String(job.client._id || job.client) !== req.user.id` → `ApiError.forbidden("You can only update your own jobs")` (AC8). Apply only provided fields (`title/description/budget/category`), `await job.save()`, then `await job.populate("client", "name")` before responding so the updated doc carries the same populated `client` shape as list/detail (Review Finding 1). Respond with the updated doc.
- `deleteJob`: `await Job.findById(id)` (WITHOUT populate); missing → `404`; non-owner (same populate-independent check) → `ApiError.forbidden("You can only delete your own jobs")`. `await job.deleteOne()`, respond `{ success:true, message:"Job deleted" }`.

**Job `client` serialization shape — single contract (Review Finding 1):** `job.client` is **always** the populated `{ id, name }` object on every job-returning endpoint — `listJobs`, `getJob`, `createJob`, and `updateJob`. `listJobs`/`getJob` populate on read; `createJob`/`updateJob` re-populate after the write. No job-returning response ever exposes `client` as a bare ObjectId string. The frontend therefore relies on one shape (`job.client.id`, `job.client.name`) across list cards, detail view, ownership checks, and any mutation that consumes a create/update response (e.g. a dashboard create-job mutation prepending the new job).

**`proposalController.js`**

- `listProposalsForJob`: `await Job.findById(req.params.jobId)` (WITHOUT populate — see the ownership invariant); missing → `404`. Ownership: the route already restricts to `authorize("client")`, so enforce the populate-independent check `String(job.client._id || job.client) !== req.user.id` → `ApiError.forbidden("You can only view proposals on your own jobs")` (AC10). Then `await Proposal.find({ job: job.id }).populate("freelancer", "name email")`. Respond `{ success:true, count, data }`.
- `createProposal`: `await Job.findById(req.params.jobId)`; missing → `404`. Route restricts to `authorize("freelancer")`. Create `await Proposal.create({ job: job.id, freelancer: req.user.id, coverLetter, bidAmount })`. Respond `201 { success:true, data: proposal }` (AC9). **Duplicate proposals are allowed** (Finding 4): a freelancer may submit more than one proposal to the same job, so there is **no compound unique index** on `{ job, freelancer }` and no `409` dedupe path. This matches the requirements/ACs (which never forbid it) and keeps `email` as the single unique index in the system, which is why the `11000` handler's email-only outcome (Finding 5) is correct. Deduping proposals is explicitly out of scope.

### Route layer

`src/routes/index.js` and `authRoutes.js` are unchanged. `jobRoutes.js` needs **one change** (see Finding 1 resolution below): the `PUT /:id` route gains a `validate({...})` with all-optional fields so bad body types on update are rejected with `400` before reaching Mongoose, rather than leaking through as a `CastError`. Everything else in `jobRoutes.js` is unchanged — the middleware chains already encode the ownership/role rules (`authorize("client")` for create/update/delete/list-proposals, `authorize("freelancer")` for create-proposal, `validate({...})` for bodies, `authLimiter` on auth). The proposal endpoints remain nested under `/jobs/:jobId/proposals` in `jobRoutes.js`. No new routes are added.

**`PUT /:id` body validation (new)** — mirror the `POST /` validation but with every field optional (drop `required: true`). The existing `validate` middleware skips fields that are `undefined`/`""`, so an optional rule only type-checks a field when the client actually sends it:

```js
router.put(
  "/:id",
  authenticate,
  authorize("client"),
  validate({
    title: { type: "string" },
    description: { type: "string" },
    budget: { type: "number" },
    category: { type: "string" },
  }),
  updateJob,
);
```

This makes `PUT /api/jobs/:id` with `{ budget: "abc" }` return `400 "budget must be a number"` instead of the misleading `404` that would otherwise come from the global CastError mapping, and it closes the silent-cast gap where a non-string `title` was previously coerced by Mongoose with no `400`. `DELETE /:id` takes no body and stays validation-free.

### API contract (preserved)

| Method | Path                         | Auth   | Role          | Success                                                |
| ------ | ---------------------------- | ------ | ------------- | ------------------------------------------------------ |
| POST   | `/api/auth/register`         | —      | —             | `201 {success,data:{user,token}}`                      |
| POST   | `/api/auth/login`            | —      | —             | `200 {success,data:{user,token}}`                      |
| GET    | `/api/auth/me`               | Bearer | any           | `200 {success,data:{user}}`                            |
| GET    | `/api/jobs`                  | —      | —             | `200 {success,count,total,page,totalPages,data:[...]}` |
| GET    | `/api/jobs/:id`              | —      | —             | `200 {success,data:job}`                               |
| POST   | `/api/jobs`                  | Bearer | client        | `201 {success,data:job}`                               |
| PUT    | `/api/jobs/:id`              | Bearer | client(owner) | `200 {success,data:job}`                               |
| DELETE | `/api/jobs/:id`              | Bearer | client(owner) | `200 {success,message}`                                |
| GET    | `/api/jobs/:jobId/proposals` | Bearer | client(owner) | `200 {success,count,data:[...]}`                       |
| POST   | `/api/jobs/:jobId/proposals` | Bearer | freelancer    | `201 {success,data:proposal}`                          |

Error envelope for all failures: `{ success:false, error:"message" }` with status 400/401/403/404/409/429/500 as produced by `ApiError` and the central `errorHandler`.

### Error handling (per operation)

- **Mongoose connection failure at startup** (`connectDB`): fatal. `db.js` already logs `[db] MongoDB connection failed` and rethrows; `start()` has no catch, so the process exits — acceptable for a dev capstone (no silent half-started server). Logged at error level.
- **Invalid ObjectId in `:id`/`:jobId`** (e.g. `/api/jobs/abc`): recoverable. `Job.findById("abc")` throws a `CastError` whose `err.path === "_id"`. The central `errorHandler` is extended (the one addition to that file) to branch, in this order:
  - Mongoose `CastError` **on the `_id` path** → `404 "Job not found"` (resource-not-found semantics match AC7). Scoping to `err.path === "_id"` is deliberate (Finding 2): a cast failure on any other field must not masquerade as a missing job.
  - Mongoose `CastError` **on any other path** → `400 "Invalid value for <path>"`. This path is only reachable for body fields that bypass `validate` (none do after Finding 1 adds `PUT` validation), so it is a defensive fallback rather than a primary route, but it keeps a stray field-cast from ever being mislabeled `404`.
  - Mongoose `ValidationError` → `400` with the joined validation messages (`Object.values(err.errors).map(e => e.message).join("; ")`).
  - Duplicate-key `code 11000` → `409`, with the message **derived from the duplicated key** (Finding 5), not hardcoded: `const field = Object.keys(err.keyPattern || {})[0]; const error = field === "email" ? "Email is already registered" : "Duplicate value";`. Since `email` is the only unique index in this design (proposals allow duplicates — see Proposal design), the practical result is always the email message, but the branch keeps the generic handler decoupled from that single index.

  Concretely the handler gains, before the existing `ApiError`/500 branch:

  ```js
  if (err.name === "CastError" && err.path === "_id") {
    return res.status(404).json({ success: false, error: "Job not found" });
  }
  if (err.name === "CastError") {
    return res
      .status(400)
      .json({ success: false, error: `Invalid value for ${err.path}` });
  }
  if (err.name === "ValidationError") {
    const msg = Object.values(err.errors)
      .map((e) => e.message)
      .join("; ");
    return res.status(400).json({ success: false, error: msg });
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0];
    const error =
      field === "email" ? "Email is already registered" : "Duplicate value";
    return res.status(409).json({ success: false, error });
  }
  ```

  This keeps controllers free of per-call cast guards. The caller receives the normal error envelope. Non-ApiError, non-recognized errors remain `500` and are logged. (`404 "Job not found"` is job-centric by design; this app's only id-param resources are jobs and the job-scoped proposal routes, so the message is always accurate here.)

- **Duplicate email** (race between `findOne` and `create`): recoverable. The unique index throws `11000`; mapped to `409 "Email is already registered"` by the key-derived handler above, so AC2 holds even under the race. Logged at nothing (operational 4xx).
- **Missing/invalid JWT**: recoverable → `401` via `authenticate`. Not logged (expected).
- **Wrong role / non-owner**: recoverable → `403` via `authorize` or the controller ownership check. Not logged.
- **Validation failure** (missing/typed body fields): recoverable → `400` from `validate` middleware with joined messages. Not logged.
- **bcrypt compare/hash failure**: unexpected → bubbles to `errorHandler` as `500`, logged. Not expected in normal operation.
- **Redis unavailable**: non-fatal by design. `connectRedis` warns and returns null; no controller depends on it, so requests proceed. Logged at warn.
- **Cloudinary unconfigured**: non-fatal. `configureCloudinary` warns and returns null; no upload path is exercised. Logged at warn.
- **Rate limit exceeded**: `429` with the configured envelope message from `rateLimiter.js`. Not logged.

Logging policy: 500s are logged with the full error (existing behavior in `errorHandler`); 4xx operational errors are not logged. Startup config states (db/redis/cloudinary/swagger) log once at boot.

### Input validation rules (external inputs)

Body validation is handled by the existing `validate` middleware (type + required + enum); Mongoose schema validation is the second layer (min, enum, required, unique). Query params are validated/coerced inside `listJobs`.

- `register`: `name` required string; `email` required string (uniqueness enforced by schema index, format not strictly validated — lowercased/trimmed by schema); `password` required string; `role` required string in `["client","freelancer"]`. Failure → `400`.
- `login`: `email` required string, `password` required string. Failure → `400`; bad credentials → `401`.
- `createJob`: `title` required string, `description` required string, `budget` required number (schema `min: 0`), `category` required string. Failure → `400`.
- `updateJob`: all fields optional. Type errors are caught first by the new all-optional `validate` on the route (wrong-typed `budget`/`title`/etc → `400` before the controller). Provided fields that are correctly typed but violate schema constraints on `save()` (e.g. negative `budget` → Mongoose `ValidationError`, `min: 0`) → `400` via the error handler. Only owner may update (else `403`).
- `createProposal`: `coverLetter` required string, `bidAmount` required number (`min: 0`). Failure → `400`.
- Query params on `GET /api/jobs`: `category` optional string; `search` optional string; `minBudget`/`maxBudget` optional, coerced via `Number`, ignored if `NaN`; `sort` optional, any value other than `budget_asc`/`budget_desc` falls back to newest-first; `page`/`limit` coerced and floored at 1 / defaulted to 1 / 10. No hard failure on bad query params — they degrade to defaults (lenient read endpoint).

### Invariant ownership

- **Password is never serialized**: owned by the User model (`select:false` + `toJSON` transform). Chosen at the model layer because it must hold for every code path (login, me, register, populate) without each controller remembering to strip it.
- **Only owning client sees/mutates their job and its proposals**: owned by the controllers, with the role gate (`client` vs `freelancer`) owned by the `authorize` route middleware. Split this way because role is coarse and route-level, while ownership is row-level and needs the fetched document. **Ownership-check rule (stated once, Review Finding 2):** every ownership-checking controller (`updateJob`, `deleteJob`, `listProposalsForJob`) MUST (a) fetch the job WITHOUT `.populate("client", ...)`, and (b) compare with the populate-independent form `String(job.client._id || job.client) !== req.user.id`. Rule (a) keeps `job.client` an ObjectId so the comparison is cheap and correct; rule (b) is a belt-and-suspenders guard so that if a future edit accidentally populates `client` on one of these paths, `job.client._id` is used and the check does not silently degrade to `"[object Object]"` (which would make every comparison fail-open or fail-closed incorrectly). The job-returning endpoints that DO populate (`getJob`, `listJobs`, `createJob`, `updateJob` response) are not ownership-gated at the point of the populate, so there is no conflict.
- **Password hashing**: owned by the User pre-save hook, so any create/save path hashes consistently (including the seed script, which calls `User.create`).
- **Response envelope shape**: owned by controllers (they assemble `{ success, data, ... }`) and the `errorHandler` (error shape). Unchanged from project-11.

### Seed script contract — `server/src/seed.js`

Runnable via `npm run seed` (new script: `"seed": "node src/seed.js"` in `server/package.json`). Behavior:

1. `dotenv` config, `await connectDB()` (requires `MONGO_URI`).
2. Clear collections: `await Promise.all([User.deleteMany({}), Job.deleteMany({}), Proposal.deleteMany({})])`.
3. Insert users via `User.create([...])` (not `insertMany`, so the pre-save hashing hook runs): 2 clients + 2 freelancers, each with a known plaintext password (e.g. `password123`) that gets hashed. **`User.create([...])` returns an array of saved documents** (Finding 6); destructure it and reference each document's live `_id` (not a serialized `id`) when wiring foreign keys:
   ```js
   const [clientA, clientB, freelancerA, freelancerB] = await User.create([ ... ]);
   ```
4. Insert ~5 jobs across categories `web`, `design`, `mobile`, `marketing` (budgets varied), each `client` set from a created client document's `_id`:
   ```js
   const jobs = await Job.create([
     { title: ..., description: ..., budget: ..., category: "web", client: clientA._id },
     ...
   ]);
   ```
5. Insert a couple proposals linking a seeded freelancer to a couple of the created jobs, using the documents' `_id`:
   ```js
   await Proposal.create([
     { job: jobs[0]._id, freelancer: freelancerA._id, coverLetter: ..., bidAmount: ... },
     ...
   ]);
   ```
   Note: the `toJSON` transform only renames `_id`→`id` at serialization time; the live document still exposes `._id` (and the `.id` virtual string), so the seed uses `._id` consistently and never a serialized form.
6. Print a summary (counts of users/jobs/proposals) and a demo-credentials block (email + plaintext password + role for one client and one freelancer).
7. `await disconnectDB()` and `process.exit(0)`; on any error, log and `process.exit(1)`.

The script is comment-free like the rest of the backend. It imports the three models and `connectDB`/`disconnectDB` from config. AC11/AC14 depend on the printed credentials actually logging in, which holds because hashing runs through the same hook as registration.

### Env contract

`server/.env.example` is updated and a working `server/.env` is created (the latter is gitignored — confirm `server/.gitignore` ignores `.env`; add it if missing). Both contain:

```
PORT=4000
NODE_ENV=development

JWT_SECRET=super-secret-change-me
JWT_EXPIRES_IN=1d

RATE_LIMIT_WINDOW_MINUTES=15
RATE_LIMIT_MAX=100

MONGO_URI=mongodb://127.0.0.1:27017/talentbridge

REDIS_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Difference from today's `.env.example`: `MONGO_URI` now defaults to the local talentbridge database instead of blank. `REDIS_URL` and `CLOUDINARY_*` stay blank so both fail soft (NFR5/AC12). The working `.env` carries the same values so `npm run dev` / `npm run seed` connect to a local Mongo without extra setup.

Note (Review Finding 3): the `MONGO_URI` value in `.env`/`.env.example` now **matches** the in-code default in `env.js` (`mongodb://127.0.0.1:27017/talentbridge`). The code default is the authoritative guarantee of reproducibility — a bare checkout with no `.env` still connects to local Mongo. The `.env` entries exist so a developer can point at a non-local database (e.g. Atlas) by editing one line, and so `.env.example` documents every variable for humans.

### Backend dependency change

Add `bcryptjs` to `server/package.json` dependencies (`^2.4.3`). `mongoose` is already present. No other backend deps change. `bcryptjs` chosen over `bcrypt` to avoid native compilation in a cohort/teaching environment; the API (`genSalt`/`hash`/`compare`) is equivalent.

---

### Frontend architecture — `project-12/client/`

A new Vite React SPA mirroring project-9's toolchain, extended with routing and React Query. All frontend files carry teaching comments (NFR2).

**Project files**

- `client/package.json` — `type: module`; scripts `dev`/`build`/`preview`; deps: `react`, `react-dom`, `react-router-dom@^6`, `@tanstack/react-query@^5`; devDeps: `vite@^5`, `@vitejs/plugin-react`, `tailwindcss@^3`, `postcss`, `autoprefixer`.
- `client/vite.config.js` — `defineConfig({ plugins: [react()] })`, copied from project-9. Dev server runs on Vite's default `5173` (matches the CORS origin).
- `client/tailwind.config.js` — copied from project-9 (same `brand` indigo palette 50/100/500/600/700, Inter font, `card` shadow, `fade-up` animation), `content: ["./index.html", "./src/**/*.{js,jsx}"]`.
- `client/postcss.config.js` — copied from project-9 (tailwindcss + autoprefixer).
- `client/index.html` — copied structure from project-9 (Inter preconnect + stylesheet, `#root`, `/src/main.jsx`), title "TalentBridge".
- `client/src/index.css` — `@tailwind` layers; body uses `bg-slate-100 text-slate-900 font-sans antialiased` like project-9.

**Entry & providers** — `client/src/main.jsx`
Wrap `<App/>` in `<QueryClientProvider>` (new `QueryClient`), `<BrowserRouter>`, and `<AuthProvider>`. Order: `QueryClientProvider` → `BrowserRouter` → `AuthProvider` → `App`. React Query owns server state; context owns session; Redux from project-9 is not used.

**API client** — `client/src/api/`

- `client/src/api/client.js` — a `request(path, { method, body, token, raw })` helper over native `fetch`. Base URL constant `http://localhost:4000/api`. It sets `Content-Type: application/json`, attaches `Authorization: Bearer <token>` when a token is passed (token read from the auth layer, see below), `JSON.stringify`s the body, parses the JSON response, and on `!res.ok` throws `new Error(json.error || "Request failed")` so React Query surfaces the backend's error message. **Return-shape discrimination (Finding 10): an explicit `raw` option controls it** — `request` returns `json.data` by default (single-resource calls) and the **full envelope** when `raw: true` is passed (list calls that need `count/total/page/totalPages`). This keeps one helper with a predictable, caller-chosen contract instead of guessing per endpoint. Accordingly, `jobs.listJobs` calls `request(path, { raw: true })` and reads `res.data`/`res.total`/`res.totalPages`; `listProposals` likewise passes `{ raw: true }` to read `count`; every single-resource call omits `raw` and gets the unwrapped `data`.
- `client/src/api/auth.js` — `register(payload)`, `login(payload)`, `getMe(token)` wrapping `request`.
- `client/src/api/jobs.js` — `listJobs(params)` (serializes `category/search/minBudget/maxBudget/sort/page/limit` into a query string), `getJob(id)`, `createJob(body, token)`, `updateJob(id, body, token)`, `deleteJob(id, token)`.
- `client/src/api/proposals.js` — `listProposals(jobId, token)`, `createProposal(jobId, body, token)`.

**Token attachment decision**: the token is passed explicitly into API functions from the calling hook/component (which reads it from `AuthContext`), rather than having `client.js` read `localStorage` directly. Reason: keeps the API layer pure and testable, and makes React Query cache keys/invalidation explicit. `localStorage` is still the persistence mechanism, but `AuthContext` is the single reader.

**Auth state** — `client/src/context/AuthContext.jsx`
`AuthProvider` holds `{ user, token }`, initialized by reading `localStorage` keys `tb_user` (JSON) and `tb_token` (string). Exposes `login(user, token)` (sets state + writes both keys), `logout()` (clears state + removes both keys), and the current `user`/`token`. A `useAuth()` hook reads the context. This satisfies FR14/AC14 (persistence across refresh) and FR21 (token available to API calls).

**Routing** — `client/src/App.jsx`
`react-router-dom` v6 `<Routes>`:

- `/` → `HomePage` (public landing, brand hero, CTA to browse/register).
- `/jobs` → `JobsPage` (public; search + category + sort bound to URL query params via `useSearchParams`).
- `/jobs/:id` → `JobDetailPage` (public read; freelancer sees proposal form, owning client sees proposals list).
- `/login` → `LoginPage`, `/register` → `RegisterPage` (public).
- `/dashboard` → `DashboardPage` wrapped in `ProtectedRoute` (any authenticated user; renders role-aware content).
- `*` → `NotFoundPage`.
  Layout: a shared `<Navbar/>` rendered above `<Routes>`.

**Guards** — `client/src/components/ProtectedRoute.jsx`
`ProtectedRoute` reads `useAuth()`; if no `user`, `<Navigate to="/login" replace/>`. An optional `role` prop additionally blocks mismatched roles (redirect to `/dashboard` or render an "unauthorized" state) — used for client-only or freelancer-only UI segments inside pages (AC15). Fine-grained role UI (proposal form vs proposals list) is decided inside `JobDetailPage` from `user.role` and whether `user.id === job.client.id`.

**Navbar** — `client/src/components/Navbar.jsx`
Adapted from project-9's Navbar visual language (sticky, white/blur, brand lettermark "T", "TalentBridge" wordmark). Links: Home, Jobs. When logged out: Login + Register buttons. When logged in: a greeting with the user's name + role badge, a link to Dashboard, and a Logout button that calls `logout()` and navigates to `/`. Uses `react-router-dom` `<Link>`/`<NavLink>`.

**Icons** — `client/src/components/Icons.jsx`
Reuse/extend project-9's inline SVG icon set (same `className`-driven pattern, `stroke="currentColor"`). Add a few job-marketplace icons as needed (briefcase, user, logout, plus). No emojis (NFR2 brand rule).

**Pages & data flow (React Query)**

- `JobsPage`: `useQuery(["jobs", params], () => listJobs(params))` where `params` derives from `useSearchParams`. A filter bar (search input, category select, sort select) updates the query string; changing it re-keys the query and refetches. Renders paginated job cards with `total`/`totalPages`.
- `JobDetailPage`: `useQuery(["job", id], () => getJob(id))`. If `user.role === "freelancer"`, show a proposal form backed by `useMutation(createProposal)` that invalidates `["job", id]`/proposals on success. If `user` is the owning client (`user.id === job.client.id`), `useQuery(["proposals", id], () => listProposals(id, token))` and render the list.
- `LoginPage`/`RegisterPage`: `useMutation` calling `auth.login`/`auth.register`; on success call `AuthContext.login(user, token)` and navigate to `/dashboard`. Backend error messages are shown inline (thrown by the API client).
- `DashboardPage`: role-aware. Client view: their posted jobs (filter `listJobs` client-side or show a "my jobs" section) plus a create-job form (`useMutation(createJob)`). Freelancer view: a prompt to browse jobs and their submitted proposals summary. Content branches on `user.role`.

**Frontend validation**: forms do lightweight required/number checks before submit (e.g. budget/bid parsed to Number, non-empty fields) to give fast feedback, but the backend remains the source of truth — any backend `400`/`401`/`403` message is surfaced to the user. `budget` and `bidAmount` are sent as numbers (parsed with `Number`) so the backend's `type:"number"` validation passes.

### Integration points & edge cases

- **CORS**: frontend origin `http://localhost:5173` must be in the backend CORS allow-list; mismatched port breaks all calls (AC13).
- **Base URL**: hardcoded `http://localhost:4000/api` constant (matches `PORT=4000`). Documented in client README so a port change is a one-line edit. Host-form note (Review Finding 5): because the backend base URL uses the `localhost` host-form, the client README instructs developers to open the app at `http://localhost:5173` (not `http://127.0.0.1:5173`) so the frontend origin and the backend host-form stay consistent. The CORS allow-list still includes `127.0.0.1:5173` as a convenience fallback, but `localhost:5173` is the documented, matching entry point. The base-URL constant in `client.js` carries a comment stating it shares host-form expectations with the CORS allow-list, so anyone mirroring the backend URL to `127.0.0.1` knows to update both ends together.
- **Token expiry**: an expired JWT yields `401`; the API client throws, and components can route the user to `/login`. Minimal handling: show the error; a `logout()` on `401` is a nice-to-have, backlogged if time-constrained.
- **Empty states**: no jobs match a filter → `data: []`, `total: 0`; `JobsPage` renders an empty state. A job with no proposals → empty proposals list.
- **Ownership mismatch on detail page**: a logged-in client viewing another client's job sees neither the proposal form (not a freelancer) nor the proposals list (not the owner) — just the read-only job view.
- **ObjectId in URL**: a malformed `:id` resolves to the backend's `404` (via CastError mapping), which the detail page renders as "job not found".
- **Refresh persistence**: on mount, `AuthProvider` rehydrates from `localStorage`; optionally revalidate with `getMe(token)` to catch a stale token (backlogged — not required by AC).

### Testability

- **Unit-testable (backend)**: the `User.matchPassword` method, the `toJSON` password-stripping transform, the `listJobs` filter/sort/pagination builder (extractable as a pure helper), and `validate` rule evaluation. `ApiError` static constructors.
- **Integration-testable (backend)**: full request/response against each endpoint with Supertest + an in-memory MongoDB (`mongodb-memory-server`) covering the acceptance criteria (status codes, envelope shape, ownership 403s, password never present). The seed script is testable by running it against the memory server and asserting counts + that printed credentials log in.
- **Frontend**: API client functions are unit-testable by mocking `fetch`. `AuthContext` login/logout/persistence testable with a jsdom `localStorage`. Pages are integration-testable with React Testing Library + a mocked API layer; routing/guards testable by rendering within a `MemoryRouter`.
- **Design-for-testability notes**: keeping the API client pure (token passed in, not read from `localStorage`) and extracting the job-query builder as a pure function are the two choices that keep the hard-to-test seams small. No test framework is currently configured in either package; adding Vitest (frontend) and Node's test runner or Vitest + Supertest (backend) is the natural choice if tests are implemented in a later step — this design does not mandate it beyond the acceptance checks.

### Files created / modified (summary)

Backend — modify in place (comment-free, ES modules):

- `server/src/models/userModel.js`, `jobModel.js`, `proposalModel.js` → Mongoose models.
- `server/src/controllers/authController.js`, `jobController.js`, `proposalController.js` → async/await Mongoose.
- `server/src/middleware/authenticate.js` → async + `asyncHandler`, inner try/catch preserving the `"Invalid or expired token"` message.
- `server/src/middleware/errorHandler.js` → map CastError-on-`_id`→404, CastError-other→400, ValidationError→400, key-derived 11000→409.
- `server/src/app.js` → CORS allow `http://localhost:5173` and `http://127.0.0.1:5173`.
- `server/src/routes/jobRoutes.js` → add all-optional `validate({...})` to `PUT /:id`.
- `server/package.json` → add `bcryptjs` dep + `seed` script.
- `server/src/config/env.js` → `mongoUri` in-code default changed to `mongodb://127.0.0.1:27017/talentbridge` (Review Finding 3).
- `server/.env.example` → `MONGO_URI` default; `server/.env` (new, gitignored); ensure `.gitignore` ignores `.env`.
- `server/src/seed.js` → new.

Backend — unchanged: `server.js`, `db.js`, `redis.js`, `cloudinary.js`, `swagger.js`, `routes/index.js`, `routes/authRoutes.js`, `middleware/authorize.js`, `validate.js`, `rateLimiter.js`, `notFound.js`, `utils/*`. (`routes/jobRoutes.js` and `config/env.js` are modified — see above.)

Frontend — all new under `client/` (commented): config files, `index.html`, `src/main.jsx`, `src/App.jsx`, `src/index.css`, `src/api/{client,auth,jobs,proposals}.js`, `src/context/AuthContext.jsx`, `src/components/{Navbar,Icons,ProtectedRoute,JobCard,FilterBar,...}.jsx`, `src/pages/{HomePage,JobsPage,JobDetailPage,LoginPage,RegisterPage,DashboardPage,NotFoundPage}.jsx`.

---

## Part 3 — Responses to design review

The review (`design-review.md`) raised 1 HIGH, 6 MEDIUM, and 3 NIT findings. All ten are **addressed**; none backlogged or ignored. Each change was verified against the real source (`asyncHandler.js`, `validate.js`, `errorHandler.js`, `jobRoutes.js`).

- **Finding 1 (HIGH) — `PUT /:id` body validation — ADDRESSED.** The Route layer section now adds an all-optional `validate({ title, description, budget, category })` to `PUT /:id` in `jobRoutes.js`, so a wrong-typed `budget` returns `400` (not a misleading `404`), and non-string `title`/`description`/`category` can no longer be silently coerced. The "`jobRoutes.js` unchanged" claim is corrected throughout (Route layer, files-summary, unchanged-list). Confirmed against `validate.js` that optional fields (no `required`) are skipped when `undefined`/`""`.
- **Finding 2 (MEDIUM) — broad CastError mapping — ADDRESSED.** The error-handling section now scopes the handler: `CastError` on `err.path === "_id"` → `404 "Job not found"`; `CastError` on any other path → `400 "Invalid value for <path>"`. The `404` message stays `"Job not found"` (AC7-aligned) and is accurate because jobs/job-scoped proposals are the only id-param resources.
- **Finding 3 (MEDIUM) — category not lowercased — ADDRESSED.** `listJobs` now lowercases the query param: `filter.category = String(category).toLowerCase()`, matching the schema's `lowercase: true` storage.
- **Finding 4 (MEDIUM) — duplicate proposals unspecified — ADDRESSED (decision stated).** Duplicate proposals are explicitly **allowed**: no `{ job, freelancer }` unique index, no `409` dedupe. Deduping is out of scope. This keeps `email` as the sole unique index.
- **Finding 5 (MEDIUM) — hardcoded 11000 message — ADDRESSED.** The `11000` branch now derives the field from `err.keyPattern` and only emits `"Email is already registered"` for the `email` key (else `"Duplicate value"`), decoupling the handler from a single index even though `email` is currently the only one.
- **Finding 6 (MEDIUM) — seed id capture — ADDRESSED.** The seed contract now destructures `User.create([...])`'s returned array and wires `client`/`job`/`freelancer` from each document's live `_id` (not the serialized `id`), with explicit code.
- **Finding 7 (MEDIUM) — asyncHandler drops custom 401 message — ADDRESSED.** `authenticate` keeps an inner `try/catch` around `jwt.verify` to preserve `"Invalid or expired token"`, while the outer `asyncHandler` forwards the `await User.findById` rejection. Verified `asyncHandler` is a `Promise.resolve(fn).catch(next)` wrapper, so the design's reasoning holds.
- **Finding 8 (NIT) — CORS loopback — ADDRESSED.** `http://127.0.0.1:5173` added to the CORS allow-list alongside `http://localhost:5173`.
- **Finding 9 (NIT) — confirm `toJSON` not `toObject` — ADDRESSED.** The User model now states the transform is configured via the `toJSON` schema option (so `res.json`/`JSON.stringify` invokes it), not `toObject`, enforcing the password strip on every path.
- **Finding 10 (NIT) — client return-shape — ADDRESSED.** `request()` now takes an explicit `raw` option: default returns `json.data`; `raw: true` returns the full envelope for list calls (`listJobs`, `listProposals`) that need `count/total/totalPages`.

---

## Part 4 — Responses to the second-pass design review

The second-pass review (`design-review.md` / `design-review.json`, verdict `CHANGES_REQUESTED`) raised 3 MEDIUM and 2 NIT findings. All five are **addressed**; none backlogged or ignored. Each choice aligns with the original requirements (single response envelope, ownership rules, reproducible MongoDB happy path, locked stack). Each was verified against the real source (`jobController.js`, `config/env.js`, `config/db.js`).

- **Finding 1 (MEDIUM) — `job.client` two serialized shapes — ADDRESSED.** The controller design now re-populates `client` after both `Job.create(...)` (createJob) and `job.save()` (updateJob) with `await job.populate("client", "name")`, and a new "Job `client` serialization shape — single contract" note states that `job.client` is **always** the populated `{ id, name }` object on `listJobs`, `getJob`, `createJob`, and `updateJob`. The frontend keys off that one shape everywhere (cards, detail, `user.id === job.client.id` ownership, and any mutation consuming a create/update response). This preserves the original single-envelope requirement rather than introducing per-endpoint shape branching.
- **Finding 2 (MEDIUM) — fragile ownership comparison — ADDRESSED.** The Invariant Ownership section now states one rule for all ownership-checking controllers (`updateJob`, `deleteJob`, `listProposalsForJob`): fetch WITHOUT populate **and** compare with the populate-independent form `String(job.client._id || job.client) !== req.user.id`. Each controller entry references this rule. A future accidental populate on these paths can no longer silently break the `403` ownership gate (which the original requirements mandate).
- **Finding 3 (MEDIUM) — MongoDB default only in gitignored `.env` — ADDRESSED (option a).** `config/env.js`'s in-code `mongoUri` default is changed from `""` to `"mongodb://127.0.0.1:27017/talentbridge"`, so a bare checkout connects to local MongoDB with no `.env` and the Mongoose models are actually exercised (the capstone's defining requirement). The `.env`/`.env.example` values now agree with the code default and exist for non-local overrides and documentation. The in-memory fallback in `db.js` is retained only as a deliberate safety net, reachable solely when a developer explicitly blanks `MONGO_URI`. `config/env.js` is moved from the unchanged list to the modified list in the files summary.
- **Finding 4 (NIT) — `createToken` and the `.id` virtual — ADDRESSED.** The `authController` section now states that `user.id` is the Mongoose `.id` virtual, always present on a saved/created document, and that `createToken` must be called on the live document, never on a `.toJSON()` result.
- **Finding 5 (NIT) — base-URL host-form vs CORS — ADDRESSED.** The Base URL integration note now instructs opening the app at `http://localhost:5173` (matching the hardcoded `localhost:4000` backend), documents `127.0.0.1:5173` as a CORS convenience fallback, and specifies a comment on the `client.js` base-URL constant noting the shared host-form expectation with the CORS allow-list.
