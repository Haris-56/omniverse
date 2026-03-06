import { getDb } from '../mongodb.js';
import { logSystemEvent } from '../logger.js';

/**
 * Centalized Safety Governor
 * Checks for anomalies like high failure rates or suspicious account activity
 */
export async function checkSafetyGovernor(accountId, platform) {
    const db = await getDb();
    
    // 1. Check recent failure rate (last 1 hour)
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    
    const logs = await db.collection('email_logs').find({
        accountId,
        sentAt: { $gte: oneHourAgo }
    }).toArray();
    
    if (logs.length > 50) {
        const failures = logs.filter(l => l.type === 'error' || l.status === 'failed').length;
        const failureRate = failures / logs.length;
        
        if (failureRate > 0.4) { // 40% failure rate
            await logSystemEvent('CRITICAL', 'safety-governor', `Account ${accountId} suspended due to high failure rate (${(failureRate * 100).toFixed(1)}%)`, { accountId, platform });
            
            // Auto-pause account
            await db.collection('email_accounts').updateOne(
                { _id: accountId },
                { $set: { status: 'Paused', pauseReason: 'High Failure Rate' } }
            );
            return { safe: false, reason: "High failure rate detected" };
        }
    }
    
    return { safe: true };
}
