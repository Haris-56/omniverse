import { getDb } from './mongodb.js';

export async function logSystemEvent(level, category, message, metadata = {}) {
    try {
        const db = await getDb();
        const logEntry = {
            level: level.toUpperCase(), // INFO, WARN, ERROR, CRITICAL
            category, // 'email-campaign', 'proxy', 'account', 'system'
            message,
            metadata,
            timestamp: new Date()
        };

        await db.collection('system_logs').insertOne(logEntry);
        console.log(`[${logEntry.level}] [${category}] ${message}`, metadata);
    } catch (err) {
        console.error("Critical: Failed to save to system logs", err);
    }
}
