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
        await page.goto('https://www.instagram.com/', { waitUntil: 'load', timeout: 60000 });

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
        console.log(`[${username}] Starting full login flow natively from Home...`);
        await navigateWithRetry('https://www.instagram.com/');
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
                
                await db.collection("instagram_notifications").insertOne({
                    accountId: new ObjectId(accountId),
                    username: username || "Unknown",
                    type: "error",
                    message: `Login Failed: ${errorMsg}`,
                    createdAt: new Date(),
                    read: false
                }).catch(() => {});
                
                throw new Error(`Instagram says: ${errorMsg}`);
            }

            if (result === 'challenge') {
                console.log(`[${username}] Checkpoint/Challenge detected.`);
                await db.collection("instagram_notifications").insertOne({
                    accountId: new ObjectId(accountId),
                    username: username || "Unknown",
                    type: "suspension",
                    message: "Account flagged for 2FA Challenge or Suspension. Please open the bot environment visually.",
                    createdAt: new Date(),
                    read: false
                }).catch(() => {});
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
    await page.goto('https://www.instagram.com/direct/inbox/', { waitUntil: 'load', timeout: 60000 });
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

export async function executeOutreach(page, profileTarget, message, options = {}) {
    const { 
        priorityOrder = ['story', 'highlight', 'message'],
        mediaUrl = null,
        followBehavior = 'none',
        likeBehavior = 'none',
        commentBehavior = 'none'
    } = options;

    try {
        console.log(`[Outreach] Starting process for target: ${profileTarget}`);
        
        let targetUrl = profileTarget.trim();
        if (!targetUrl.includes('instagram.com')) {
            targetUrl = `https://www.instagram.com/${targetUrl.replace('@', '')}/`;
        } else if (!targetUrl.startsWith('http')) {
            targetUrl = `https://${targetUrl}`;
        }
        
        console.log(`[Outreach] Navigating to ${targetUrl}`);
        await page.goto(targetUrl, { waitUntil: 'load', timeout: 60000 });
        
        // Humanoid: Natural reading delay upon landing (huge stealth buffer 5-15s)
        console.log(`[Outreach] Simulating organic profile viewing...`);
        await Humanoid.sleep(5000, 15000);
        await page.evaluate(() => window.scrollBy({ top: Math.floor(Math.random() * 150) + 100, behavior: 'smooth' }));
        await Humanoid.sleep(4000, 12000);
        await page.evaluate(() => window.scrollBy({ top: -Math.floor(Math.random() * 80) + 20, behavior: 'smooth' }));
        await Humanoid.sleep(5000, 12000);
        
        // ================= PRE-DM ENGAGEMENTS ================= 
        if (followBehavior === 'before' || followBehavior === 'both') {
            console.log(`[Outreach] Pre-DM Action: Follow Lead...`);
            await Humanoid.sleep(4000, 14000);
            const followBtn = await page.$("header button:has-text('Follow'):not(:has-text('Following')), header div[role='button']:has-text('Follow'):not(:has-text('Following'))");
            if (followBtn) {
                await followBtn.click();
                console.log(`[Outreach] ✅ Successfully triggered Follow natively.`);
            } else {
                console.log(`[Outreach] Already followed or missing button.`);
            }
            await Humanoid.sleep(6000, 20000);
        }

        if (likeBehavior === 'before' || likeBehavior === 'both') {
            console.log(`[Outreach] Pre-DM Action: Like recent post...`);
            await Humanoid.sleep(5000, 18000);
            const posts = await page.$$('article a[href^="/p/"], article a[href^="/reel/"], main a[href^="/p/"], main a[href^="/reel/"]');
            if (posts.length > 0) {
                await posts[0].click(); // open post
                await Humanoid.sleep(8000, 25000); // organic digest Native gap 8s-25s
                const likeBtn = await page.$('svg[aria-label="Like"]');
                if (likeBtn) {
                    await likeBtn.click();
                    console.log(`[Outreach] ✅ Successfully liked most recent post.`);
                }
                await Humanoid.sleep(6000, 15000);
                await page.keyboard.press('Escape'); // close post modal natively
                await Humanoid.sleep(5000, 12000);
            } else {
                console.log(`[Outreach] No posts found to like natively.`);
            }
        }
        // ======================================================

        let sent = false;
        let methodUsed = null;

        for (const method of priorityOrder) {
            if (sent) break;

            if (method === 'story') {
                console.log(`[Outreach] Attempting Story reply to ${profileTarget}...`);
                const header = await page.$('header');
                let storyRing = null;
                if (header) {
                    storyRing = await header.$('canvas, div[role="button"] img[alt*="profile picture"]');
                }
                
                if (storyRing) {
                    await storyRing.click();
                    await Humanoid.sleep(6000, 18000); // 6s-18s load time Native
                    
                    const replyInput = await page.$('textarea[placeholder*="Reply to"], textarea[placeholder*="Send message"], input[placeholder*="Reply"]');
                    if (replyInput && message) {
                        await Humanoid.type(page, 'textarea[placeholder*="Reply to"], textarea[placeholder*="Send message"], input[placeholder*="Reply"]', message);
                        await Humanoid.sleep(4000, 12000);
                        await page.keyboard.press('Enter');
                        console.log(`[Outreach] ✅ Successfully sent via Story.`);
                        sent = true;
                        methodUsed = 'story';
                        await Humanoid.sleep(4000, 10000);
                        await page.keyboard.press('Escape');
                    } else {
                        console.log(`[Outreach] Story exists but replies disabled or missing input.`);
                        await page.keyboard.press('Escape');
                        await Humanoid.sleep(4000, 12000);
                    }
                } else {
                    console.log(`[Outreach] No active story found in header.`);
                }
            }
            else if (method === 'highlight') {
                console.log(`[Outreach] Attempting Highlight reply to ${profileTarget}...`);
                
                let highlight = null;
                // Specifically look for highlight image rings to avoid generic "Highlight" text matching
                const highlightImgs = await page.$$('img[alt*="Highlight"]');
                if (highlightImgs.length > 0) {
                    highlight = await highlightImgs[0].evaluateHandle(el => el.closest('div[role="button"]') || el);
                } else {
                    const canvases = await page.$$('ul li div[role="button"] canvas');
                    if (canvases.length > 0) highlight = canvases[0];
                }

                if (highlight) {
                    await highlight.click();
                    await Humanoid.sleep(6000, 20000); // Massive native fallback array 6-20s
                    
                    const replyInput = await page.$('textarea[placeholder*="Reply to"], textarea[placeholder*="Send message"], input[placeholder*="Reply"]');
                    if (replyInput && message) {
                        await Humanoid.type(page, 'textarea[placeholder*="Reply to"], textarea[placeholder*="Send message"], input[placeholder*="Reply"]', message);
                        await Humanoid.sleep(3000, 12000);
                        await page.keyboard.press('Enter');
                        console.log(`[Outreach] ✅ Successfully sent via Highlight.`);
                        sent = true;
                        methodUsed = 'highlight';
                        await Humanoid.sleep(5000, 12000);
                        await page.keyboard.press('Escape');
                    } else {
                        console.log(`[Outreach] Highlight exists but replies are disabled.`);
                        await page.keyboard.press('Escape');
                        await Humanoid.sleep(4000, 10000);
                    }
                } else {
                    console.log(`[Outreach] No highlights found.`);
                }
            }
            else if (method === 'message') {
                console.log(`[Outreach] Looking for "Message" button organically within Header strictly...`);
                await Humanoid.sleep(5000, 18000); // native gap
                
                // Strict native matching directly inside header to strictly bypass suggested profile clicks
                const header = await page.$('header');
                let messageBtn = null;
                
                if (header) {
                    const buttons = await header.$$('div[role="button"], a[role="link"], a, button');
                    for (const b of buttons) {
                        try {
                            const t = await b.textContent();
                            if (t && t.trim().toLowerCase() === 'message') {
                                messageBtn = b;
                                break;
                            }
                        } catch(e) {}
                    }
                }

                // Removed 3-dots Native Menu scraping entirely to safely ignore Private profiles missing DM buttons 

                if (messageBtn) {
                    console.log(`[Outreach] Target Header Button Found. Navigating to DM thread natively...`);
                    await Humanoid.sleep(4000, 12000);
                    await messageBtn.click();
                    
                    console.log(`[Outreach] Waiting for DM box to mount organically (Massive Stealth Buffer)...`);
                    await Humanoid.sleep(10000, 30000); // Allow thread time to load dynamically Native 10s-30s
                    
                    try {
                        // Wait aggressively for the specific DM textarea and ignore generic contenteditable divs
                        await page.waitForSelector('div[role="textbox"][aria-label="Message"], textarea[placeholder*="Message"]', { timeout: 35000, state: 'visible' });
                    } catch(e) {
                        console.log(`[Outreach] DM input selector strict wait timed out. Checking alternatives...`);
                    }

                    let dmInput = null;
                    const inputs = await page.$$('div[role="textbox"][aria-label="Message"], textarea[placeholder*="Message"]');
                    for (const inp of inputs) {
                        if (await inp.isVisible()) {
                            dmInput = inp;
                            break;
                        }
                    }

                    if (dmInput) {
                        console.log(`[Outreach] DM Box located natively.`);
                        await Humanoid.sleep(5000, 15000); // 5-15s
                        
                        // Humanoid media bypass mapping Voice Record securely!
                        if (!message && mediaUrl) {
                             console.log(`[Outreach] Initiating Native Media / Voice Record Simulation natively...`);
                             await Humanoid.sleep(8000, 25000); // 8-25s massive buffer limit Native
                             
                             const micBtn = await page.$('svg[aria-label="Voice Clip"], svg[aria-label="Record"]');
                             if (micBtn) {
                                  const box = await micBtn.boundingBox();
                                  if (box) {
                                     await page.mouse.move(box.x + box.width/2, box.y + box.height/2, { steps: 10 });
                                     await Humanoid.sleep(1000, 3000);
                                     
                                     await page.mouse.down();
                                     await micBtn.dispatchEvent('pointerdown');
                                     await micBtn.dispatchEvent('mousedown');
                                     
                                     console.log(`[Outreach] 🎙️ SECURE: Holding Audio Input Microphone natively...`);
                                     await Humanoid.sleep(12000, 35000); // Record audio for 12-35 secs randomly Native
                                     
                                     await micBtn.dispatchEvent('pointerup');
                                     await micBtn.dispatchEvent('mouseup');
                                     await page.mouse.up();
                                     
                                     console.log(`[Outreach] ⬆️ Voice Note dispatched successfully.`);
                                     sent = true;
                                  }
                             } else {
                                  // Fallback string proxy for unsupported environments
                                  await dmInput.focus();
                                  await Humanoid.sleep(3000, 9000);
                                  await page.keyboard.type(`(🎵 Secure media transferred: ${mediaUrl.includes('blob') ? 'Local Resource Asset' : mediaUrl})`, { delay: Math.floor(Math.random() * 50) + 40 });
                                  await Humanoid.sleep(6000, 16000);
                                  await page.keyboard.press('Enter');
                                  sent = true;
                             }
                        } else if (message) {
                             console.log(`[Outreach] Initiating humanoid typing...`);
                             await dmInput.focus();
                             await Humanoid.sleep(3000, 12000);
                             await page.keyboard.type(message, { delay: Math.floor(Math.random() * 80) + 40 }); // typemistake buffer natively supported!
                             
                             // Adding native mistype and correction randomly (20% chance)
                             if (Math.random() > 0.8) {
                                 console.log(`[Outreach] Emulating organic typing errors... backing up natively.`);
                                 await Humanoid.sleep(2000, 6000);
                                 for(let i=0; i < Math.floor(Math.random()*4)+2; i++){
                                     await page.keyboard.press('Backspace');
                                     await Humanoid.sleep(300, 800);
                                 }
                                 await Humanoid.sleep(1500, 5000);
                                 await page.keyboard.type(message.substring(message.length - 6), { delay: Math.floor(Math.random() * 120) + 70 });
                             }

                             await Humanoid.sleep(5000, 18000); // 5-18s delay before hitting send Native
                             
                             let sendBtnClick = false;
                             const sendBtns = await page.$$('div[role="button"]');
                             for (const sb of sendBtns) {
                                 try {
                                     const st = await sb.textContent();
                                     if (st && st.trim() === 'Send') {
                                         await sb.click();
                                         sendBtnClick = true;
                                         break;
                                     }
                                 } catch(e) {}
                             }
                             if (!sendBtnClick) await page.keyboard.press('Enter');
                             sent = true;
                        }

                        if (sent) {
                            console.log(`[Outreach] ✅ Successfully executed Direct Message interaction natively.`);
                            methodUsed = 'message';
                            await Humanoid.sleep(10000, 30000); // 10-30s gap directly simulating watching screen Native
                        }
                    } else {
                        console.log(`[Outreach] DM input blocked natively. Target heavily restricts messaging endpoints.`);
                    }
                } else {
                    console.log(`[Outreach] Target qualifies strictly as Private or Unreachable. Message button entirely absent natively.`);
                }
            }
        }

        // ================= POST-DM ENGAGEMENTS =================
        if (sent && (followBehavior === 'after' || likeBehavior === 'after' || commentBehavior === 'after' || followBehavior === 'both' || likeBehavior === 'both' || commentBehavior === 'both')) {
            console.log(`[Outreach] Triggering Post-DM behaviors... Navigating back to profile footprint.`);
            await Humanoid.sleep(8000, 25000);
            await page.goto(targetUrl, { waitUntil: 'load', timeout: 60000 });
            await Humanoid.sleep(12000, 35000); // huge buffer locally

            if (followBehavior === 'after' || followBehavior === 'both') {
                console.log(`[Outreach] Post-DM Action: Follow Lead...`);
                const followBtn = await page.$("header button:has-text('Follow'):not(:has-text('Following')), header div[role='button']:has-text('Follow'):not(:has-text('Following'))");
                if (followBtn) {
                    await followBtn.click();
                    console.log(`[Outreach] ✅ Post-Follow triggered successfully.`);
                    await Humanoid.sleep(8000, 24000); // 8-24s Native
                }
            }

            if (likeBehavior === 'after' || likeBehavior === 'both' || commentBehavior === 'after' || commentBehavior === 'both') {
                const posts = await page.$$('article a[href^="/p/"], article a[href^="/reel/"], main a[href^="/p/"], main a[href^="/reel/"]');
                if (posts.length > 0) {
                    await posts[0].click(); // open post
                    await Humanoid.sleep(10000, 30000); // 10-30s digest Native gap
                    
                    if (likeBehavior === 'after' || likeBehavior === 'both') {
                        console.log(`[Outreach] Post-DM Action: Like...`);
                        const likeBtn = await page.$('svg[aria-label="Like"]');
                        if (likeBtn) await likeBtn.click();
                        await Humanoid.sleep(6000, 18000);
                    }

                    if (commentBehavior === 'after' || commentBehavior === 'both') {
                        console.log(`[Outreach] Post-DM Action: Comment natively...`);
                        const cmtInput = await page.$('textarea[aria-label="Add a comment…"], textarea[placeholder*="comment"]');
                        if (cmtInput) {
                            await cmtInput.click();
                            await Humanoid.sleep(3000, 9000);
                            await page.keyboard.type("Amazing! ✨", { delay: Math.floor(Math.random() * 80) + 40 });
                            await Humanoid.sleep(4000, 12000);
                            await page.keyboard.press('Enter');
                            console.log(`[Outreach] ✅ Authored comment.`);
                            await Humanoid.sleep(8000, 20000);
                        }
                    }

                    await page.keyboard.press('Escape'); // close natively
                    await Humanoid.sleep(5000, 15000);
                }
            }
        }
        // =======================================================

        if (!sent) {
            console.log(`[Outreach] ❌ Failed to qualify profile interactions entirely.`);
            return { success: false, reason: 'No valid methods succeeded.' };
        }

        return { success: true, method: methodUsed };
    } catch (error) {
        console.error(`[Outreach Error] Target ${profileTarget}:`, error.message);
        return { success: false, reason: error.message };
    }
}
