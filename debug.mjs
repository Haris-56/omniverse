import { MongoClient } from 'mongodb';
const uri = 'mongodb+srv://harisbinahson_db_user:R9Ta4kr72tMJR1Kr@cluster0.u63xw9f.mongodb.net/?appName=Cluster0';

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('omniverse');
    
    // Find campaign by Name "28 FEB Test | edit on 31 mar"
    const campaign = await db.collection('email_campaigns').findOne({ name: { $regex: '28 FEB Test' } });
    if (!campaign) {
      console.log('Campaign not found.');
      return;
    }
    
    console.log('--- CAMPAIGN ---');
    console.log('Name:', campaign.name);
    console.log('Status:', campaign.status);
    console.log('Next Run At:', campaign.nextRunAt);
    console.log('Hours:', campaign.hours, 'Timezone:', campaign.timezone);
    console.log('Daily Limit:', campaign.dailyLimit || campaign.settings?.dailyLimit);
    
    // Check accounts
    console.log('Account IDs:', campaign.accountIds || campaign.accountId);

    // Check logs
    const logs = await db.collection('email_logs').find({ campaignId: campaign._id }).sort({ sentAt: -1 }).limit(5).toArray();
    console.log('\n--- RECENT LOGS ---', logs.length);
    console.log(logs.map(l => ({ status: l.status, error: l.error, sentAt: l.sentAt })));

    // Check progress
    const progress = await db.collection('campaign_progress').find({ campaignId: campaign._id }).toArray();
    console.log('\n--- PROGRESS STATS ---');
    console.log('Total Contacts:', progress.length);
    const statuses = {};
    progress.forEach(p => statuses[p.status] = (statuses[p.status] || 0) + 1);
    console.log('Statuses:', statuses);

  } catch(e) {
    console.error(e);
  } finally {
    await client.close();
  }
}
run();
