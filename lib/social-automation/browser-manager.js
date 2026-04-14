
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
            '--use-fake-ui-for-media-stream',
            '--use-fake-device-for-media-stream',
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
                permissions: ['microphone'],
            });
            
            // Map fake Mouse Visualizer universally across the browser so the User can physically watch the Bot!
            await context.addInitScript(() => {
                document.addEventListener('DOMContentLoaded', () => {
                    if (document.getElementById('playwright-mouse-helper')) return;
                    const box = document.createElement('div');
                    box.id = 'playwright-mouse-helper';
                    box.style.position = 'fixed';
                    box.style.top = '0';
                    box.style.left = '0';
                    box.style.width = '15px';
                    box.style.height = '15px';
                    box.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
                    box.style.border = '2px solid white';
                    box.style.borderRadius = '50%';
                    box.style.zIndex = '2147483647';
                    box.style.pointerEvents = 'none'; // CRITICAL: ensures clicks pass directly through the visualizer
                    box.style.transform = 'translate(-50%, -50%)';
                    box.style.transition = 'top 0.05s ease-out, left 0.05s ease-out, background-color 0.2s';
                    document.body.appendChild(box);
                    
                    document.addEventListener('mousemove', e => {
                        box.style.left = e.clientX + 'px';
                        box.style.top = e.clientY + 'px';
                    }, true);

                    document.addEventListener('mousedown', e => { box.style.backgroundColor = 'rgba(0, 255, 0, 0.9)'; }, true);
                    document.addEventListener('mouseup', e => { box.style.backgroundColor = 'rgba(255, 0, 0, 0.7)'; }, true);
                });
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
    },

    // Completely organic curved and staggered mouse wandering algorithm imitating human screen reading directly
    mouseWander: async (page, minDurationMs = 5000, maxDurationMs = 15000) => {
        try {
            const viewport = await page.viewportSize() || { width: 1280, height: 800 };
            const durationMs = Math.floor(Math.random() * (maxDurationMs - minDurationMs + 1)) + minDurationMs;
            const startTime = Date.now();
            let curX = viewport.width / 2;
            let curY = viewport.height / 2;
            
            while (Date.now() - startTime < durationMs) {
                const targetX = Math.max(10, Math.min(viewport.width - 10, curX + (Math.random() - 0.5) * 600));
                const targetY = Math.max(10, Math.min(viewport.height - 10, curY + (Math.random() - 0.5) * 500));
                
                const points = Math.floor(Math.random() * 4) + 3; // 3 to 6 micro-deviations
                for (let i = 1; i <= points; i++) {
                    const progress = i / points;
                    // Jitter creates non-vertical/non-horizontal curved deviations mathematically over steps
                    const jitterX = (Math.random() - 0.5) * 60;
                    const jitterY = (Math.random() - 0.5) * 60;
                    
                    const nextX = curX + (targetX - curX) * Math.pow(progress, 0.8) + jitterX;
                    const nextY = curY + (targetY - curY) * Math.pow(progress, 0.8) + jitterY;
                    
                    await page.mouse.move(nextX, nextY, { steps: Math.floor(Math.random() * 6) + 3 });
                    await Humanoid.sleep(20, 80);
                }
                curX = targetX;
                curY = targetY;
                
                await Humanoid.sleep(500, 3000); // pause occasionally simulating reading content
                if (Math.random() > 0.6) {
                    await page.evaluate(() => window.scrollBy({ top: (Math.random() - 0.3) * 600, behavior: 'smooth' }));
                    await Humanoid.sleep(1000, 2500);
                }
            }
        } catch(e) { }
    }
};
