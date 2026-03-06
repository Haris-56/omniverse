
import { addExtra } from 'playwright-extra';
import playwright from 'playwright';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import path from 'path';
import fs from 'fs';

const chromium = addExtra(playwright.chromium);
chromium.use(StealthPlugin());

const BASE_PROFILE_DIR = path.join(process.cwd(), '.browser-profiles');

// Ensure base dir exists
if (!fs.existsSync(BASE_PROFILE_DIR)) {
    fs.mkdirSync(BASE_PROFILE_DIR, { recursive: true });
}

export class BrowserManager {
    static async getContext(accountId, platform, proxy = null) {
        const userDataDir = path.join(BASE_PROFILE_DIR, `${platform}-${accountId}`);
        
        const args = [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-blink-features=AutomationControlled',
            '--disable-infobars',
            '--window-position=0,0',
            '--ignore-certificate-errors',
            '--ignore-certificate-errors-spki-list',
        ];

        const proxyConfig = proxy ? {
            server: `${proxy.protocol || 'http'}://${proxy.host}:${proxy.port}`,
            username: proxy.username,
            password: proxy.password
        } : undefined;

        console.log(`[BrowserManager] Launching persistent context for ${accountId} (${platform})...`);

        try {
            const context = await chromium.launchPersistentContext(userDataDir, {
                headless: false, // Explicitly headful as per instructions
                proxy: proxyConfig,
                args: args,
                viewport: { width: 1280, height: 800 },
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', // Should be dynamic per capsule in future
            });
            
            // Default timeout
            context.setDefaultTimeout(45000);
            return context;
        } catch (error) {
            console.error(`[BrowserManager] Failed to launch context: ${error.message}`);
            throw error;
        }
    }
}

export const Humanoid = {
    sleep: (min, max) => {
        const ms = Math.floor(Math.random() * (max - min + 1) + min);
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    
    // Human-like typing
    type: async (page, selector, text) => {
        try {
            await page.focus(selector);
            for (const char of text) {
                await page.keyboard.type(char, { delay: Math.random() * 100 + 50 });
                if (Math.random() < 0.05) await Humanoid.sleep(100, 300); // Micro pause
            }
        } catch (e) {
            console.warn(`[Humanoid] Typing fallback used for ${selector}`);
            await page.fill(selector, text);
        }
    },

    // Human-like scrolling
    scroll: async (page) => {
        await page.evaluate(async () => {
             await new Promise((resolve) => {
                 let totalHeight = 0;
                 const distance = 100;
                 const timer = setInterval(() => {
                     const scrollHeight = document.body.scrollHeight;
                     window.scrollBy(0, distance);
                     totalHeight += distance;
                     if(totalHeight >= scrollHeight / 2 || Math.random() > 0.9){ // Scroll half or stop randomly
                         clearInterval(timer);
                         resolve();
                     }
                 }, 100);
             });
        });
    }
};
