import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';
import { Humanoid } from '../social-automation/browser-manager.js';

let cachedActions = null;

export const loadCSVActions = async () => {
    if (cachedActions) return cachedActions;
    
    return new Promise((resolve, reject) => {
        const results = [];
        const csvPath = path.join(process.cwd(), 'instructions', 'instagram-actions.csv');
        
        if (!fs.existsSync(csvPath)) {
            resolve([]);
            return;
        }

        fs.createReadStream(csvPath)
            .pipe(csvParser())
            .on('data', (data) => {
                if (data.prob && parseFloat(data.prob) > 0) {
                    results.push({
                        ...data,
                        prob: parseFloat(data.prob),
                        timeRange: data.time.split('-').map(n => parseInt(n)) // [min, max]
                    });
                }
            })
            .on('end', () => {
                cachedActions = results;
                resolve(results);
            })
            .on('error', reject);
    });
};

export const pickRandomAction = (actions) => {
    const totalProb = actions.reduce((sum, action) => sum + action.prob, 0);
    let random = Math.random() * totalProb;
    
    for (const action of actions) {
        if (random < action.prob) return action;
        random -= action.prob;
    }
    return actions[0];
};

export const executeWarmingAction = async (page) => {
    try {
        const actions = await loadCSVActions();
        if (!actions.length) {
            console.log(`[CSV Engine] No actions loaded. Performing generic generic wander.`);
            await Humanoid.mouseWander(page, 20000, 60000);
            return;
        }

        const actionObj = pickRandomAction(actions);
        const minTimeMs = (actionObj.timeRange[0] || 10) * 1000;
        const maxTimeMs = (actionObj.timeRange[1] || 40) * 1000;
        
        console.log(`[CSV Engine] executing native block [${actionObj.action1} -> ${actionObj.action2} -> ${actionObj.action3}] dynamically...`);
        
        // Map abstract commands loosely to native organic blocks
        if (actionObj.action1.includes('explore')) {
            await page.goto('https://www.instagram.com/explore/', { waitUntil: 'load' }).catch(()=>{});
        } else if (actionObj.action1.includes('feed') || actionObj.action1.includes('idle')) {
            await page.goto('https://www.instagram.com/', { waitUntil: 'load' }).catch(()=>{});
        } else if (actionObj.action1.includes('reels') || actionObj.action1.includes('video')) {
            await page.goto('https://www.instagram.com/reels/', { waitUntil: 'load' }).catch(()=>{});
        }

        await Humanoid.mouseWander(page, minTimeMs, maxTimeMs);
        
        console.log(`[CSV Engine] ✅ CSV execution complete.`);
    } catch(e) {
        console.error(`[CSV Engine] Error:`, e.message);
    }
};
