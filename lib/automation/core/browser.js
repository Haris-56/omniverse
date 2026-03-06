import { addExtra } from 'playwright-extra';
import { chromium as playwrightChromium } from 'playwright';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

const chromium = addExtra(playwrightChromium);
chromium.use(StealthPlugin());

// Global registry to persist browser sessions across API calls (for 2FA/Confirmations)
// Note: In local development, this persists in the node process memory.
if (!global.browserSessions) {
  global.browserSessions = new Map();
}

export const BrowserSessionManager = {
  get: (id) => {
    const session = global.browserSessions.get(id.toString());
    if (session) {
        session.lastActivity = Date.now();
    }
    return session;
  },
  set: (id, session) => global.browserSessions.set(id.toString(), { ...session, lastActivity: Date.now() }),
  delete: (id) => {
    const session = global.browserSessions.get(id.toString());
    if (session && session.browser) {
      session.browser.close().catch(() => {});
    }
    global.browserSessions.delete(id.toString());
  },
  cleanup: () => {
    // Optional: Auto-close sessions older than 10 minutes
    const now = Date.now();
    for (const [id, session] of global.browserSessions.entries()) {
      if (now - session.lastActivity > 600000) {
        BrowserSessionManager.delete(id);
      }
    }
  }
};

export async function launchBrowser(proxy = null, headless = false) {
  const browser = await chromium.launch({
    headless: headless, // User requested non-headless for now
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
    ],
    proxy: proxy ? {
      server: `${proxy.host}:${proxy.port}`,
      username: proxy.username,
      password: proxy.password
    } : undefined
  });
  
  return browser;
}

export async function getBrowserContext(proxy = null) {
  // Always non-headless for user monitoring as requested
  const browser = await launchBrowser(proxy, false); 
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  ];
  
  const context = await browser.newContext({
      userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
      viewport: { width: 1280, height: 720 + Math.floor(Math.random() * 100) },
      deviceScaleFactor: 1,
  });
  context.setDefaultTimeout(60000);
  context.setDefaultNavigationTimeout(60000);
  return { browser, context };
}

export const Humanoid = {
  sleep: (min, max) => {
      const ms = Math.floor(Math.random() * (max - min + 1) + min);
      return new Promise(resolve => setTimeout(resolve, ms));
  },
  type: async (page, selector, text) => {
      try {
        await page.hover(selector);
        await page.click(selector);
        
        // Human-like typing with occasional typos
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            
            // 10% chance of typo
            if (Math.random() < 0.10 && i > 0) {
                const chars = "abcdefghijklmnopqrstuvwxyz";
                const typoChar = chars.charAt(Math.floor(Math.random() * chars.length));
                console.log(`[Humanoid] Simulating typo: '${typoChar}' instead of '${char}'`);
                await page.keyboard.type(typoChar, { delay: Math.random() * 100 + 50 });
                await new Promise(r => setTimeout(r, Math.random() * 500 + 300)); // Pause after typo
                await page.keyboard.press('Backspace', { delay: Math.random() * 50 + 50 });
                await new Promise(r => setTimeout(r, Math.random() * 400 + 200)); // Pause before correcting
            }

            await page.keyboard.type(char, { delay: Math.random() * 150 + 100 });
            
            // Random micro-pauses
            if (Math.random() < 0.15) {
                await new Promise(r => setTimeout(r, Math.random() * 500 + 100));
            }
        }
      } catch (e) {
          // Fallback to standard fill if typing fails
          await page.fill(selector, text);
      }
  }
};
