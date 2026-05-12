# 🛡️ Omniverse Technical Stealth & Anti-Detection Matrix

This document provides a technical breakdown of the **actual code implementation** and logical frameworks that govern campaign execution, account safety, and platform anti-detection within the Omniverse system.

---

## 1. 🌐 Network & IP Governance (`lib/proxy-allocator.js`)
The system treats IP addresses as "Sticky Trust Nodes." The logic enforces a strict isolation policy to prevent platform-level cross-contamination.

*   **The 1:1 Service Rule**: The `getAssignedProxy` function checks if a user already has an assigned proxy with capacity for the requested platform (`usage.${platform} < 1`). 
*   **Residential-First Allocation**: The allocator uses `findOneAndUpdate` with a filter for `type: 'residential'` to ensure accounts are anchored to high-reputation home IPs.
*   **IP Persistence**: Once assigned to a `userId`, the IP remains "sticky." This builds a historical trust score on platforms like Instagram and LinkedIn, as the login always originates from the same coordinate.

## 2. 🎭 Browser Stealth Architecture (`lib/social-automation/browser-manager.js`)
We use a high-fidelity browser engine designed to bypass modern bot-detection (Akamai, DataDome, PerimeterX).

*   **Stealth Inversion**: We utilize `playwright-extra` with `puppeteer-extra-plugin-stealth`. 
*   **Hard-Coded Headful**: Unlike basic scrapers, we explicitly run in `headless: false` mode. This ensures that visual signals (window resizing, frame rendering) are 100% authentic.
*   **Automation Scrubbing**: The system injects `--disable-blink-features=AutomationControlled` and removes the `navigator.webdriver` flag at the kernel level.
*   **Persistent Sandboxing**: Each account is localized to a unique directory in `.browser-profiles/` (`${platform}-${accountId}`). This preserves cookies, indexedDB, and cache, making every session a "continuation" rather than a "new login."

## 3. 🏃‍♂️ The `Humanoid` Behavioral Library (`lib/social-automation/browser-manager.js`)
The `Humanoid` object provides the core logic for simulating human interaction patterns.

*   **Curved Mouse Wandering (`mouseWander`)**: Instead of linear movements, the algorithm uses a mathematical curve (`Math.pow(progress, 0.8)`) with randomized jitter (`±60px`) and "reading pauses" (500ms–3000ms).
*   **Asynchronous Typing**: The `type` function implements a character-by-character delay of `50ms–150ms` plus a 5% chance of a "thinking" micro-pause (100ms–300ms).
*   **Staggered Scrolling**: Implements `window.scrollBy` with a random stop-point logic, preventing the "perfect scroll" signature.

## 4. 📅 Smart Scheduling & Velocity (`lib/social-automation/instagram-engine.js`)
The engine does not follow a predictable loop. It operates on "Macro-Sessions."

*   **Biological Cool-down**: After processing a batch of leads, the `Smart Scheduler` calculates a `nextSessionAt` time. It distributes the `dailyLimit` across a simulated 8-hour workday, applying a ±15-minute jitter to start times.
*   **Targeted Sessioning**: The system never finishes a list in one burst. It calculates `targetSessionLeads` dynamically (`Math.min(hourlyRemaining, randomizedPace)`), processing only a handful of contacts per session.
*   **Warmup Interleaving**: Using `executeWarmingAction`, the system performs random platform actions (scrolling Reels, Explore, or Home Feed) based on a probability-weighted CSV (`instagram-actions.csv`) before and between DM tasks.

## 5. 🤖 AI Linguistic "No-Bot" Guardrails (`lib/ai/gemini-engine.js`)
The AI Agent isn't just generating text; it's filtered through a strict "Spam-Warden" prompt.

*   **Hard-Blocked Buzzwords**: The system prompt explicitly forbids words like *Revolutionize, Deep Dive, Synergy, Unlock, Delve, Leverage, Optimize*.
*   **Complexity Cap**: Forced 5th-grade reading level and a strict **30-word limit** per reply to maintain conversational brevity.
*   **Relational Anchoring**: The AI is forced to use human "rapport-builders" like *Gotcha* and *Makes sense* to bypass the "AI-detector" gut feeling.
*   **Self-Archiving**: If the AI detects aggressive lead sentiment, it returns `[[AGENT_ARCHIVE_ACTION]]`, which triggers the system to archive the thread and protect the account's reputation.

## 6. 🩺 Safety Governor & Recon (`lib/safety/governor.js`)
*   **The 40% Rule**: If an account experiences a failure rate higher than 40% in a rolling 1-hour window, the `checkSafetyGovernor` logic automatically triggers a status update to `Paused` with the reason `High Failure Rate`. This prevents "brute-forcing" errors that lead to permanent bans.
