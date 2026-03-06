# 🛡️ Omniverse: Multi-Tenant & Multi-Channel Governance Architecture

This document explains how the Omniverse engine manages resources, IP assignments, and rate limits when multiple users are running campaigns across different platforms simultaneously.

---

## 🏗️ 1. The Scenario: Parallel Load
*   **User A**: 1 IG, 2 FB, 1 LinkedIn, 2 Email Mailboxes. (Active: 09:00 - 18:00)
*   **User B**: 1 IG, 1 FB, 1 Email Mailbox. (Active: 10:00 - 19:00)

---

## 🛠️ 2. Architectural Handling: The "State Machine" Engine

### A. The "Wait" Logic (nextRunAt)
Every individual campaign for every user has its own `nextRunAt` timestamp in the database. 
*   **User A's IG** might be scheduled for `14:00:22.456`.
*   **User B's IG** might be scheduled for `14:00:25.123`.
The **Scheduler (Watchdog)** checks the entire database every 30-60 seconds. It looks at *every* campaign from *every* user. If `now > nextRunAt`, it drops a "Sending Token" into the BullMQ global queue.

### B. Global Rate Limiting (The Governor)
Before a worker actually executes a send (IG/FB/Email), it passes through the **Safety Governor**:
1.  **Account Lock**: It checks if that specific account (e.g., User A's FB) has already sent an email in the last X seconds.
2.  **Hourly Cap**: It counts logs for that specific `accountId` in the last hour. If the limit (e.g., 10/hour) is reached, it ignores the send and updates `nextRunAt` to 1 hour from now.
3.  **Platform Safety**: IG/FB have much stricter cooldowns than Email. The Governor enforces these platform-specific cooldowns globally across all users.

---

## 🌐 3. Smart IP & Proxy Governance

This is the most critical part of the system for maintaining account health on DigitalOcean.

### A. The 1000/day Hard Cap
The system maintains a pool of `system_proxies`. When User A's email campaign triggers:
1.  The worker counts **TOTAL** sends across the **ENTIRE SYSTEM** (User A + User B + anyone else) using that specific Proxy IP since midnight UTC.
2.  If Proxy IP `1.2.3.4` has sent 999 emails today, the worker **REJECTS** it and automatically requests Proxy IP `5.6.7.8`.
3.  This prevents any single IP from ever hitting the "SPAM" trigger thresholds of major providers (Google/Outlook).

### B. Sticky Proxy logic
*   If User A is using Proxy X for their Campaign, the system tries to keep using Proxy X for that campaign until its 1,000 limit is reached. 
*   This "stickiness" simulates a human being logging in from the same office IP every day.

---

## ⏱️ 4. Overlapping Hours & Resource Competition

When both User A and User B are sending at 11:00 AM:
1.  **Worker Concurrency**: The Dockerized Worker is set to `concurrency: 5` (expandable). This means it can process 5 different campaign sends simultaneously across different users.
2.  **Round-Robin Fairness**: The engine processes campaigns in the order they became "due". No user can "hog" the engine because each send must wait for its **Randomized Fractional Delay** (e.g., 46.656s) before it is allowed back into the queue.
3.  **Conflict Resolution**: If User A and User B both try to use the *same* Sender Account (e.g., a shared corporate mailbox), the Database Lock prevents them from sending at the exact same millisecond.

---

## 🔒 5. Error Handling & Stability

*   **Proxy Failure**: If a proxy times out, the worker logs the error, increments a "fail count" for that proxy, and waits 5 minutes before trying again with a *different* proxy.
*   **Platform Blocks**: If Instagram blocks an account, the worker detects the "Checkpoint" error, sets the campaign to **Paused**, and notifies the user. It does *not* keep trying, which would get the account permanently banned.
*   **Docker Isolation**: By running in Docker, if User A's complex FB automation crashes the process, Docker instantly restarts it without affecting User B's Email sending.

---

## 📈 6. Summary for the User

| Feature | Technical Benefit | Business Benefit |
| :--- | :--- | :--- |
| **nextRunAt Sync** | Deterministic state management | Zero overlapping/bursting emails |
| **Proxy Governance** | IP usage tracking (<1000/day) | Keeps your IPs clean and off blacklists |
| **Fractional Delays** | Millisecond precision | Invisible to anti-bot filters |
| **Docker Compose** | Process isolation | High stability and easy scaling |
