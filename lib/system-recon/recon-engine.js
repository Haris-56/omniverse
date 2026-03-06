
import { BrowserManager, Humanoid } from '../social-automation/browser-manager.js';
import { ObjectId } from 'mongodb';

export async function runReconCycle(db) {
    console.log("[Recon] Starting cycle...");
    
    // 1. Find leads needing analysis (e.g., status: 'New')
    // We limit batch size to keep recon stealthy
    const leads = await db.collection("contacts").find({ 
        status: "New", 
        reconStatus: { $exists: false } 
    }).limit(10).toArray();

    if (leads.length === 0) {
        console.log("[Recon] No leads need analysis.");
        return;
    }

    console.log(`[Recon] Analyzing ${leads.length} leads...`);

    // 2. Get System Account (Round Robin)
    // We assume a collection 'system_accounts' exists with type: 'linkedin_recon' etc.
    // For now, if no system accounts, we skip.
    const reconAccount = await db.collection("system_accounts").findOne({ 
        type: "linkedin_recon", 
        status: "Active" 
    });

    if (!reconAccount) {
        console.log("[Recon] No active system recon accounts available.");
        return;
    }

    // 3. Launch Isolated Recon Capsule
    let context = null;
    try {
        // Use 'recon-' prefix for strict isolation from user capsules
        context = await BrowserManager.getContext(`recon-${reconAccount._id}`, 'linkedin', reconAccount.proxy);
        const page = await context.newPage();
        
        await page.goto("https://www.linkedin.com/feed/", { waitUntil: 'domcontentloaded' });
        // Assume logged in (cookie injection logic matching social-engine would go here)
        
        for (const lead of leads) {
            if (!lead.linkedinUrl) continue;
            
            console.log(`[Recon] Scanning ${lead.linkedinUrl}...`);
            await page.goto(lead.linkedinUrl);
            await Humanoid.sleep(2000, 5000);

            // Signal Extraction (Headless/Passive)
            const exists = !(await page.$('text="This profile is not available"'));
            const hasPhoto = (await page.$('.pv-top-card-profile-picture__image')) !== null;
            const bioText = await page.innerText('.text-body-medium').catch(() => "");
            
            // Dead Score Logic (Simple)
            let deadScore = 0;
            if (!exists) deadScore = 100;
            if (!hasPhoto) deadScore += 40;
            if (bioText.length < 20) deadScore += 30;

            console.log(`  -> Dead Score: ${deadScore}`);

            // Update Lead
            await db.collection("contacts").updateOne(
                { _id: lead._id },
                { $set: { 
                    reconStatus: "Analyzed", 
                    deadScore, 
                    lastReconAt: new Date() 
                }}
            );

            await Humanoid.sleep(1000, 3000); // Check next
        }

        await context.close();

    } catch (e) {
        console.error(`[Recon] Error: ${e.message}`);
        if (context) await context.close();
    }
}
