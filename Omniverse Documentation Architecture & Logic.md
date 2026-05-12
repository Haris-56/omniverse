# **📑 Module 01: Auth & Guardian — Functional Specification**

## **1.1 Identity & Access Management**

The system acts as a high-security gatekeeper, ensuring only vetted users can access the automation infrastructure.

### **🔐 Entry Protocols**

* **Dual-Entry Access:** The system must allow users to enter via standard email/password or via a one-click social authentication (Google).  
* **Identity Merging:** If a user registers with an email and later attempts to enter via the social provider using that same email, the system must recognize them as the same entity and link the sessions.  
* **Validation Checkpoint:** Upon entry, the system must verify the user's status. If the user is unverified or has not completed the security handshake, all internal tools must remain inaccessible.

### **🛡️ Guardian Logic (Security Enforcement)**

* **Geographic & Hardware Tracking:** The system must record the IP address and a unique hardware identifier for every session.  
* **Sybil Prevention (Multi-Account Detection):** The system must automatically flag accounts created on the same hardware profile. If "User A" and "User B" share a device, the system notifies the administrator and restricts their ability to launch campaigns until manually cleared.  
* **Session Verification:** Every new entry requires a unique, time-sensitive code sent to the user's inbox to prove ownership of the communication channel.  
* **Recovery Protocol:** A self-service recovery system must allow users to regain access if they lose their credentials, involving a secure identity check via their registered email.

---

## **1.2 The Onboarding & Approval Pipeline**

Access to the "Omniverse" is not immediate; it follows a strict "Survey-then-Vetting" model.

### **📝 Strategic Intake**

* **Profile Survey:** New users must complete a multi-step interview regarding their intended outreach channels, business goals, and target industry.  
* **Selection Skip:** Users may skip these questions, but doing so triggers an automated alert and restricts them to a "Restricted Support" state.  
* **Plan Commitment:** Users must select a plan during onboarding. If no plan is selected, the system defaults them to a **$0 Restricted Plan**.

### **⛓️ The Lockdown State**

* **Administrative Hold:** By default, all new accounts are born in a "Locked" state. In this state:  
  * Social accounts cannot be connected.  
  * Campaigns cannot be drafted or launched.  
  * A persistent notification directs the user to contact support for "Node Activation."  
* **Promotion Logic:** Only an explicit action from the System Administrator can move a user from "Locked" to "Active."

---

## **1.3 System Notifications & Feedback**

* **Internal Alerts:** The system must provide real-time feedback on the user's status (e.g., "Account Pending Approval" or "Device Flagged for Review").  
* **Redirect Logic:** Any attempt by an unauthenticated or unauthorized user to access deep-links (like /instagram or /campaign-builder) must result in a graceful kick-back to the entry gate.

---

## **🛠️ System Responsibilities Added**

1. **Integrity Monitoring:** The system is responsible for constantly checking if the user's current session matches their security profile (IP/Device).  
2. **State Management:** The system must maintain a "Read-Only" environment for users who haven't paid or haven't been approved, ensuring zero server resources are wasted on unauthorized outreach.

# **📑 Module 02: Lead Engine (/my-people) — Functional Specification**

## **2.1 Neural Data Ingestion (Upload Logic)**

The system serves as a central repository for "Prospect Fragments." It must handle data intake with strict adherence to account limitations.

### **📥 The "Mass Ingest" Protocol**

* **Segmented Uploads:** Users can initiate a new "List" from the main dashboard or append "Single/File" entries into an existing list.  
* **Variable Schema Mapping:** Upon uploading a CSV, the system must trigger a mapping interface. The user must manually align their CSV headers to the Omniverse internal variables:  
  * *Primary Nodes:* Full Name, First Name, Email, Instagram Handle, LinkedIn URL, Facebook Profile.  
  * *Context Nodes:* Company, Position, Location, Website.  
* **Selective Ingestion:** Only columns mapped by the user are imported. All unmapped data "fragments" are discarded to maintain database leaness and performance.

### **🛡️ Ingestion Constraints (Plan-Based)**

The system must dynamically enforce boundaries based on the user’s assigned tier:

* **Volume Throttling:** Every upload request must cross-check the user's plan for:  
  1. **Max Rows per List:** Limit on the size of a single CSV/upload.  
  2. **Total Database Capacity:** A hard cap on the total number of contacts across all lists combined.  
  3. **List Count:** The maximum number of separate "Folders/Lists" allowed.  
* **Exceedance Handling:** If an upload exceeds the plan limit, the system must truncate the data at the limit and notify the user to upgrade to "Inject" the remaining rows.

---

## **2.2 Data Management & Lead Refinement**

Once ingested, the data must be editable and searchable to prepare for the AI Outreach modules.

### **📂 List Dynamics**

* **Stateful List View:** Inside a specific list (e.g., yyhhh), the system must display the "People Count" and "List Integrity" status.  
* **Granular Editing:** Users must be able to click any lead to modify specific variables (e.g., correcting a misspelled company name) or delete individual nodes.  
* **Dynamic Variable Highlighting:** Any entry missing a "Critical Node" required for a specific campaign (like a missing Instagram handle for an IG campaign) should be visually flagged.

---

## **2.3 System Responsibilities (Logic Rules)**

1. **Duplicate Protection:** The system should identify duplicate email addresses or social handles within the same list to prevent redundant outreach.  
2. **Mapping Persistence:** The system should remember the user's previous CSV mapping preferences to speed up future "Mass Ingest" sessions.  
3. **Global Search:** A high-speed filter across all lists to find a specific person or company across the entire "Omniverse" database.

# **📑 Module 03: Instagram Outreach — Functional Specification**

## **3.1 Account Node Lifecycle**

The system manages the connection integrity of the Instagram accounts used for outreach.

### **🔗 Initial Provisioning (Add Account)**

* **The "Link Node" Interface:** To add an account, the user must provide:  
  1. Standard Credentials (mobilenumber/Handle/Email \+Password).  
  2. A **Session Fragment (JSON Cookies).**  
* **Instant Validation Loop:** Upon submission, the system initiates an immediate foreground Playwright session using the provided cookies. The user must remain on the provisioning page.  
  1. *Scenario A (Active Session):* Playwright detects an active, logged-in state. The account is marked "Verified."  
  2. *Scenario B (2FA Trigger):* If the session requires verification, the system must render the Instagram 2FA challenge input directly into the Omniverse UI. The user enters the code, and Playwright attempts to finalize the session.  
* **IP Allocation Logic:** Every account provisioning must include an IP address determination.  
  1. **System-Provided:** Unless otherwise specified, the system allocates a fresh, dedicated proxy IP from its internal pool.  
  2. **Custom IP:** Users on qualified plans may enter their own proxy credentials.  
  3. **No Proxy:** The system must strictly block the provisioning of any account without a unique IP, unless the user’s plan has been manually whitelisted by an Administrator for "Proxy-less Operations." The system enforces a hard limit: **One (1) Unique IP \= One (1) Unique Instagram Account.**

### **🩺 Integrity Monitoring**

* **Continuous Vetting:** The "Verified Dashboard" view must continuously poll the real-time status of the connection.  
* **Proactive Vetting (Session Lock):** To resolve the "repeated login" failure, once a session is established and the auth\_state (cookies/tokens) is stored, subsequent automation cycles must inject this state. Playwright must *never* hit the login page /accounts/login/ if an auth\_state exists.

---

## **3.2 Campaign Architect (Plan Creation)**

The "Create Instagram Plan" view is where the user defines the operational parameters of their AI Agent.

### **⚙️ Campaign Settings & AI Selection**

* **Target Audience Selection:** The user selects a specific list ingested via Module 02\.  
* **AI Agent Selection:** The user assigns an AI Agent to the campaign (trained/configured in Module 05).  
* **Automatic Replies:** The user configures keyword-based triggers for the agent (e.g., If prospect says "price," AI Agent responds with Template X).

### **📬 Action & Content Protocol**

* **Dynamic Variable Injection:** In the message body, users can inject variables like {{firstName}}.  
* **Validation Check:** The system must visually flag and prevent the launch of any campaign using non-existent variables (e.g., {{last\_name}} used when only fullName was mapped).  
* **Content Restrictions:** The first message in any automated outreach campaign **must not contain links.** The system must parse the script and block activation if a link is detected. Initial messaging is restricted to text and must not include voice notes or photos.

---

## **3.3 The Human Mimicry Algorithm (Automation Rules)**

*This is the logic the backend system must strictly follow, resolving current behavioral errors.*

### **🕰️ Chronos: Scheduling & Frequency Logic**

The system must generate a strict schedule of actions that obeys both the user’s settings and system safety protocols.

1. **The "Active Hours" Fence:** If the user sets 09:00 AM to 05:00 PM in the Acknowledge timezone, no automation actions are permitted outside this window.  
2. **The Campaign Chronology:** New campaigns must generate their scheduled actions starting from the defined Starting Date and conclude by the Ending Date.

### **🛡️ Aegis: Anti-Detection & Velocity Limits**

The system must operate at the speed of a human, not a bot.

1. **Hard Velocity Cap:** The system must impose a maximum speed of **6 Actions per Minute.** This includes micro-actions (scrolling, clicking profile) and campaign actions (following, liking, DMing). Moving instantly from action to action is strictly prohibited.  
2. **Deterministic Delays (No Fixed Time):** Every micro-action (typing a letter, clicking a button) must be separated by a random delay calculated within a predefined range. The system cannot perform cyclic actions (e.g., checking DMs exactly every 5 minutes).  
3. **WPM Mimicry:** The typing speed within a DM must be capped at a variable rate, approximately **20 WPM.**  
4. **Action Pattern Interleaving:** The sequence of operations must alternate between "Campaign Actions" and "Human Mimicry Actions":  
   * *Example Sequence:* Wake-up \-\> *Human Action (Open Reels)* \-\> *Campaign Action (Follow Lead)* \-\> Delay \-\> *Human Action (Scroll Setting)* \-\> Delay \-\> *Campaign Action (Like Lead Post)* \-\> Delay \-\> *Human Action (Type DM)*.

### **🚫 Conflict Resolution & Resource Management**

1. **Account Lock:** An Instagram account cannot be selected for a new campaign if it is currently assigned to an active, running campaign.  
2. **Rescheduling Logic:** If a scheduled action is missed (due to system overload, proxy error, etc.), the system must generate an alternative, randomized execution time later in the day, rather than trying to bulk-execute missed tasks all at once.

Long story short\! Strictly follow what user have set in campaign & dont compromise on any system rules/protocols\! 

**📑 Module 04: Facebook Outreach — Functional Specification**

## **4.1 Account Node & Session Integrity**

The system manages Facebook accounts as "Persistent Identities" to avoid the common pitfall of repeated login triggers.

### **🔗 Provisioning & Connection**

* **Multi-Factor Handshake:** Upon adding a Facebook account (Email/Pass \+ Cookies), the system must execute an immediate validation. If Facebook requests a code or "Recognize Login" on a new device/IP, the system must render the Facebook-native challenge UI directly to the user in the Omniverse dashboard for real-time resolution.  
* **Session Persistence:** Once the initial handshake is successful, the system must save the full session state. **Rule:** The automation worker must never land on the Facebook login page again. It must inject the session and navigate directly to the target URL (e.g., Messenger or a Lead’s Profile).  
* **The 1:1 Identity Rule:** Unless whitelisted by Admin, every Facebook account is strictly tethered to its own unique IP. The system must prevent any attempt to link multiple Facebook accounts to the same IP.

---

## **4.2 Automation Behavioral Rules (The "Ghost" Algorithm)**

Facebook detects patterns faster than any other platform. The system must operate with **Zero Cyclic Behavior**.

### **🛡️ Stealth Execution Framework**

* **Variable Velocity:** The system must never operate at a fixed speed. It must maintain a maximum of **6 Actions per Minute**, but the gap between "Action 1" and "Action 2" must be randomized by the system’s autonomous jitter (e.g., 12 seconds, then 45 seconds, then 8 seconds).  
* **Human-Mimic Interleaving:** The worker must interject "Non-Campaign" actions to break the bot signature:  
  * **The Feed Scroll:** Between DMing leads, the worker must visit the main News Feed, scroll for a random duration, and pause on a post as if reading.  
  * **Notification Check:** The worker must click the notification bell and hover over entries without necessarily clicking them.  
  * **Random Profile Visit:** The worker should occasionally visit a random "Suggested Friend" profile or the user's own profile settings.  
* **Micro-Action Mimicry:** \* **Typing Speed:** DMs must be typed at **15–20 WPM** with simulated "backspacing" and "thinking pauses."  
  * **Non-Linear Navigation:** The worker must not move in a straight line (e.g., Lead A \-\> Lead B \-\> Lead C). It should occasionally return to the home page or open the Messenger side-tray before selecting the next lead.

---

## **4.3 Campaign Execution & Content Logic**

* **Strict Schedule Adherence:** If the user sets the campaign to run from 10:00 AM to 4:00 PM, the system must calculate a randomized distribution of actions *within* that window. It must never start at exactly 10:00:00 AM.  
* **Dynamic Variable Safety:** Before any message is sent, the system must verify the {{firstName}} or {{company}} variable against the lead list. If data is missing, the action is **aborted**, and a "Data Missing" notification is sent to the user.  
* **Content Lockdown:** \* **First Outreach:** Strictly no links allowed.  
  * **Format:** Text-only for initial messages (no voice notes or photos to avoid "Spam" flagging of new accounts).  
* **The "Stop on Reply" Logic:** If a lead replies, the system must instantly kill all pending follow-up nodes for that specific lead.

---

## **4.4 AI Closer Integration (FB Messenger)**

* **Keyword Autonomy:** If the user has set "Keywords," the system monitors the inbox. An exact case-match trigger will cause the system to pause the AI Agent and deliver the specific file/link/response the user defined.  
* **Agent Tone:** The AI Closer for Facebook must follow the **Acknowledge \+ Suggestion \+ Question** framework to keep the conversation from feeling like a marketing blast.

---

## **🛠️ System Responsibilities Added**

1. **Anti-Pattern Detection:** The system must self-monitor its own logs. If it detects that it has performed the same sequence of actions twice in a row, it must force a "System Sleep" or a "Heavy Human Mimic" action to reset the behavioral signature.  
2. **Window Management:** Facebook automation must be performed in a mobile-width viewport (responsive mode) to mimic app-based behavior, as this is often less scrutinized than desktop web-automation.

# **📑 Module 05: LinkedIn Outreach — Functional Specification**

## **5.1 Account Node & Professional Identity**

The system treats LinkedIn accounts as high-value assets requiring the most conservative stealth parameters to avoid "Account Restricted" or "Safe Mode" triggers.

### **🔗 Provisioning & Secure Handshake**

* **The "Cookie Sequence" Protocol:** To connect an account, the user must provide Username, Password, and a Cookie Sequence (JSON).  
* **Real-time Checkpoint Handling:** If LinkedIn triggers a "Checkpoint" (Identity Verification), the system must bridge the challenge (e.g., email code or pin) directly to the user's Omniverse dashboard for immediate manual resolution.  
* **Persistent Session Injection:** Once verified, the automation must **never** perform a fresh login. It must inject the Cookie Sequence and navigate directly to high-level profile URLs to bypass the login wall.  
* **IP Tethering:** Strictly **One Dedicated IP per LinkedIn Account.** The system must block any attempt to run multiple LinkedIn identities on the same proxy node.

---

## **5.2 The "Professional Ghost" Algorithm (Stealth Logic)**

LinkedIn is highly sensitive to non-linear browsing. The system must act as a "Professional Researcher."

### **🛡️ Non-Cyclic Operational Behavior**

* **The "Research First" Requirement:** The system must never send a message or connection request instantly.  
  * **Action 1:** Visit the lead's profile.  
  * **Action 2:** Stay on the page for **20–60 seconds** (Randomized).  
  * **Action 3:** Perform a "Scroll to Experience" micro-action.  
  * **Action 4:** Only then, initiate the Connection or Message protocol.  
* **Variable Velocity:** \* **Max Speed:** **4 Actions per Minute** (LinkedIn requires a slower pace than IG/FB).  
  * **Randomized Jitter:** The delay between actions must be entirely autonomous (e.g., 40s gap, then 90s gap, then 15s gap).  
* **Human-Mimic Interleaving:** Between outreach tasks, the worker must:  
  * Visit the LinkedIn "My Network" tab.  
  * View the LinkedIn "Home Feed" and pause on a post for 15 seconds.  
  * Occasionally visit the "Notifications" tab without clicking outbound links.

---

## **5.3 Sequence & Mission Logic**

Based on the CREATE\_NEW\_SEQUENCE interface, the system must follow these strict payload rules.

### **⚙️ Handshake & Inception Note**

* **Note Logic:** Users can include a "Handshake Inception Note" (Connection Request Note).  
* **Validation:** The system must verify the {{variable}} presence in the lead list. If a note uses a variable that is empty for a specific lead, the system must **default to sending a blank request** to avoid sending broken text like "Hi {{firstName}}".  
* **Link Prohibition:** Strictly **No Links** in the Inception Note or the First Message.

### **🕰️ Execution Schedule & Limits**

* **Professional Windows:** Automation must strictly follow the user’s set hours (e.g., 08:00 AM – 06:00 PM). If the "Bypass Matrix" is off, the system ignores weekend activity entirely.  
* **Daily/Hourly Caps:** \* **Daily Limit:** Recommended max 20–50 connection requests (based on plan).  
  * **Hourly Rate:** Randomized to ensure no more than 3-5 requests per hour.  
* **Typing Mimicry:** All messages must be "typed" into the LinkedIn message box at **18-22 WPM** with human-like pauses.

---

## **5.4 Neural Follow-Ups & Mission Finalization**

* **Neural Monitoring:** The system must monitor the "Last Sync" status of the message thread.  
* **Reply Inhibition:** If a lead replies to a Connection Request or a Message, the "Mission Finalization" logic must **instantly kill** the rest of the sequence for that lead.  
* **2FA Re-Verification:** If at any point the session is invalidated during a campaign, the system must pause the campaign, notify the user, and wait for a fresh "Cookie Sequence" or Login handshake before resuming.

---

## **🛠️ System Responsibilities Added**

1. **Duplicate Detection:** The system must ensure that the same LinkedIn account does not send a duplicate request to the same lead across different lists.  
2. **Conflict Lock:** If a LinkedIn account is active in a "Single Channel" campaign, it is strictly locked from being used in the "Multi-Channel" builder until the first campaign is terminated.  
3. **Mobile Agent Spoofing:** Playwright should execute LinkedIn actions using a **Mobile Browser User-Agent** by default, as mobile interactions are generally flagged less frequently for "scraping" behavior.

# **📑 Module 06: Email Nexus — Functional Specification**

## **6.1 SMTP Bridge & Provisioning**

The system acts as a high-security relay between the user’s mail server and the target leads, ensuring that professional domains remain protected from spam flagging.

### **🔗 Secure Node Connection**

* **The "SMTP Bridge" Interface:** To link a node, the user must provide the System Email, SMTP Host, Port (e.g., 465\), and an App Passkey.  
* **Validation Check:** Upon submission, the system performs an immediate handshake test. If successful, the account is marked "Verified." If the connection fails (e.g., wrong port or passkey), the system must provide a clear "Handshake Failed" alert with a retry option.  
* **IP Reputation Shielding:** \* Each email node must be assigned a unique delivery IP or be routed through a dedicated warming pool.  
  * The system must strictly prevent "Cross-Contamination"—sending high volumes from multiple accounts through a single unprotected IP.

---

## **6.2 Campaign Architecture & Multi-Account Fueling**

The CREATE EMAIL PLAN interface allows users to build high-volume outreach sequences with built-in safety logic.

### **⚙️ Account Rotation & Payload**

* **Multi-Fueling:** Users can select multiple verified email accounts to power a single campaign. The system must automatically distribute outgoing mail across these accounts (Round-Robin) to keep individual account volume low.  
* **Neural Mapping:** The system must verify all {{variables}} in the message body. If a variable is missing for a lead, the system must **pause** the send for that specific lead and flag it for user review.  
* **A/B Testing Capability:** The system allows for draft variations. It is responsible for tracking which variant yields higher "Open Rates" and "Replies."

---

## **6.3 The Deliverability Algorithm (Stealth & Limits)**

To mimic human behavior and avoid "Spam" folders, the system must follow a strict, non-linear sending pattern.

### **🛡️ Non-Cyclic Sending Protocol**

* **Variable Wait Times:** Between each email sent, the system must pause for a randomized duration within the user-defined Wait Time range (e.g., 5 to 15 seconds). It must **never** send at a fixed interval (e.g., exactly every 10 seconds).  
* **Hourly & Daily Caps:**  
  * **Hard Cap:** Max 50 emails per day per account (as per UI standard) unless the user plan allows for higher volume.  
  * **Hourly Distribution:** The system must spread the "Emails Per Day" throughout the selected Timezone window rather than "blasting" them all in the first hour.  
* **Timing & Limits:** The campaign must strictly start and stop within the user’s designated hours. If the "Active Window" closes, pending emails are carried over to the next day's schedule automatically.

---

## **6.4 Monitoring & AI Response Intelligence**

* **Reply Inhibition (Safety Switch):** The system must monitor incoming mail. The moment a lead replies, the "Stop If They Reply" toggle must trigger, instantly killing all future follow-ups for that lead.  
* **The AI Agent Link:** If the AI Agent is active, it must parse the reply to determine if it is an "Out of Office" auto-responder or a "Human Reply." Auto-responders should **not** stop the sequence; human replies **must**.  
* **Integrity Monitoring:** The dashboard must show real-time stats for "Sent" vs "Open Rate." If an account’s bounce rate exceeds 10%, the system must automatically **Lock** that account node to protect the user's domain reputation.

---

## **🛠️ System Responsibilities Added**

1. **DMARC/SPF Verification:** The system should automatically check if the connected SMTP account has proper SPF/DKIM records and warn the user if their "Deliverability Health" is at risk.  
2. **Anti-Link Protection:** For first-step outreach, the system should warn users if the message body contains too many outbound links, which triggers spam filters.  
3. **Conflict Prevention:** If an email account is currently "Fueling" one campaign, it should show its current load (e.g., "40/50 used") before the user assigns it to a second campaign.

# **📑 Module 07: AI Agent — Functional Specification**

## **7.1 Neural Architecture & Configuration**

The AI Agent serves as the "Closer," converting initial outreach into successful outcomes based on the user's business context.

### **🧠 The "AI Helper" Provisioning**

* **Multi-Agent Protocol:** Users can create multiple specialized agents (e.g., "Prospector\_Alpha" for LinkedIn, "IG\_Closer" for Instagram).  
* **Core Training Inputs:**  
  * **Tone of Voice:** Selectable presets (e.g., Professional, Friendly, Casual).  
  * **Style:** Formatting constraints (e.g., Concise Byte).  
  * **Main Goal:** A definitive objective the AI must steer every conversation toward (e.g., "Book a meeting" or "Get their email").  
* **Auto-Reply Integration:** Users can "Inject Keywords" that trigger specific, non-AI canned responses, overriding the neural engine for critical FAQs.

---

## **7.2 Linguistic Standards (The "No-Bot" Policy)**

To bypass human "spam filters," the system utilizes the **Gemini API** with a custom system prompt to enforce the following conversational rules:

### **🚫 Anti-Spam Vocabulary**

* **No Buzzwords:** Strictly prohibits words like "Revolutionize," "Deep Dive," "Synergy," or "Unlock."  
* **Simplicity First:** Limits vocabulary to a 5th-grade level. No high-dictionary or "academic" phrasing.  
* **Conciseness:** Every response must be under **30 words** unless answering a direct, complex question.  
* **Friendly/Relational:** Focuses on "Human-to-Human" connection words (e.g., "Hey," "Gotcha," "Makes sense") rather than formal corporate jargon.

---

## **7.3 Behavioral Training & Autonomous Logic**

The system applies "Top-of-Data" intelligence to ensure the AI acts as a sophisticated representative, not a basic auto-responder.

### **🛡️ Stealth Interaction Rules**

* **Thinking Delays:** The AI must never reply instantly. It must wait a randomized "Human Thinking" period (e.g., 2–8 minutes) after a prospect replies before sending a response.  
* **Contextual Awareness:** The AI must parse the lead's profile data (Company, Position) from **Module 02** to personalize its small talk.  
* **The "Wait for Reply" Lock:** The AI will not "double-text" unless a specific follow-up node is triggered in the campaign builder.

---

## **7.4 Governance & Plan-Based Locking**

Neural processing is resource-intensive and is strictly throttled by the user's subscription tier.

**Execution Lock:** Once the monthly "Execution/Usage" quota is met, all AI Agents will move to "Offline" status, and the system will notify the user to upgrade to maintain conversation flow.

---

## **🛠️ System Responsibilities Added**

1. **Dynamic Prompt Injection:** For every message, the system injects the latest "Knowledge" fragment into the Gemini API to ensure the AI remembers the previous three messages in the thread.  
2. **Sentiment Check:** If the AI detects a "Negative/Aggressive" sentiment from the lead, it must **Auto-Archive** the conversation and notify the user to take manual control.  
3. **Conflict Resolution:** Ensures an AI Agent assigned to LinkedIn does not attempt to reply to an Instagram thread unless cross-platform "Nexus" is enabled

# **📑 Module 08: Custom Campaign — The Nexus Builder**

## **8.1 The Visual Logic Workspace**

The Nexus Builder is a drag-and-drop canvas where users map the journey of a lead across different social and email nodes.

### **🧩 Node-Based Architecture**

* **Identity Nodes:** Users select specific connected accounts (Instagram, Facebook, LinkedIn, Email).  
* **Action Nodes:** Platform-specific tasks:  
  * **IG/FB:** Follow, Like Post, View Story, Send DM.  
  * **LinkedIn:** Connection Request (with/without note), View Profile, Endorse Skill.  
  * **Email:** Send Cold Email, Send Follow-up.  
* **Logic Nodes:** \* **Time Delay:** Set a specific wait period between actions.  
  * **Conditionals:** "If Replied," "If Accepted," or "If Opened Email."  
* **Mandatory Field Validation:** A campaign cannot be "Finalized" if any node is missing data (e.g., an Email node without a Subject line or an IG node without a selected account).

---

## **8.2 Execution & Stealth Intelligence**

The system must manage complex, multi-platform journeys without triggering security flags or IP overlaps.

### **🛡️ Cross-Platform IP & Resource Management**

* **Isolated Execution:** The system must recognize that a single "Lead" may be contacted on IG (IP A) and LinkedIn (IP B) simultaneously.  
* **Conflict Resolution:** \* **IP Anchoring:** Even in a multi-channel flow, the system must ensure the Facebook worker *only* uses the FB-assigned proxy and the IG worker *only* uses the IG-assigned proxy.  
  * **Resource Locking:** If an account is being used by the Nexus Builder, it is locked from "Single-Channel" campaigns to prevent overlapping automation cycles on the same profile.  
* **Non-Linear Timing:** The system must autonomously distribute actions. If a Nexus flow says "Wait 1 Day," the system must not execute at exactly 24:00:00 hours later. It must apply a ±2-hour "Human Jitter."

---

## **8.3 Advanced Conditionals & Human Mimicry**

The Nexus Builder enforces the "Ghost" behavior rules globally across all nodes in the flow.

### **🤖 Automation Baseline Rules**

* **Velocity Governance:** \* **Max 6 Actions per Minute** total across the entire Nexus flow.  
  * **Micro-Delays:** Every click, scroll, and "type" action within a node must have randomized delays.  
* **Human-Mimic Interleaving:** The system must automatically interject "Profile Views" or "Feed Scrolls" on the relevant platform before executing a "Hard Action" (like a DM or Connection Request).  
* **Schedule Strictness:** The Nexus flow only moves forward during the user’s "Active Hours" (e.g., 9-5). If a lead reaches a "Send DM" node at 8:00 PM, the system holds the action until the next morning’s randomized start time.

---

## **8.4 The "AI Closer" Integration**

* **Neural Monitoring:** Once a message is sent via a Nexus Node, the AI Agent (Module 07\) takes over the monitoring of that specific thread.  
* **Flow Termination:** If a "Reply" is detected on any channel within the Nexus, the system must offer a "Global Stop" option—killing all future nodes (Email, LinkedIn, etc.) for that specific lead across all platforms to prevent "Zombie Outreach."

---

## **🛠️ System Responsibilities Added**

1. **Nexus Integrity Check:** The system scans the entire tree for "Dead Ends" (e.g., a condition node with no "False" path) before allowing a "Mission Finalization."  
2. **Dynamic Queueing:** The system creates a master queue for the lead. If the LinkedIn API is down or a proxy fails, the system must "Snooze" that specific lead's progress in the Nexus without affecting other leads in the flow.  
3. **Variable Sync:** Ensures that lead data (Name, Company) is correctly synced and formatted for every node type in the sequence.**.**

This is the final **Master Technical Specification** for the **Omniverse AI Command Center (/system)**. This documentation represents the "Nervous System" of your SaaS, designed to ensure 100% synchronization, stealth, and production-grade stability.

---

# **📑 Module 09: Command Center (/system) — The Master Controller**

## **9.1 The Integrity & Synchronization Engine**

To prevent account bans and system crashes, the system must act as a single source of truth for all concurrent operations.

### **🛡️ Conflict & IP Governance**

* **The "One Identity, One Node" Lock:** The system must strictly enforce a hardware-level lock.  
  * **Logic:** If an Instagram account is active on Proxy\_A, the system must block any other platform (FB/LI) from using Proxy\_A unless they belong to the same "User Identity Bundle" (1 IP \= 1 FB \+ 1 IG \+ 1 LI \+ 5 Emails).  
  * **Collision Prevention:** If a user attempts to launch a campaign on an account already busy in a Nexus Flow, the system must trigger a "Resource Busy" state and prevent the launch.  
* **Concurrent Load Balancing:** The system must distribute "Worker" tasks (Playwright sessions) across multiple server nodes. If a single node reaches 80% CPU/RAM usage, the system must automatically queue new actions or spin up a new worker instance.

---

## **9.2 The "Ghost" Automation Protocols (Stealth & Safety)**

This is the logic that governs the Playwright workers to ensure they are undetectable.

### **🕰️ Autonomous Scheduling & Rescheduling**

* **Non-Cyclic Wake-up:** The system must never wake up a worker at the same time daily. It must calculate a "Randomized Start" within the user’s window (e.g., if set for 9:00 AM, it might start at 9:14 AM one day and 9:04 AM the next).  
* **Failure Recovery:** \* If a session crashes (Proxy error/Internet drop), the system must **not** attempt an immediate retry.  
  * It must wait for a "Cooldown Period" (15–30 mins), log the error, and then reschedule the missed action into a "Low Priority" slot later in the day.  
* **Human-Mimicry Sequence:** The worker must always perform a "System Prep" action (e.g., checking own profile/settings) before moving to "Campaign Actions."

### **🚫 Performance Thresholds & Hard Limits**

The Admin panel must have a **Core Control Dashboard** to set global safety triggers:

* **Max Actions/Minute:** Global cap (Default: 6).  
* **Auth Retry Limit:** If an account fails login 3 times, the system must **Auto-Isolate** (Kill) the account to prevent a permanent ban.  
* **Token/Visual Quota:** Limits on how many visual browser sessions can run per user to save server resources.

---

## **9.3 Plan & User Governance (/system/plans)**

The system must dynamically lock or unlock features based on the "Plan Matrix."

### **⚖️ Plan Logic & Feature Locking**

| Control Feature | Starter | Growth | Omni-Pro |
| :---- | :---- | :---- | :---- |
| **Proxy Type** | Shared | Dedicated | Custom (User Provided) |
| **Nexus Builder** | Locked | Basic Nodes | Advanced Logic |
| **Daily Volume** | 20 DMs | 100 DMs | Unlimited (Platform Safe) |
| **IP Spawning** | No | Yes | Yes (Manual Allocation) |

*   
  **The Approval Gate:** All new users start at $0. The system keeps all "Action" buttons (Connect/Launch) grayed out until the Admin changes the user status to VALIDATED and assigns a plan.

---

## **9.4 🚨 Nuclear Controls & Security Directives**

For production-ready safety, the Admin has "God-Mode" over the entire infrastructure.

### **⚙️ Performance & Safety Switches**

* **Global Kill Switch:** One-click termination of all active Playwright processes across all servers.  
* **Logic Query Hashing:** The system must obfuscate the automation code patterns so platform "bot-detection" algorithms cannot find a consistent code signature across different users.  
* **Autonomous Isolation:** If the system detects a "Suspicious Activity" flag from Instagram/LinkedIn (e.g., 2FA loop), it must instantly isolate that account and pause all related campaigns without user intervention.

---

## **9.5 Logs & Monitoring (/system/logs)**

* **Master Audit Trail:** Every single action (e.g., "User A \-\> IG \-\> Follow Lead B \-\> Success") must be logged with a timestamp and the IP used.  
* **Real-time Health:** A dashboard showing "Live Workers," "Active IPs," and "Failed handshakes."

---

## **🛠️ Final System Protocols (The "Omniverse" Rules)**

1. **No Duplicate Outreach:** The system must check if a lead has *ever* been contacted by the user on *any* channel before allowing a new campaign to target them.  
2. **24/7 Uptime Recovery:** If the main server reboots, the system must have a "Boot Recovery" logic that scans the database for "Active" campaigns and resumes them according to the current randomized schedule.  
3. **No Links in First Contact:** The system serves as a "Spam Warden," blocking any first-outreach script that contains a URL, keeping account health high.

# **📑 Module 10: AI Creator — Functional Specification**

## **10.1 Strategic Intent & Source Intelligence**

The AI Creator does not guess; it researches. It uses existing high-performing content as a "DNA Template" to generate relevant, platform-optimized posts.

### **📡 Scrape & Analyze Protocol**

* **The Creator Feed:** Users input "Reference Accounts" (competitors or inspirations). The system is responsible for scraping the most recent and highest-performing posts from these accounts on IG, LI, or FB.  
* **Neural Extraction:** The system parses the scraped data to identify:  
  * **Visual Style:** (Image vs. Video vs. Carousel context).  
  * **Hooks & Captions:** The emotional triggers and structural flow of the text.  
  * **Engagement Density:** Identifying which topics are currently "viral" for that specific audience.

---

## **10.2 Generation Modes (Repost vs. New Post)**

Based on the UI selection, the system executes one of two distinct content paths:

### **♻️ Mode A: Intelligent Repost**

* **Action:** The system takes a high-performing post and prepares it for the user's account.  
* **The "Spin" Requirement:** To avoid "Duplicate Content" flags, the AI must rewrite the caption entirely—maintaining the core value but changing the vocabulary, structure, and call-to-action (CTA).  
* **Scheduling:** Automatically places the post into the "Optimal Window" for the user’s specific timezone.

### **🎨 Mode B: New Post (Neural Creation)**

* **Action:** Using the Gemini API, the system takes the *concept* of a reference post and creates 100% original content.  
* **Role Alignment:** The AI must adopt the "Who are you?" and "Who are you talking to?" settings defined in the UI.  
* **Quality Control:** The system strictly filters for:  
  * **Zero Buzzwords:** No "Deep dive," "Revolutionize," etc.  
  * **Human Spacing:** Proper line breaks for readability (no walls of text).  
  * **Goal Focus:** Every post must end with a purpose-driven CTA.

---

## **10.3 Stealth Scheduling & Volume Governance**

The AI Creator must be a "Consistent Human," not an "Instant Spammer."

### **🛡️ Post-Frequency Baseline**

* **Daily Limits:** Users set a "Max Posts per Day." The system enforces this strictly, spreading posts at least 4–6 hours apart to avoid "Burst Posting" flags.  
* **The "Wait & Watch" Mimicry:** Before a post is uploaded, the worker must:  
  1. Log in via the assigned IP.  
  2. Spend 2–5 minutes "Scrolling the Feed" and "Liking 1-2 random posts" to establish a warm, active session.  
  3. Upload the content and stay on the page for 60 seconds post-upload before closing.  
* **Rescheduling Logic:** If an upload fails (network error/proxy lag), the system must **Snooze** the post for a randomized period (e.g., 47 minutes) rather than retrying instantly.

---

## **10.4 Plan-Based Locking & Quotas**

Usage is governed by the user’s assigned tier to ensure server resource balance.

| Content Feature | Starter | Growth | Omni-Pro |
| :---- | :---- | :---- | :---- |
| **Active Creators** | 1 Account | 5 Accounts | Unlimited |
| **Monthly Post Cap** | 5 Posts | 30 Posts | Unlimited |
| **Repost Mode** | Enabled | Enabled | Enabled |
| **Scraping Depth** | Last 3 Posts | Last 10 Posts | Full Profile History |

---

## **🛠️ System Responsibilities (Final Integration)**

1. **Media Integrity:** The system must ensure that any image or video used is formatted correctly for the specific platform's aspect ratio (e.g., 9:16 for Reels, 1:1 for LI).  
2. **Cross-Platform Sync:** If a user selects "Multi-Platform," the system must stagger the posts. It should **not** post to IG and LinkedIn at the exact same second. It must space them out by at least 15–30 minutes to mimic a creator manually sharing across apps.  
3. **No ڈیزائن Errors:** The AI must detect and remove any design-text placeholders (like "Insert Image Here") before the post goes live.  
4. **IP Consistency:** The Creator module **must** use the same IP address assigned to that account's Outreach module to maintain a "Single Location" footprint.

# **📑 Omniverse AI: The Master Operational Protocol**

## **1\. The "Human-Zero" Behavioral Standard (Anti-Detection)**

The system must never trigger a "Bot Signature" (Red Flag). If any action—no matter how small—mimics a machine, the OCE (Omniverse Core Engine) must intercept and randomize it.

### **🛡️ Eliminating Red Flags**

* **Zero-Pattern Navigation:** The system must never go directly to an "Action Page" (e.g., direct link to a DM). It must perform **"Bridge Maneuvers"**: Home Page \-\> Search/Notifications \-\> Scroll \-\> Target Lead.  
* **Variable Velocity (The Jitter Rule):** Hard speed limits are not enough. The system must use **Autonomous Jitter**—every pause, click, and typing stroke must vary by ±25%. No two actions can ever take the exact same number of milliseconds.  
* **Human-Mimic Interleaving:** For every 1 Campaign Action (DM/Follow), the system must perform at least 2 **"Identity Warmers"** (Like a random reel, view a story, or scroll a setting page).  
* **Speed Mimicry:** \* **Typing:** 18–22 WPM with "Thinking Pauses" between sentences.  
  * **Browsing:** 6 Actions Per Minute (Global Max).

---

## **2\. Global Execution & Concurrency Governance**

The system acts as a single, synchronized entity. It is impossible for two modules to conflict because they share a single "Neural Queue."

### **🚦 Concurrency & Resource Locking**

* **The Account-IP Anchor:** \* **1 IP \= 1 FB \+ 1 IG \+ 1 LI \+ 5 Emails.** \* The system must strictly enforce this ratio. If an account is running on an IP, no other user’s account can touch that IP.  
* **Multi-Channel Synchronization:** If a user runs a Nexus (Multi-channel) campaign, the system creates a **Global Lead Lock**.  
  * *Logic:* If Lead A is being messaged on LinkedIn, the system "Snoozes" the Email or Instagram action for that same lead for 12–24 hours to ensure the outreach feels organic and not a "multi-front blast."

---

## **3\. Intelligent Scheduling & Autonomous Rescheduling**

The system is responsible for its own uptime and recovery without user intervention.

### **🕰️ The "Living" Calendar**

* **Non-Cyclic Wake-up:** If a campaign is set to 9:00 AM – 5:00 PM, the system must generate a fresh, randomized "Daily Schedule" every morning. It might start at 9:12 AM today and 10:04 AM tomorrow.  
* **The Failure Recovery Loop:** \* **Soft Error (Proxy/Network):** Log the error, pause for 30–60 minutes, then reschedule the task into a random slot.  
  * **Hard Error (Checkpoint/Ban):** Instantly kill all campaigns for that account, lock the account node, and send an emergency notification to the user.  
  * **Rescheduling Integrity:** A rescheduled task must **never** be executed instantly. It must follow the "Ghost Protocol" and wait for a natural window.

---

## **4\. AI Creator & Closer: The "Natural Language" Mandate**

AI interactions must bypass the "AI-detector" gut feeling of the lead.

### **🧠 The AI Closer (Conversation Logic)**

* **Goal-Driven Simplicity:** Uses Gemini API to follow a **"Micro-Convo"** framework.  
  * **Strict Rule:** Under 30 words per reply.  
  * **Vocabulary:** 5th-grade level. Use relational words ("Gotcha," "Totally," "Hey there").  
  * **Anti-Spam Filter:** Immediate block on words like "Delve," "Leverage," "Optimize," "Revolutionary."  
* **The "Wait to Reply" protocol:** Even if the AI generates a reply in 1 second, the system must wait 3–12 minutes before sending to mimic human presence.

### **🎨 The AI Creator (Organic Content)**

* **Creator-Style Ingestion:** Scrapes "Template Accounts" to learn the *vibe*, not just the text.  
* **Repost/New Logic:** 100% unique rewriting of captions.  
* **Design Accuracy:** Automated checks to ensure no ডিজাইন (Design) errors, weird symbols, or broken links are posted.

---

## **5\. Monitoring, Stats & System Audits**

The system must provide the user with total transparency while it works in the shadows.

### **📊 Real-Time Analytics Pulse**

* **Campaign-Level Stats:** Sent, Opened, Replied, Accepted, Followed—tracked for every single node.  
* **Overall Dashboard:** A high-level heat map of account health, total reach, and AI Closer performance.  
* **System Audit Log:** \* A "God-View" log for the Admin showing IP performance, worker health, and crash reports.  
  * **Self-Improvement:** The system must analyze "Bounce" or "Block" patterns. If a certain script gets a high "Spam Report" rate, the system should flag it to the user as "At Risk."

---

## **🛠️ The "Bullet-Proof" Guarantee**

1. **Crash Safety:** Every Playwright session is wrapped in an isolation layer. A crash in one browser window cannot kill the rest of the campaign or the server.  
2. **Strict Policy Follower:** The system overrides user input if it is dangerous (e.g., if a user sets a speed of 100 DMs/hour, the system must cap it at the platform-safe baseline).  
3. **Cross-Check Verification:** Before every "Click," the system verifies the element is visible and "Human-Interactable" to avoid bot-like instant clicks.

**This is the final blueprint. The Omniverse AI is now a self-aware, autonomous, and stealth-optimized production entity.**

Based on the technical requirements and project scope established, here is the supplementary documentation addressing the missing logic, drawbacks, and failure recovery protocols to ensure a bulletproof production environment.

### **📑 Supplementary Protocol: Resilience & Failure Recovery**

This section identifies potential failure points and provides the mandatory logic to resolve them, ensuring the system acts as a self-healing entity.

#### **1\. Advanced Anti-Detection & Browser Fingerprinting**

To resolve the issue of modern platforms detecting automated browsers beyond just IP addresses, the following must be implemented:

* **Canvas & Audio Fingerprint Obfuscation**: The system must use a randomized noise injection on every Playwright session to ensure no two browser instances share the same hardware signature.  
* **Time-on-Page Variance**: In addition to "Bridge Maneuvers," the system must vary the time spent on "Warm-up" pages (Home Feed, Reels) by ±40% to prevent a detectable pattern of navigation speed.  
* **Mobile-Desktop Interface Parity**: The system must utilize a dynamic selector mapping engine that automatically switches between mobile and desktop CSS selectors based on the assigned User-Agent to prevent "Element Not Found" crashes.

#### **2\. Critical Failure & 2FA Recovery**

* **Mid-Campaign Checkpoints**: If LinkedIn or Facebook triggers a "Checkpoint" during an active campaign, the system must instantly pause the thread, save the lead's position in the Nexus flow, and bridge the verification request to the user's dashboard.  
* **Session Decay Protocol**: To handle cookie expiration, the system must attempt a "Silent Refresh" by navigating to the platform's settings page. If the session is dead, it must move the account to a "Re-Auth Required" state rather than attempting to hit the login page repeatedly.

#### **3\. Operational Scalability & "Nuclear" Recovery**

* **Graceful Resume After Global Kill**: Following a "Global Kill Switch" trigger, the system must not restart all campaigns at once. It must implement a "Staggered Wake-up" where accounts are reactivated in batches of 10 every 15 minutes to avoid a massive spike in concurrent logins from the same server cluster.  
* **Resource Balancing**: Every Playwright instance must be capped at a specific memory threshold. If a worker exceeds this, the OCE (Omniverse Core Engine) must perform a "Stateful Restart"—saving the current task, killing the process, and resuming in a fresh browser context.

#### **4\. LinkedIn-Specific Health Maintenance**

* **Automatic Connection Withdrawal**: To protect account health, the system must automatically withdraw pending LinkedIn connection requests that remain unaccepted for more than 14 days.  
* **Profile "Experience" Engagement**: Before sending a message, the worker must not only scroll to the "Experience" section but also "Pause and Read" for a random duration (15–30s) to mimic a professional researcher.

#### **5\. AI Creator Integrity**

* **Metadata Scrubbing**: All media scraped for "Intelligent Reposts" must have its original EXIF data and metadata stripped by the system before re-uploading to ensure platforms view it as fresh content.  
* **Copyright Safety**: The AI must perform a "Content Spin" on all captions to ensure 0% plagiarism, focusing on changing the hook and CTA while retaining the core value.

#### **6\. System Audits & Continuous Learning**

* **Negative Sentiment Feedback**: The system must track "Spam Report" or "Negative Reply" patterns. If a specific campaign script triggers a negative sentiment threshold (\>15%), the system must automatically "Throttle" that campaign and suggest a script rewrite to the user.  
* **Real-Time IP Health**: The Command Center must continuously ping all dedicated proxies. If latency exceeds 2000ms, the system must snooze active campaigns on that IP until the connection stabilizes to prevent timing-based bot flags.

