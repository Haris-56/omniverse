import { getDb } from '../mongodb.js';

export async function isGlobalKillSwitchActive() {
    try {
        const db = await getDb();
        const settings = await db.collection('system_settings').findOne({ key: 'global_pause' });
        return settings?.value === true;
    } catch (e) {
        return false;
    }
}

export async function setGlobalKillSwitch(active, reason = "Manual") {
    const db = await getDb();
    await db.collection('system_settings').updateOne(
        { key: 'global_pause' },
        { $set: { value: active, reason, updatedAt: new Date() } },
        { upsert: true }
    );
}
