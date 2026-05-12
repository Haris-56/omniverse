# Omniverse Production Ready Copilot

This guide explains how to elevate the Omniverse project to a production-level platform across four key categories:
- Core Architecture
- Security
- Data & Persistence
- Browser Automation

Each section includes direct actions, implementation priorities, and readiness checkpoints.

---

## 1. Core Architecture — 100/100

### 1.1 Use a robust process architecture
- Separate the Next.js web server from worker processes.
- Run production workers under a process manager such as `PM2`, `systemd`, Docker Compose, or Kubernetes.
- Do not rely on `npm run dev` or single-process startup for production.

### 1.2 Split concerns clearly
- Keep API routes and UI separate. Your current `app/api` layer is good, but worker logic should not be coupled to the Next.js process.
- Move all long-running automation and queue workers into distinct service processes.
- Use a dedicated queue scheduler (`bullmq`) and worker process for LinkedIn, email, and other automation.

### 1.3 Improve deployability
- Add an `.env.example` describing required environment values:
  - `MONGODB_URI`
  - `MONGODB_DB`
  - `REDIS_URL`
  - `EMAIL`
  - `APP_PASS`
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `NODE_ENV`
  - `NEXT_PUBLIC_BETTER_AUTH_URL`
- Add a `Dockerfile` or `docker-compose.yml` for production if you deploy containers.
- Define a production startup command separate from `npm run dev`.

### 1.4 Health and monitoring
- Add liveness and readiness probes for the web server and worker processes.
- Instrument metrics for queue length, job success/failure, browser-worker uptime, MongoDB connection health, Redis connectivity.
- Log structured JSON output for indexing by ELK, Datadog, or other observability tools.

### 1.5 API stability and validation
- Add request validation in every route using a schema library (Zod, Joi, Yup).
- Return consistent API contracts and status codes.
- Centralize authorization checks and reuse common middleware helpers.

### Readiness checklist
- [ ] `app/api` routes validated and protected consistently
- [ ] Worker processes separated from web process
- [ ] Deployment manifest exists (`docker-compose.yml` / `Dockerfile` / k8s manifests)
- [ ] Production env variables documented / versioned
- [ ] Health endpoints and monitoring enabled

---

## 2. Security — 100/100

### 2.1 Harden authentication
- Remove hardcoded recipients and code-output logging from the system 2FA flow.
- Use cryptographically secure token generation. Example:
  - `crypto.randomUUID()` or `crypto.randomBytes(32).toString('hex')`
- Store only hashed or ephemeral tokens where possible.
- Use `httpOnly`, `secure`, and `sameSite='strict'` on all auth cookies.

### 2.2 Lock down Better-Auth
- Restrict `trustedOrigins` to exact production domains.
- Make sure `NEXT_PUBLIC_BETTER_AUTH_URL` maps to your deployed app origin only.
- Enforce `NODE_ENV === 'production'` behavior for security flags.

### 2.3 Protect administrative access
- Implement true MFA or a second factor for system admin login.
- Do not allow a weak random string as the only session token.
- Include a session revocation mechanism.

### 2.4 Prevent brute force and abuse
- Add rate limiting to auth endpoints and sensitive admin routes.
- Add account and IP throttling for login attempts.
- Add lockouts or exponential backoff for repeated failures.

### 2.5 Sanitize and validate all inputs
- Validate request JSON before using it.
- Sanitize query and body fields used to generate DB queries.
- Use object validation before processing `ObjectId`, `email`, and campaign data.

### 2.6 Secure secret storage
- Keep all secrets out of source code.
- Use a secret manager or environment injection in production.
- Never commit `.env` files to source control.

### Readiness checklist
- [ ] No hardcoded SMTP target or verification secrets
- [ ] Auth cookies are secure and same-site protected
- [ ] Rate limiting exists on auth and admin routes
- [ ] Input validation covers all API routes
- [ ] Secrets are documented and stored externally

---

## 3. Data & Persistence — 100/100

### 3.1 Use reliable MongoDB practices
- Ensure `lib/mongodb.js` connects once and reuses the client.
- Add connection error handling and retry logic for production.
- Use strong indexes on frequently queried fields:
  - `user.email`
  - `user.role`
  - `system_sessions.token`
  - `linkedin_campaigns.status`
  - `contacts.listId`
  - `verification_codes.email`

### 3.2 Design data consistency and recoverability
- Use explicit status fields for campaigns and worker jobs.
- Keep event logs or audit trails for state transitions.
- Avoid implicit behavior based on document shape alone.

### 3.3 Plan management and limit enforcement
- Make plan limit rules explicit in a shared source of truth.
- Cache plan configuration if it is read frequently.
- Use atomic updates where counts are consumed.

### 3.4 Backup and restore
- Define MongoDB backup policies for production data.
- Add a recovery plan for corrupted or missing campaign data.
- Ensure audit logs and system session tables are included in backups.

### 3.5 Redis / queue persistence
- Ensure Redis is deployed in a production-ready mode with persistence/replication.
- Use BullMQ job retention policies intentionally.
- Monitor queue dead-letter or failed job counts.

### Readiness checklist
- [ ] MongoDB connectivity robust and retried
- [ ] Proper DB indexes present for core queries
- [ ] Systems use clear state transitions and logs
- [ ] Redis persistence and queue monitoring enabled
- [ ] Backup and restore process documented

---

## 4. Browser Automation — 100/100

This is the most important category for Omniverse. Browser automation must be stable, safe, and recoverable.

### 4.1 Separate automation from edge cases
- Keep browser orchestration in dedicated services, not in API routes.
- Use worker processes that can pause, retry, and recover from browser-level errors.

### 4.2 Harden Playwright / Puppeteer usage
- Avoid using `headless: false` in production unless you explicitly need it.
- Use well-configured browser profiles and persistent contexts when appropriate.
- Keep stealth and anti-bot techniques current, but do not rely on a single method.

### 4.3 Implement recoverable browser sessions
- Detect login or account disconnect early and reauthenticate.
- Track browser health per account and rotate accounts when stale.
- Gracefully close or recycle browser contexts after failures.

### 4.4 Add safety governors
- Enforce rate limits at the automation layer, separate from plan limits.
- Use per-account action limits, daily caps, and cooldowns.
- Stop automation when global kill switch is active.

### 4.5 Improve action reliability
- Replace simulated pseudo-actions with explicit DOM interaction checks.
- Validate successful events before marking progress in the database.
- Add fallback if element selectors change or page structure changes.

### 4.6 Instrument browser actions
- Log browser action metadata as structured events.
- Track success/failure rates per campaign, account, and action type.
- Surface browser worker health in the admin dashboard.

### 4.7 Respect platform safety and compliance
- Verify whether automation flows are allowed by target platform terms of service.
- If necessary, move to an API-driven automation approach rather than browser scraping.
- Use proxy management ethically, and avoid returning to the same accounts too quickly.

### Readiness checklist
- [ ] Browser workers can recover from navigation or login failures
- [ ] Automation is rate-limited and safe by design
- [ ] Action results are verified before DB state advances
- [ ] Worker health is monitored and metrics emitted
- [ ] Compliance risk assessed and documented

---

## Implementation Plan

### Phase 1: Stabilize architecture
1. Create `Dockerfile` / `docker-compose.yml` for web + workers + Redis + MongoDB.
2. Separate worker startup from web startup.
3. Add health endpoints for web and worker processes.

### Phase 2: Harden security
1. Refactor admin 2FA to use secure tokens and remove console logging.
2. Lock down origins and cookies.
3. Add rate limiting to auth and system admin routes.
4. Add validation schemas for all API payloads.

### Phase 3: Harden persistence
1. Add indexes and connection retry logic.
2. Document backup and restore.
3. Add queue monitoring and Redis persistence configuration.

### Phase 4: Harden browser automation
1. Add retry and recovery logic in `lib/queue/linkedin-worker.js`.
2. Improve page interaction verification.
3. Add action-level logging and safety governor metrics.
4. Evaluate ethical risk and adjust automation scope.

---

## Final note
To reach 100/100, transform these recommendations into a repeatable, monitored production deployment. That means:
- architecture separation,
- secure auth,
- durable persistence,
- robust automation,
- and operational observability.

This file is your `copilot` guide to make `Omniverse` ready for production.
