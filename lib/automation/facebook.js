
import { getBrowserContext, Humanoid, BrowserSessionManager } from './core/browser.js';
import { encrypt, decrypt } from './security/encryption.js';
import { getDb } from '../mongodb.js';
import { ObjectId } from 'mongodb';

export async function loginToFacebook(accountId, username, password, proxy = null, forceRelogin = false, twoFactorCode = null) {
  const db = await getDb();
  const account = await db.collection('facebook_accounts').findOne({ _id: new ObjectId(accountId) });

  let browser, context, page;
  
  // Check for an active session (for 2FA/Confirmation)
  const existingSession = BrowserSessionManager.get(accountId);
  if (existingSession && !forceRelogin) {
    console.log(`[FB:${username}] Found active session, attempting to resume...`);
    browser = existingSession.browser;
    context = existingSession.context;
    page = existingSession.page;
  } else {
    const session = await getBrowserContext(proxy);
    browser = session.browser;
    context = session.context;
    page = await context.newPage();
  }

  try {
    // Attempt to load existing cookies
    if (account && account.sessionData && !forceRelogin && !existingSession) {
      console.log(`[FB:${username}] Attempting session reuse...`);
      try {
        const cookies = JSON.parse(decrypt(account.sessionData));
        await context.addCookies(cookies);
        await page.goto('https://www.facebook.com/', { waitUntil: 'networkidle' });

        // Check if still logged in
        if (await page.$('aria-label="Facebook"')) {
          console.log(`[FB:${username}] Session valid.`);
          return { browser, context, page, success: true };
        }
      } catch (err) {
        console.warn(`[FB:${username}] Failed to use session:`, err);
      }
    }

    const checkLoggedIn = async () => {
        const successSelectors = [
            '[aria-label="Facebook"]',
            '[aria-label="Watch"]',
            '[aria-label="Marketplace"]',
            'img[alt*="profile"]',
            'text="What\'s on your mind?"'
        ];
        if (page.url().includes('facebook.com/home.php') || page.url().endsWith('.com/') || page.url().endsWith('.com')) {
            // Home page check
            for (const sel of successSelectors) {
                try {
                    const found = await page.$(sel);
                    if (found && await found.isVisible()) return true;
                } catch (e) {}
            }
        }
        return false;
    };

    const navigateWithRetry = async (url) => {
        console.log(`[FB:${username}] Navigating to ${url}...`);
        await page.goto(url, { waitUntil: 'load', timeout: 60000 });
        await Humanoid.sleep(2000, 4000);
        
        // Handle cookie consent if any
        const cookieBtns = ['button[data-testid="cookie-policy-manage-dialog-accept-button"]', 'button:has-text("Allow all cookies")', 'button:has-text("Accept All")'];
        for (const sel of cookieBtns) {
            try {
                const btn = await page.$(sel);
                if (btn && await btn.isVisible()) {
                    await btn.click();
                    await Humanoid.sleep(1000, 2000);
                    break;
                }
            } catch (e) {}
        }
    };

    // Full Login Flow
    if (!existingSession) {
        console.log(`[FB:${username}] Starting full login flow...`);
        await navigateWithRetry('https://www.facebook.com/login/');
    }

    const userSelector = 'input#email, input[name="email"]';
    const passSelector = 'input#pass, input[name="pass"]';

    if (await checkLoggedIn()) {
        console.log(`[FB:${username}] Already logged in.`);
    } else if (!existingSession) {
        // Attempt typing if inputs are present
        try {
            console.log(`[FB:${username}] Step: Waiting for login inputs...`);
            await page.waitForSelector(userSelector, { timeout: 30000, state: 'visible' });
            
            console.log(`[FB:${username}] Step: Typing credentials...`);
            await Humanoid.type(page, userSelector, username);
            await Humanoid.sleep(800, 1500);
            await Humanoid.type(page, passSelector, password);
            await Humanoid.sleep(1000, 2000);

            console.log(`[FB:${username}] Step: Clicking submit...`);
            await page.click('button[name="login"], button[type="submit"]');
            
            // Wait for navigation OR an error message
            await Promise.race([
                page.waitForURL(/.*facebook\.com.*/, { waitUntil: 'load', timeout: 45000 }),
                page.waitForSelector('.alert, [role="alert"]', { timeout: 20000 }).catch(() => null)
            ]);

            const errorMsg = await page.$eval('[role="alert"], #error_box', el => el.innerText).catch(() => null);
            if (errorMsg && (errorMsg.includes('incorrect') || errorMsg.includes('wrong'))) {
                throw new Error(`Facebook says: ${errorMsg}`);
            }

        } catch (e) {
            if (!await checkLoggedIn()) {
                throw e;
            }
        }
    }

    // Handle Challenge/Checkpoint
    const isChallenge = page.url().includes('checkpoint') || page.url().includes('approval') || page.url().includes('security');
    
    if (isChallenge) {
      console.log(`[FB:${username}] Challenge detected: ${page.url()}`);
      
      if (twoFactorCode) {
        console.log(`[FB:${username}] Applying code: ${twoFactorCode}`);
        try {
            const codeSelector = 'input#approvals_code, input[name="approvals_code"], input[type="text"]';
            await page.waitForSelector(codeSelector, { timeout: 15000 });
            await Humanoid.type(page, codeSelector, twoFactorCode);
            await Humanoid.sleep(1000, 2000);
            await page.click('button#checkpointSubmitButton, button:has-text("Continue"), button:has-text("Submit")');
            
            await page.waitForURL(url => !url.toString().includes('checkpoint'), { timeout: 30000 });
            await Humanoid.sleep(2000, 4000);
        } catch (err) {
            console.error(`[FB:${username}] 2FA entry failed:`, err.message);
        }
      } else {
        const isAppBased = (await page.content()).includes('approve');
        const reason = isAppBased ? "Please approve the login on your Facebook app." : "A security code is required.";
        const status = isAppBased ? "AppConfirmation" : "Checkpoint";
        
        await db.collection('facebook_accounts').updateOne(
          { _id: new ObjectId(accountId) },
          { $set: { status, failureReason: reason } }
        );
        throw new Error(reason);
      }
    }

    // Final Success Verification
    if (await checkLoggedIn()) {
      console.log(`[FB:${username}] Login successful.`);
      const cookies = await context.cookies();
      const encryptedCookies = encrypt(JSON.stringify(cookies));

      await db.collection('facebook_accounts').updateOne(
        { _id: new ObjectId(accountId) },
        { $set: { sessionData: encryptedCookies, status: 'Connected', lastActivity: new Date(), failureReason: null } }
      );

      BrowserSessionManager.delete(accountId);
      return { browser, context, page, success: true };
    }

    throw new Error(`Login failed. Current URL: ${page.url()}`);

  } catch (error) {
    console.error(`[FB:${username}] Error:`, error.message);
    if (!browser) throw error;

    if (error.message.includes('approve') || error.message.includes('code') || error.message.includes('Checkpoint')) {
        BrowserSessionManager.set(accountId, { browser, context, page });
        throw error;
    }

    BrowserSessionManager.delete(accountId);
    throw error;
  }
}
