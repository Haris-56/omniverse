
import { getBrowserContext, Humanoid, BrowserSessionManager } from './core/browser.js';
import { encrypt, decrypt } from './security/encryption.js';
import { getDb } from '../mongodb.js';
import { ObjectId } from 'mongodb';

export async function loginToLinkedIn(accountId, username, password, proxy = null, forceRelogin = false, twoFactorCode = null) {
  const db = await getDb();
  const account = await db.collection('linkedin_accounts').findOne({ _id: new ObjectId(accountId) });

  let browser, context, page;
  
  const existingSession = BrowserSessionManager.get(accountId);
  if (existingSession && !forceRelogin) {
    console.log(`[LI:${username}] Found active session, attempting to resume...`);
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
    if (account && account.sessionData && !forceRelogin && !existingSession) {
      console.log(`[LI:${username}] Attempting session reuse...`);
      try {
        const cookies = JSON.parse(decrypt(account.sessionData));
        await context.addCookies(cookies);
        await page.goto('https://www.linkedin.com/feed/', { waitUntil: 'networkidle' });

        if (await page.$('.global-nav__me-img')) {
          console.log(`[LI:${username}] Session valid.`);
          return { browser, context, page, success: true };
        }
      } catch (err) {
        console.warn(`[LI:${username}] Failed to use session:`, err);
      }
    }

    const checkLoggedIn = async () => {
        const successSelectors = [
            '.global-nav__me-img',
            'aria-label="Primary Navigation"',
            'text="Start a post"',
            '.share-box-feed-entry__trigger'
        ];
        if (page.url().includes('linkedin.com/feed') || page.url().includes('linkedin.com/mynetwork')) {
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
        console.log(`[LI:${username}] Navigating to ${url}...`);
        await page.goto(url, { waitUntil: 'load', timeout: 60000 });
        await Humanoid.sleep(2000, 4000);
    };

    if (!existingSession) {
        console.log(`[LI:${username}] Starting full login flow...`);
        await navigateWithRetry('https://www.linkedin.com/login');
    }

    // Ultra-aggressive fallback selectors since LinkedIn varies their DOM 
    const userSelector = 'input#username, input#session_key, input[name="session_key"], input[autocomplete="username"], input[type="email"], input[name="email"], input[id*="email"], input[type="text"]';
    const passSelector = 'input#password, input#session_password, input[name="session_password"], input[type="password"]';

    if (await checkLoggedIn()) {
        console.log(`[LI:${username}] Already logged in.`);
    } else if (!existingSession) {
        try {
            console.log(`[LI:${username}] Step: Waiting for login inputs...`);
            await page.waitForSelector(userSelector, { timeout: 30000, state: 'visible' });
            
            console.log(`[LI:${username}] Step: Typing credentials...`);
            await Humanoid.type(page, userSelector, username);
            await Humanoid.sleep(800, 1500);
            await Humanoid.type(page, passSelector, password);
            await Humanoid.sleep(1000, 2000);

            console.log(`[LI:${username}] Step: Clicking submit...`);
            await page.click('button[type="submit"], button[data-id="sign-in-form__submit-btn"], button[data-litms-control-urn="login-submit"]');
            
            await Promise.race([
                page.waitForURL(/.*linkedin\.com\/(feed|mynetwork|checkpoint|challenge).*/, { waitUntil: 'load', timeout: 45000 }),
                page.waitForSelector('.error-for-password, #error-for-username, .form__label--error, [data-error="true"], p.form-element__message', { timeout: 15000 }).catch(() => null)
            ]);

            const errorMsg = await page.$eval('.error-for-password, #error-for-username, .form__label--error, [data-error="true"], p.form-element__message', el => el.innerText || el.textContent).catch(() => null);
            if (errorMsg && errorMsg.trim().length > 0) throw new Error(`LinkedIn says: ${errorMsg.trim()}`);

        } catch (e) {
            if (!await checkLoggedIn()) throw e;
        }
    }

    // Handle LinkedIn Challenges (Verification, Checkpoint)
    const isChallenge = page.url().includes('checkpoint') || page.url().includes('challenge') || (await page.$('#input__email_verification_pin'));
    
    if (isChallenge) {
      console.log(`[LI:${username}] Challenge detected: ${page.url()}`);
      
      if (twoFactorCode) {
        console.log(`[LI:${username}] Applying code: ${twoFactorCode}`);
        try {
            const codeSelector = 'input#input__email_verification_pin, input[name="pin"], input[placeholder*="code"]';
            await page.waitForSelector(codeSelector, { timeout: 15000 });
            await Humanoid.type(page, codeSelector, twoFactorCode);
            await Humanoid.sleep(1000, 2000);
            await page.click('button#email-pin-submit-button, button[type="submit"]');
            
            await page.waitForURL(url => !url.toString().includes('checkpoint'), { timeout: 30000 });
            await Humanoid.sleep(2000, 4000);
        } catch (err) {
            console.error(`[LI:${username}] 2FA entry failed:`, err.message);
        }
      } else {
        const reason = "A verification code is required to secure your LinkedIn account.";
        await db.collection('linkedin_accounts').updateOne(
          { _id: new ObjectId(accountId) },
          { $set: { status: 'Checkpoint', failureReason: reason } }
        );
        throw new Error(reason);
      }
    }

    if (await checkLoggedIn()) {
      console.log(`[LI:${username}] Login successful.`);
      const cookies = await context.cookies();
      const encryptedCookies = encrypt(JSON.stringify(cookies));

      await db.collection('linkedin_accounts').updateOne(
        { _id: new ObjectId(accountId) },
        { $set: { sessionData: encryptedCookies, status: 'Connected', lastActivity: new Date(), failureReason: null } }
      );

      BrowserSessionManager.delete(accountId);
      return { browser, context, page, success: true };
    }

    throw new Error(`Login failed. Final URL: ${page.url()}`);

  } catch (error) {
    console.error(`[LI:${username}] Error:`, error.message);
    if (!browser) throw error;

    if (error.message.includes('code') || error.message.includes('Checkpoint') || error.message.includes('verification')) {
        BrowserSessionManager.set(accountId, { browser, context, page });
        throw error;
    }

    BrowserSessionManager.delete(accountId);
    throw error;
  }
}
