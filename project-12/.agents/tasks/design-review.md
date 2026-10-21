# Design Review — TalentBridge MERN Capstone (project-12)

Reviewed: `/Users/gfg19722-laptop/Desktop/mern-cohort-projects/project-12/.agents/tasks/design.md`
Scope: upgrade the in-memory Express API in `project-12/server` to MongoDB/Mongoose + bcrypt + JWT, and build a Vite + React frontend in `project-12/client`.

This is a fresh, source-verified review. The design has already been through two prior review passes (Parts 3 and 4). Those prior findings were re-verified against the real source and are genuinely resolved; this review does not re-litigate them. The findings below are issues that remain or that the prior passes did not surface.

Verification method: every claim about existing behavior was checked against the actual files in `project-12/server/src` and the project-9 frontend toolchain. See the Verified / Unverified sections at the end.

---

## Findings

### 1. MEDIUM — Dashboard "client's posted jobs" has no backend query path

Location: Part 2, "Pages & data flow (React Query)" → `DashboardPage`; and "jobController.js" → `listJobs`.

The dashboard client view is specified as "their posted jobs (filter `listJobs` client-side or show a 'my jobs' section)". But `listJobs` is defined with filters for `category`, `search`, `minBudget`, `maxBudget` only — there is no `client`/`owner`/`mine` filter, and the endpoint is paginated with a default `limit=10`. "Filter `listJobs` client-side" therefore only sees the first page of all jobs across all clients, so a client with jobs outside page 1 (or beyond the fetched limit) will see an incomplete or empty "my jobs" list. This is a functional gap for FR19, not a styling detail.

Concrete fix (pick one and specify it in the design):

- Add an owner filter to `listJobs`: accept `?client=<id>` (or a `?mine=true` flag resolved from `req.user.id` when authenticated) and add `filter.client = <id>` to the Mongo query. Dashboard calls `listJobs({ client: user.id, limit: 100 })`.
- Or add a dedicated `GET /api/jobs/mine` (authenticated, role `client`) returning the caller's jobs.

Either way, state the exact query/route, its auth, and that the dashboard uses it instead of client-side filtering.

### 2. MEDIUM — Dashboard "freelancer's submitted proposals" has no backend endpoint

Location: Part 2, "Pages & data flow (React Query)" → `DashboardPage` freelancer view; and the API contract table.

The freelancer dashboard view is specified as showing "their submitted proposals summary." The only proposal-read endpoint in the design is `GET /api/jobs/:jobId/proposals`, which is gated to the owning **client** (`authorize("client")` + ownership check). There is no endpoint a freelancer can call to retrieve the proposals they submitted, so the promised freelancer dashboard content cannot be built against the specified API.

Concrete fix (pick one):

- Drop the promise: change the freelancer dashboard spec to "a prompt to browse jobs" only, and remove "their submitted proposals summary" so the design matches the API surface. (Out of Scope already excludes an accept/reject workflow; this keeps proposal-reading client-only.)
- Or add `GET /api/proposals/mine` (authenticated, role `freelancer`) returning `Proposal.find({ freelancer: req.user.id }).populate("job", "title budget")`, and add it to the contract table, routes, controller, and error-handling sections.

Choose explicitly; today the design states a feature it cannot deliver.

### 3. MEDIUM — `GET /api/jobs/:jobId/proposals` ownership check contradicts itself across sections

Location: Part 2, "proposalController.js" → `listProposalsForJob`, vs "Invariant ownership" ownership rule.

The existing controller (verified in source) guards with `if (req.user.role === "client" && job.clientId !== req.user.id)`. The route already forces `authorize("client")`, so the `role === "client"` sub-condition is always true there. The design's `listProposalsForJob` text says to enforce `String(job.client._id || job.client) !== req.user.id` (dropping the role sub-check), which is correct given the route gate. But the "Invariant ownership" section lists `listProposalsForJob` among controllers that "MUST ... compare with the populate-independent form" and also says the route "already restricts to `authorize('client')`" — consistent — yet the current source still carries the redundant `role === "client" &&` clause, and the design never says to remove it. An implementer copying the existing code forward will keep a dead sub-condition that masks intent, and a future reader cannot tell whether the role check is load-bearing.

Concrete fix: state explicitly that `listProposalsForJob` drops the `req.user.role === "client" &&` prefix and uses exactly `if (String(job.client._id || job.client) !== req.user.id) throw ApiError.forbidden(...)`, relying on the route's `authorize("client")` for the role gate. One line in the controller section removes the ambiguity.

### 4. MEDIUM — Proposal create/list serialization shape is unspecified (parallel gap to the job.client contract)

Location: Part 2, "proposalController.js" → `createProposal` and `listProposalsForJob`; frontend `JobDetailPage`.

The design added a precise "single contract" for `job.client` (always populated `{ id, name }`), which is good. It does not give the same treatment to proposals. `createProposal` returns the raw created document, so `proposal.job` and `proposal.freelancer` are bare ObjectId strings; `listProposalsForJob` returns proposals with `freelancer` populated as `{ id, name, email }` but `job` left as a bare ObjectId. So `proposal.freelancer` is sometimes a string (create response) and sometimes an object (list response), mirroring exactly the `job.client` problem that Finding 1 of the prior pass flagged for jobs. The design states the freelancer flow "invalidates queries" rather than consuming the create response, which avoids the bug in the happy path, but the shape contract is still undefined and the next implementer has nothing to key off.

Concrete fix: add a one-paragraph "Proposal serialization shape" contract mirroring the job one. Minimum: state that `proposal.freelancer` is a populated `{ id, name, email }` on `listProposalsForJob`; that `createProposal`'s response is consumed only for success acknowledgement (its `job`/`freelancer` remain bare ids) and no UI reads them; and whether `proposal.job` is ever populated. If any UI will read the create response's `freelancer`/`job`, re-populate after `Proposal.create` the same way `createJob` does.

### 5. NIT — Swagger produces an empty paths spec and the design claims "docs remain available"

Location: FR15 / AC: "Swagger docs remain available at `/api/docs`"; verified `swagger.js` scans `apis: ["./src/routes/*.js"]` for JSDoc.

The route files carry no OpenAPI JSDoc annotations (verified), so the generated spec has `info`/`tags`/`servers` but zero documented `paths`. `/api/docs` loads but lists no operations. This is pre-existing behavior, not a regression, and FR15 only asks that docs "remain available," which they do. Still, the design implies working API docs for the capstone; a reader may expect populated endpoints.

Concrete fix: either state plainly that `/api/docs` renders the shell spec with no documented paths (annotations are out of scope), or add minimal `@openapi` JSDoc blocks to the route files. Since the backend is comment-free by rule (NFR2), note that Swagger JSDoc annotations are the one allowed exception — or explicitly accept the empty paths list.

### 6. NIT — `createProposal` does not re-check that the job's proposals are visible to the freelancer; duplicate-allow decision is fine but undocumented in the contract table

Location: Part 2, "proposalController.js" → `createProposal`; API contract table.

The decision to allow duplicate proposals (no unique index, no 409) is reasonable and consistent with the ACs. It is stated in prose but the contract table row for `POST /api/jobs/:jobId/proposals` does not mention that repeated submissions succeed. A reader scanning the table alone could assume idempotency.

Concrete fix: add a short note on the proposal POST row or beneath the table: "Duplicate proposals by the same freelancer to the same job are permitted (each returns 201)."

---

## Verdict

HIGH: 0
MEDIUM: 4 (Findings 1, 2, 3, 4)
NIT: 2 (Findings 5, 6)

MEDIUM count > 0 → **CHANGES_REQUESTED**.

The backend upgrade (Mongoose models, async controllers, `toJSON` password strip, error-handler branches, env default, CORS, seed, `PUT` validation) is well specified and source-accurate. The blocking issues are all on the frontend-to-backend contract for the dashboard: two dashboard views promise data the specified API cannot return (Findings 1, 2), one ownership check is self-inconsistent across sections (Finding 3), and proposal serialization lacks the same shape contract the design correctly gave jobs (Finding 4). Each has a concrete, low-effort fix.

---

## Verified Assumptions

These design claims were checked against the actual source and are correct:

- `asyncHandler` is `(fn) => (req,res,next) => Promise.resolve(fn(...)).catch(next)` — forwards the raw thrown error. The design's reasoning for keeping an inner `try/catch` in `authenticate` to preserve the `"Invalid or expired token"` message is valid. (`src/utils/asyncHandler.js`)
- `validate` skips any field whose value is `undefined` or `""` when `required` is not set, so the proposed all-optional `PUT /:id` validation type-checks only fields the client actually sends. (`src/middleware/validate.js`)
- `jobRoutes.js` `PUT /:id` currently has **no** `validate(...)` — the design's "add validation to PUT" change is real and needed; the prior "jobRoutes unchanged" claim was correctly retracted. (`src/routes/jobRoutes.js`)
- `errorHandler.js` currently has only the `ApiError`/500 branch and no Mongoose (`CastError`/`ValidationError`/`11000`) handling — the design's additions are genuinely new. (`src/middleware/errorHandler.js`)
- `email` is the only field that would carry a unique index; the in-memory models have no proposal uniqueness. The key-derived `11000` handler reasoning holds. (`src/models/*.js`)
- `config/env.js` `mongoUri` default is currently `""`, and `config/db.js` falls to the in-memory warning path when it is blank — confirming the Finding 3 reproducibility concern and the fix of baking in `mongodb://127.0.0.1:27017/talentbridge`. (`src/config/env.js`, `src/config/db.js`)
- `.env.example` currently sets `MONGO_URI=` (blank) with a comment about in-memory mode — matches the design's description of the change. (`server/.env.example`)
- `app.js` currently uses bare `app.use(cors())` — the design's replacement with an explicit origin allow-list is a real change. (`src/app.js`)
- `authorize("client")` / `authorize("freelancer")` route gates exist on the proposal and job mutation routes exactly as the design assumes. (`src/routes/jobRoutes.js`)
- The in-memory field names are `clientId`, `jobId`, `freelancerId` — the design's rename to `client`/`job`/`freelancer` and downstream propagation is accurate. (`src/models/*.js`, `src/controllers/*.js`)
- `package.json` has `mongoose@^8` already and lacks any bcrypt dependency and any `seed` script — the design's "add `bcryptjs` + seed script" is correct. (`server/package.json`)
- Project-9 toolchain matches the "copy from project-9" claims: Tailwind `^3.4.4`, React `^18.3.1`, Vite `^5`, `@vitejs/plugin-react`, the indigo `brand` palette (50/100/500/600/700), Inter font, `card` shadow, `fade-up` animation, `content: ["./index.html","./src/**/*.{js,jsx}"]`. Project-9 also already depends on `@tanstack/react-query@^5` but **not** `react-router-dom` (it uses Redux), so the design's "add react-router, drop Redux" is accurate. (`project-9/tailwind.config.js`, `project-9/package.json`)

## Unverified / Wrong Assumptions

- No design claim was found to be factually wrong against the source. The issues above are gaps and internal inconsistencies, not misreadings of existing code.
- Not verifiable from the repo (external/runtime, acceptable to leave to implementation): that a local `mongod` is actually running at `127.0.0.1:27017` (the design correctly treats a connection failure as fatal at startup); that `bcryptjs@^2.4.3` installs cleanly; that Vite's dev server binds `5173`. These are environment facts, not design defects.
- `createProposal` returning a non-populated `freelancer`/`job` is asserted as safe because "the frontend invalidates queries rather than reading the create response." This is plausible from the design text but depends on frontend code not yet written — flagged as Finding 4 so the contract is pinned before implementation rather than assumed.
