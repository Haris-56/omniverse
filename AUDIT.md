# Omniverse Project Audit

## Summary
This project is a hybrid Next.js application with an automated social outreach platform running alongside system administration and worker orchestration. It combines:

- Next.js 16 App Router and React 19 frontend UI
- MongoDB native driver for persistence
- Better-Auth for user authentication
- Redis + BullMQ for LinkedIn queue processing
- Social automation using Playwright / Puppeteer stealth patterns
- System admin module with a separate 2FA-style session flow

Overall system rating: **72 / 100**

Production readiness: **Not production ready yet**. The architecture is promising, but there are several security, reliability, and maintainability gaps that should be fixed before safe deployment.

---

## Architecture Overview

### Frontend
- Uses `app/layout.js` + App Router pages under `app/`
- Visual components rely on Tailwind CSS 4 and `lucide-react`
- There is a dedicated system admin UI under `/system`
- `app/system/layout.js` secures system admin pages with a `system_admin_token` cookie and MongoDB session lookup
- Authentication client uses `better-auth/react` in `lib/auth-client.js`

### Backend
- API routes are implemented under `app/api/`
- Common MongoDB connection helper is `lib/mongodb.js`
- `lib/auth.js` configures Better-Auth with MongoDB adapter and trusted origins
- Route protection is enforced using `auth.api.getSession` plus custom checks for system-level endpoints
- Plan limits, campaign limits and safety guards are handled in utilities like `lib/limits.js`

### Automation Workers
- `social-worker.js` is the autonomous social worker loop for Facebook, Instagram, and Nexus flows
- LinkedIn automation is queue-based via `lib/queue/linkedin-worker.js` using BullMQ and Redis
- Redis connection is configured in `lib/queue/redis.js`
- `background-worker.js` orchestrates scheduler, worker, and social worker processes
- There are additional worker programs such as `system-recon-worker.js`, `test-ig-worker.js`, and `test-ig.js`

### Data & Persistence
- MongoDB is the primary datastore
- collections visible in code: `user`, `system_sessions`, `verification_codes`, `linkedin_campaigns`, `linkedin_accounts`, `linkedin_progress`, `linkedin_logs`, `contacts`, `email_campaigns`, `facebook_campaigns`, `system_plans`, `email_accounts`
- `lib/limits.js` enforces plan-based limits via DB queries

## Key Strengths

- Clear separation of frontend, backend API, system admin, and workers
- Integration of queue architecture for LinkedIn automation shows good scaling intent
- MongoDB connection reuse via global `clientPromise` is correct for serverless environments
- System module uses server-side auth gating inside layout rather than purely client-side
- Automation design includes safety checks, daily limits, time windows, and kill-switch concepts
- Documentation exists in `app/system/README.md`, `stealthnessdetails.md`, and various `app/documentation/*` pages

## Main Issues and Risks

### Security
- `app/api/system/auth/send-code/route.js` hardcodes a destination email address and logs verification codes to console. This is unsafe for production.
- The system admin 2FA flow stores a random token in `system_sessions` and uses a cookie, but the token generation is not cryptographically strong.
- `better-auth` trusted origins include a public domain plus localhost. This should be scoped tightly to real deployment URLs.
- There is no visible rate limiting or brute-force protection around auth endpoints beyond plan checks.
- `send-code` uses plaintext SMTP credentials via `process.env.EMAIL` / `APP_PASS` and does not fallback to secure email delivery.

### Reliability
- `social-worker.js` reconnects every tick and uses `setTimeout` with random intervals; this is fine for research but may be inefficient for production under load.
- LinkedIn worker relies on page navigation and simulated actions but lacks robust browser error recovery around actual action execution.
- There is no explicit Redis connection failover or queue health checks in `lib/queue/redis.js`.
- Worker error handling exists, but the failover strategy is simple requeue or delay; long-term failures may stall campaigns.

### Maintainability
- There are many standalone worker scripts outside the main app folder, making deployment orchestration more complex.
- Some automation code comments indicate incomplete implementation or placeholders (e.g. simulated follow-up logic).
- The project lacks an `.env.example`, making environment setup less discoverable.
- `package.json` includes dev dependencies and runtime packages without a strict lockfile visible here.

### Compliance / Operational
- Using `playwright-extra` and `puppeteer-extra-plugin-stealth` for social platform automation carries legal and compliance risk for social media platforms.
- The app relies on `next dev` plus an external node social worker in `npm run dev`; production deployment needs careful process management.
- `next.config.mjs` exposes external packages required by server components, which is correct but may need environment-specific configuration.

## Category Ratings

| Category | Score | Notes |
|---|---|---|
| Core Architecture | 80/100 | Strong modular layout, good use of API routes and server-side auth. |
| Security | 60/100 | Basic auth flow exists, but hardcoded 2FA email, console logging of codes, and weak token handling are red flags. |
| Automation System | 75/100 | Good use of queues and worker orchestration, but actual browser automation is brittle and not fully hardened. |
| Data & Persistence | 70/100 | MongoDB use is consistent, but plan limit queries and auth data handling need refinement and indexing review. |
| Documentation | 78/100 | There is helpful internal documentation, but it reads more like feature notes than a deployable runbook. |

## Production Readiness Verdict

Not production ready.

Major blockers:

1. Security: 2FA/email flow is not safe for production and should be redesigned.
2. Worker reliability: automation workers need stronger failure recovery and queue monitoring.
3. Deployment: there is no dedicated production deployment strategy or process supervisor defined in code.
4. Compliance: social automation approach requires legal review and platform-safe workflows.

If this project is intended to run in a controlled lab environment or internal prototype, it is close. For an external SaaS deployment, I recommend addressing the above issues first.

## Recommended Improvements

- Remove hardcoded system email recipient and console-code logging from 2FA.
- Use secure token generation for `system_sessions` (e.g. `crypto.randomUUID()` / HMAC).
- Add rate limiting and brute-force protection around auth endpoints.
- Introduce a process manager for workers (`PM2`, Docker Compose or Kubernetes CronJobs/Deployments).
- Add a Redis health check and queue monitoring dashboard.
- Add `.env.example` and document required environment variables clearly.
- Harden browser automation with explicit failure cases and more deterministic action execution.
- Validate all incoming JSON payloads and sanitize query parameters in API routes.

## Note
This audit is based on the code visible under `d:\Desktop\FYP\frontend\omniverse` and intentionally avoids modifying any existing project files.
