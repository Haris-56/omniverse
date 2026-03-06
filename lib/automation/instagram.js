import { getBrowserContext, Humanoid, BrowserSessionManager } from './core/browser.js';
import { encrypt, decrypt } from './security/encryption.js';
import { getDb } from '../mongodb.js';
import { ObjectId } from 'mongodb';

export async function loginToInstagram(accountId, username, password, proxy = null, forceRelogin = false, twoFactorCode = null) {
  const db = await getDb();
  const account = await db.collection('instagram_accounts').findOne({ _id: new ObjectId(accountId) });

  let browser, context, page;
  
  // Check for an active session (for 2FA/Confirmation)
  const existingSession = BrowserSessionManager.get(accountId);
  if (existingSession && !forceRelogin) {
    console.log(`[${username}] Found active session, attempting to resume...`);
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
    if (account && account.sessionData && !forceRelogin) {
      console.log(`[${username}] Attempting session reuse...`);
      try {
        const cookies = JSON.parse(decrypt(account.sessionData));
        await context.addCookies(cookies);
        await page.goto('https://www.instagram.com/', { waitUntil: 'networkidle' });

        // Check if still logged in
        if (await page.$('svg[aria-label="New Post"]') || await page.$('svg[aria-label="Direct Messages"]')) {
          console.log(`[${username}] Session valid.`);
          return { browser, context, page, success: true };
        }
        console.log(`[${username}] Session expired.`);
      } catch (err) {
        console.warn(`[${username}] Failed to decrypt/use session:`, err);
      }
    }

    // Full Login Flow
    console.log(`[${username}] Starting full login flow...`);
    
    const checkLoggedIn = async () => {
        const successSelectors = [
            'svg[aria-label="New Post"]',
            'svg[aria-label="Direct Messages"]',
            'img[data-testid="user-avatar"]',
            'div[role="button"] img[alt*="profile picture"]',
            'text="Home"',
            'text="Not Now"',
            'text="Save Info"',
            'svg[aria-label="Home"]',
            'svg[aria-label="Explore"]',
            'svg[aria-label="Reels"]'
        ];
        if (page.url().includes('onetap')) {
            console.log(`[${username}] URL indicates onetap session.`);
            return true;
        }
        if (page.url() === 'https://www.instagram.com/' || page.url() === 'https://www.instagram.com') {
            // Give it a bit more time to render UI if at home
            await Humanoid.sleep(2000, 3000);
        }
        for (const sel of successSelectors) {
            try {
               const found = await page.$(sel);
               if (found && await found.isVisible()) {
                   console.log(`[${username}] Success indicator found: ${sel}`);
                   return true;
               }
            } catch (e) {}
        }
        return false;
    };

    const navigateWithRetry = async (url) => {
        console.log(`[${username}] Navigating to ${url}...`);
        await page.goto(url, { waitUntil: 'load', timeout: 60000 });
        await Humanoid.sleep(3000, 5000);
        
        // Repeatedly check for different forms of cookie consent
        const cookieSelectors = [
            'button:has-text("Allow all cookies")',
            'button:has-text("Allow")',
            'button:has-text("Accept")',
            'button:has-text("Decline optional cookies")',
            'button:has-text("Only allow essential cookies")',
            '[aria-label="Allow all cookies"]',
            'div[role="dialog"] button:has-text("Allow all cookies")'
        ];

        for (const sel of cookieSelectors) {
            try {
                const btn = await page.$(sel);
                if (btn && await btn.isVisible()) {
                    console.log(`[${username}] Clicking cookie button: ${sel}`);
                    await btn.click({ timeout: 5000 }).catch(() => {});
                    await Humanoid.sleep(2000, 3000);
                    break;
                }
            } catch (e) {}
        }
    };

    // Full Login Flow
    if (!existingSession) {
        console.log(`[${username}] Starting full login flow...`);
        await navigateWithRetry('https://www.instagram.com/accounts/login/');
    } else {
        console.log(`[${username}] Resuming at URL: ${page.url()}`);
    }

    const userSelector = 'input[name="username"], input[name="email"], input[autocomplete="username"]';
    const passSelector = 'input[name="password"], input[name="pass"], input[type="password"]';

    // 1. Check if already logged in (session reuse or automatic recognized)
    if (await checkLoggedIn()) {
        console.log(`[${username}] Already logged in.`);
    } else if (!existingSession) {
        // 2. Fallback if redirected to landing
        if (!await page.$(userSelector)) {
            console.log(`[${username}] Login inputs not found directly. Checking for "Log in" button...`);
            const loginLink = await page.$('a[href*="/accounts/login/"], button:has-text("Log in")');
            if (loginLink) {
                console.log(`[${username}] Clicking found "Log in" link/button...`);
                await loginLink.click();
                await Humanoid.sleep(3000, 5000);
            } else {
                console.log(`[${username}] No "Log in" button found either. Page state: ${page.url()}`);
            }
        }

        // 3. Attempt typing if inputs are present
        try {
            console.log(`[${username}] Step: Waiting for login inputs (30s)...`);
            
            await page.waitForSelector(userSelector, { timeout: 30000, state: 'visible' });
            
            console.log(`[${username}] Step: Typing username...`);
            const userField = await page.$(userSelector);
            await Humanoid.type(page, userSelector, username);
            await Humanoid.sleep(1000, 2000);

            console.log(`[${username}] Step: Typing password...`);
            await Humanoid.type(page, passSelector, password);
            await Humanoid.sleep(1000, 2000);

            console.log(`[${username}] Step: Clicking submit...`);
            const submitSelector = 'button[type="submit"], div[role="button"]:has-text("Log in"), button:has-text("Log In")';
            await page.click(submitSelector);
            
            // Wait for navigation and indicators
            console.log(`[${username}] Waiting for dashboard...`);
            
            const result = await Promise.race([
                // Success Indicators
                page.waitForSelector('svg[aria-label="Home"], svg[aria-label="New Post"], svg[aria-label="Direct Messages"]', { timeout: 45000 }).then(() => 'success'),
                page.waitForURL(url => url.toString().includes('instagram.com') && !url.toString().includes('login'), { timeout: 45000 }).then(() => 'success'),
                // Error Indicators
                page.waitForSelector('p[id="slfErrorAlert"]', { timeout: 20000 }).then(() => 'error'),
                page.waitForSelector('p[role="alert"]', { timeout: 20000 }).then(() => 'error'),
                // Challenge Indicators
                page.waitForURL(/.*challenge.*/, { timeout: 30000 }).then(() => 'challenge'),
                page.waitForURL(/.*checkpoint.*/, { timeout: 30000 }).then(() => 'challenge'),
                page.waitForURL(/.*two_factor.*/, { timeout: 30000 }).then(() => 'challenge')
            ]);

            if (result === 'error') {
                const errorMsg = await page.$eval('p[role="alert"], p[id="slfErrorAlert"]', el => el.innerText).catch(() => "Unknown login error");
                throw new Error(`Instagram says: ${errorMsg}`);
            }

            if (result === 'challenge') {
                console.log(`[${username}] Checkpoint/Challenge detected.`);
            }

        } catch (e) {
            // Re-check success one last time before failing
            if (!await checkLoggedIn()) {
                const url = page.url();
                console.error(`[${username}] Login failed. Reason: ${e.message}. URL: ${url}`);
                const fileName = `login-fail-${username}-${Date.now()}.png`;
                await page.screenshot({ path: `public/${fileName}`, fullPage: true });
                throw new Error(e.message || `Login inputs not found or interaction failed. Screenshot saved: ${fileName}`);
            }
        }
    }

    // Handle Challenge/Checkpoint
    const isChallenge = page.url().includes('challenge') || page.url().includes('checkpoint') || page.url().includes('two_factor');
    
    if (isChallenge) {
      console.log(`[${username}] Challenge screen detected: ${page.url()}`);
      
      // 1. Handle 2FA/Security Code if provided
      if (twoFactorCode) {
        console.log(`[${username}] Attempting to apply provided code: ${twoFactorCode}`);
        try {
            const twoFactorSelector = 'input[name="verificationCode"], input[aria-label="Security Code"], input[placeholder*="Code"], input[id*="verification"]';
            await page.waitForSelector(twoFactorSelector, { timeout: 15000 });
            await Humanoid.type(page, twoFactorSelector, twoFactorCode);
            await Humanoid.sleep(1000, 2000);
            
            const confirmBtn = 'button:has-text("Confirm"), button:has-text("Done"), button:has-text("Submit"), button:has-text("Next")';
            await page.click(confirmBtn);
            
            // Wait for navigation after code entry
            console.log(`[${username}] Code submitted, waiting for redirect...`);
            await Promise.race([
                page.waitForURL(url => !url.toString().includes('challenge') && !url.toString().includes('two_factor'), { timeout: 30000 }),
                page.waitForSelector('p[role="alert"], div:has-text("invalid"), div:has-text("wrong")', { timeout: 10000 }).catch(() => null)
            ]);
        } catch (twoFactorError) {
            console.error(`[${username}] Error during 2FA entry:`, twoFactorError.message);
        }
      } 
      
      // 2. Check for App-Based Confirmation (e.g., "Confirm on your phone")
      const appConfirmSelectors = [
          'text="Check your Instagram app"',
          'text="Confirm on your device"',
          'text="Approve this session"',
          'text="Is this you?"'
      ];
      
      let isAppBased = false;
      for (const sel of appConfirmSelectors) {
          if (await page.$(sel)) {
              isAppBased = true;
              break;
          }
      }

      // 3. Final Re-verification Loop (Give user time if app-based)
      console.log(`[${username}] Entering final verification loop...`);
      for (let attempt = 1; attempt <= 10; attempt++) {
          if (await checkLoggedIn()) {
              console.log(`[${username}] Success! Logged in after challenge.`);
              break;
          }
          
          if (attempt === 1 && !twoFactorCode) {
              const reason = isAppBased ? "Please approve the login request in your Instagram/Facebook app." : "A security code is required.";
              const status = isAppBased ? "AppConfirmation" : "Checkpoint";
              
              await db.collection('instagram_accounts').updateOne(
                { _id: new ObjectId(accountId) },
                { $set: { status: status, failureReason: reason } }
              );
              
              throw new Error(reason);
          }
          
          console.log(`[${username}] Waiting for confirmation (Attempt ${attempt}/10)...`);
          await Humanoid.sleep(10000, 15000); // Wait 10-15s per check
      }
    }

    // Post-Login Handling (Not Now / Save Info)
    console.log(`[${username}] Handling post-login popups...`);
    for (let i = 0; i < 3; i++) {
        const notNowBtn = await page.$('button:has-text("Not Now"), div[role="button"]:has-text("Not Now")');
        if (notNowBtn && await notNowBtn.isVisible()) {
            console.log(`[${username}] Clicking "Not Now"...`);
            await notNowBtn.click();
            await Humanoid.sleep(2000, 3000);
        }
        const saveInfoBtn = await page.$('button:has-text("Save Info"), div[role="button"]:has-text("Save Info")');
        if (saveInfoBtn && await saveInfoBtn.isVisible()) {
            console.log(`[${username}] Clicking "Save Info"...`);
            await saveInfoBtn.click();
            await Humanoid.sleep(2000, 3000);
        }
    }

    // Final Success Verification
    if (await checkLoggedIn()) {
      console.log(`[${username}] Login confirmed.`);
      const cookies = await context.cookies();
      const encryptedCookies = encrypt(JSON.stringify(cookies));

      await db.collection('instagram_accounts').updateOne(
        { _id: new ObjectId(accountId) },
        { 
          $set: { 
            sessionData: encryptedCookies, 
            status: 'Connected', 
            lastActivity: new Date(),
            failureReason: null
          } 
        }
      );

      // Successfully connected -> Remove from manager
      BrowserSessionManager.delete(accountId);

      return { browser, context, page, success: true };
    }

    const currentUrl = page.url();
    console.error(`[${username}] Final check failed. URL: ${currentUrl}`);
    throw new Error(`Login failed for unknown reason. Final URL: ${currentUrl}`);

  } catch (error) {
    console.error(`[${username}] Automation Error:`, error.message);
    if (!browser) return;
    
    // If it's a checkpoint, save the session and leave browser open
    if (error.message.includes('approve') || error.message.includes('Checkpoint') || error.message.includes('code')) {
        console.log(`[${username}] Saving session for 2FA...`);
        BrowserSessionManager.set(accountId, { browser, context, page });
        throw error;
    }

    // Otherwise, cleanup
    BrowserSessionManager.delete(accountId);
    throw error;
  }
}

export async function checkDMs(page) {
  try {
    await page.goto('https://www.instagram.com/direct/inbox/', { waitUntil: 'networkidle' });
    await Humanoid.sleep(3000, 5000);

    const unreadCount = await page.$$eval('div[role="button"]', buttons => {
        return buttons.filter(b => b.innerText.includes('New message') || b.querySelector('[aria-label="Unread"]')).length;
    });

    return unreadCount;
  } catch (error) {
    console.error('Error checking DMs:', error);
    return 0;
  }
}
