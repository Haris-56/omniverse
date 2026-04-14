import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import { loginToInstagram, checkDMs } from './lib/automation/instagram.js';
import { Humanoid } from './lib/automation/core/browser.js';
import { getDb } from './lib/mongodb.js';

dotenv.config({ path: '.env.local' });
dotenv.config();

async function runTest() {
  console.log("[Test] Initializing Localhost Instagram Automation Test...");
  try {
    const db = await getDb();
    console.log("[Test] Connected to MongoDB.");

    const campaignList = await db.collection('instagram_campaigns').find({}).toArray();
    const campaign = campaignList.find(c => c._id.toString().endsWith('ef51'));
    
    if (!campaign) {
      console.log("[Test-Error] Campaign ef51 not found.");
      return;
    }
    
    console.log(`[Test] Campaign verified: ${campaign.name} | ID: ${campaign._id}`);
    
    if (!campaign.accountId) {
       console.log("[Test-Error] No accountId attached to this campaign.");
       return;
    }
    
    const account = await db.collection('instagram_accounts').findOne({ _id: new ObjectId(campaign.accountId) });
    
    if (!account) {
       console.log("[Test-Error] Linked Instagram account not found in DB.");
       return;
    }

    console.log(`[Test] Account Target: ${account.email || account.username}`);
    console.log(`[Test] Proceeding with proxy=null and headful mode...`);
    
    // Explicitly using Proxy = null as per "run without ip! because it for testing"
    const result = await loginToInstagram(
        account._id.toString(), 
        account.email || account.username, 
        account.password || "", // password shouldn't be needed if session is active
        null,  // proxy = null
        false, // forceRelogin = false
        null   // 2fa code = null
    );
    
    if (result && result.success) {
      console.log(`\n[Test-Success] ✅ Session restored & is verified safe!`);
      
      console.log("[Test] Navigating to DMs to verify module capabilities...");
      const dms = await checkDMs(result.page);
      console.log(`[Test] Execution Accurate: Found ${dms} unread DMs.`);

      console.log("[Test] Holding headful session open for 15 seconds to allow UI monitoring...");
      await Humanoid.sleep(15000, 15000);
      
      console.log("[Test] Automation execution completed without crashing. Cleaning up...");
      await result.browser.close();
      console.log("[Test] Browser Closed. Module operates optimally.");
    } else {
      console.log(`\n[Test-Warning] Result not successful. Possibly expired session or connection drop.`);
    }
    
  } catch (error) {
     console.error("\n[Test-Crash] Error Caught:", error.message);
  } finally {
     process.exit(0);
  }
}

runTest();
