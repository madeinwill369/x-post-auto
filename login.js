const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Step 1: Twitter
  await page.goto('https://twitter.com/login');
  console.log("⚠️ Log in to Twitter (X). You have 90 seconds...");
  await new Promise(resolve => setTimeout(resolve, 90000));

  const xCookies = await page.cookies();
  const xLocalStorage = await page.evaluate(() => {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      data[key] = localStorage.getItem(key);
    }
    return data;
  });
  fs.writeFileSync('x_cookies.json', JSON.stringify(xCookies, null, 2));
  fs.writeFileSync('x_localStorage.json', JSON.stringify(xLocalStorage, null, 2));
  console.log("✅ X session saved.");

  // Step 2: OpenRouter
  const openRouter = await browser.newPage();
  await openRouter.goto('https://openrouter.ai/chat');
  console.log("⚠️ Log in to OpenRouter. You have 90 seconds...");
  await new Promise(resolve => setTimeout(resolve, 90000));

  const orCookies = await openRouter.cookies();
  const orLocalStorage = await openRouter.evaluate(() => {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      data[key] = localStorage.getItem(key);
    }
    return data;
  });
  fs.writeFileSync('openrouter_cookies.json', JSON.stringify(orCookies, null, 2));
  fs.writeFileSync('openrouter_localStorage.json', JSON.stringify(orLocalStorage, null, 2));
  console.log("✅ OpenRouter session saved.");

  await browser.close();
})();