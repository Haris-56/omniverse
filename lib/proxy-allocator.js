
import { getDb } from './mongodb';
import { ObjectId } from 'mongodb';

export async function getAssignedProxy(userId, platform) {
  const db = await getDb();
  
  // Normalize platform key
  const serviceKey = platform.toLowerCase(); // 'instagram', 'facebook', 'linkedin', 'email'

  // 1. Check if user already has an assigned proxy that has capacity for this service
  // Rule: 1 IP supports 1 IG + 1 FB + 1 LI + 1 Email
  const existingProxy = await db.collection('system_proxies').findOne({
    assignedTo: userId,
    [`usage.${serviceKey}`]: { $lt: 1 } // Only if usage is 0 for this service
  });

  if (existingProxy) {
    // Increment usage
    await db.collection('system_proxies').updateOne(
        { _id: existingProxy._id },
        { $inc: { [`usage.${serviceKey}`]: 1 } }
    );
    return existingProxy;
  }
  
  // 2. If no suitable existing proxy, find a fresh unassigned residential proxy
  const newProxy = await db.collection('system_proxies').findOneAndUpdate(
    { assignedTo: null, type: 'residential', status: 'active' },
    { 
      $set: { 
        assignedTo: userId,
        [`usage.${serviceKey}`]: 1,
        assignedAt: new Date(),
        updatedAt: new Date()
      }
    },
    { returnDocument: 'after' }
  );
  
  if (newProxy) return newProxy;
  
  // 3. Fallback: Try shared datadenter proxies if residential run out
  const sharedProxy = await db.collection('system_proxies').findOneAndUpdate(
    { assignedTo: null, type: 'shared', status: 'active' },
    { 
      $set: { 
        assignedTo: userId,
        [`usage.${serviceKey}`]: 1,
        assignedAt: new Date(),
        updatedAt: new Date()
      }
    },
    { returnDocument: 'after' }
  );
  
  if (sharedProxy) return sharedProxy;

  // 4. Critical: No proxies available - TEMPORARILY BYPASSED FOR LOCAL TESTING
  console.log("No available proxies in the system pool. Bypassing proxy requirement for local testing.");
  return null;
}

export async function releaseProxyUsage(proxyId, platform) {
    if (!proxyId) return;
    const db = await getDb();
    const serviceKey = platform.toLowerCase();
    
    await db.collection('system_proxies').updateOne(
        { _id: new ObjectId(proxyId) },
        { 
            $inc: { [`usage.${serviceKey}`]: -1 },
            $set: { updatedAt: new Date() }
        }
    );
    
    // Optional: If usage is 0 for all services, unassign user? 
    // Usually better to keep IP sticky for the user to maintain trust score.
}
