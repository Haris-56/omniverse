
const axios = require('axios');
const { logSystemEvent } = require('../logger');

/**
 * DigitalOcean Snapshot Trigger
 * Requires DO_TOKEN and DROPLET_ID environment variables.
 */
async function triggerDropletSnapshot() {
    const token = process.env.DO_TOKEN;
    const dropletId = process.env.DROPLET_ID;

    if (!token || !dropletId) {
        console.warn("Snapshot skipped: DO_TOKEN or DROPLET_ID missing.");
        return;
    }

    try {
        const res = await axios.post(
            `https://api.digitalocean.com/v2/droplets/${dropletId}/actions`,
            { type: 'snapshot', name: `Omniverse-Auto-${new Date().toISOString().split('T')[0]}` },
            { headers: { 'Authorization': `Bearer ${token}` } }
        );

        await logSystemEvent('INFO', 'system-backup', 'Droplet snapshot triggered successfully', { actionId: res.data.action.id });
        return res.data;
    } catch (err) {
        await logSystemEvent('ERROR', 'system-backup', `Snapshot failed: ${err.message}`, { error: err.response?.data });
        throw err;
    }
}

module.exports = { triggerDropletSnapshot };
