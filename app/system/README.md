# System Admin Module - Omniverse

This module provide global administrative control over the Omniverse platform.

## 🚀 Getting Started

### 1. Assign Admin Role
To access this module, a user must have the `role: "admin"` in the database. 
Connect to your MongoDB and run:

```javascript
db.user.updateOne({ email: "your-admin-email@example.com" }, { $set: { role: "admin" } })
```

### 2. Access Path
The dashboard is located at `/system`.

## 🛠 Features

### 📊 Real-time Dashboard
Monitor global stats, platform-wise usage, and infrastructure health from a single view.

### 👥 User Control
- Search and filter users by status or plan.
- Manual plan overrides and upgrades.
- Suspend accounts or force logout users.

### 💎 Plan Engine
Create and modify subscription tiers. Limits defined here are automatically enforced at runtime when users create campaigns or connect accounts.

### 🌐 IP Infrastructure
Manage the pool of system IPs. Assign specific IPs to high-volume users to ensure outreach safety and avoid conflict.

### 🛡 Safety & Governance
- **Emergency Stop**: Instantly halt all platform activity in case of an issue.
- **Audit Logs**: Immutable history of all administrative actions.
- **Rate Limits**: Global thresholds for API and automation nodes.

## 🏗 Technical Architecture

- **Backend**: Next.js API Routes with MongoDB Native Driver.
- **Auth**: Better-Auth with role-based session extension.
- **Enforcement**: Middleware-level and API-level limit checks (`lib/limits.js`).
- **UI**: Modern Tailwind CSS 4 with Lucide React icons.
