
# Production Hosting Guide (DigitalOcean)

To ensure the Omniverse SAAS runs reliably at scale, follow these configuration steps for your DigitalOcean droplet.

## 1. Recommended Droplet Spec
- **Size**: 4GB RAM / 2 vCPUs (General Purpose or CPU-Optimized)
- **OS**: Ubuntu 22.04 LTS
- **Region**: Closest to your target audience (e.g., NYC1 or FRA1)

## 2. Infrastructure Requirements
- **Redis**: Required for BullMQ email queue.
  - `sudo apt update && sudo apt install redis-server`
  - Ensure it's running: `sudo systemctl status redis`
- **MongoDB**: Use **MongoDB Atlas** (Cloud) for easy backups and clustering, or install locally.
- **Node.js**: v20+ 

## 3. Environment Variables (.env.local)
Ensure these are set in your production environment:
```env
MONGODB_URI=mongodb+srv://...
REDIS_URL=redis://127.0.0.1:6379
ENCRYPTION_KEY=your-32-char-key
DO_TOKEN=your_digitalocean_api_token
DROPLET_ID=your_droplet_id
```

## 4. Proactive Safety & Backups
### Automated Snapshots
The system includes a utility in `lib/system/backup.js` to trigger snapshots. You can set a weekly cron job on your server:
```bash
# Edit crontab: crontab -e
0 0 * * 0 /usr/bin/node /home/omniverse/scripts/trigger-backup.js
```

### Process Management (PM2)
Use PM2 to keep both the web server and the background worker running:
```bash
npm install -g pm2
pm2 start npm --name "omniverse-web" -- start
pm2 start background-worker.js --name "omniverse-engine"
pm2 save
```

## 5. Security Checklist
- [ ] Enable 2FA for Admin login.
- [ ] Ensure SMTP accounts use App Passwords, not main passwords.
- [ ] Firewall (UFW): Only allow ports 80, 443, and 22.
- [ ] Use SSL (Certbot/LetsEncrypt).
