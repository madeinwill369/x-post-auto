const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();

  // Load OpenRouter cookies
  const openRouterCookies = JSON.parse(fs.readFileSync('openrouter_cookies.json', 'utf8'));
  await page.setCookie(...openRouterCookies);

  await page.goto('https://openrouter.ai/chat/ThisRoom', { waitUntil: 'networkidle2' });

  // Wait for input and type "hi"
  await page.waitForSelector('textarea');
  await page.type('textarea', 'hi');
  await page.keyboard.press('Enter');

  // Wait for response (adjust timeout as needed)
  await page.waitForSelector('.markdown.prose', { timeout: 30000 });

  // Extract the response text
  const response = await page.$eval('.markdown.prose', el => el.innerText);

  // Load X (Twitter) cookies
  const xCookies = JSON.parse(fs.readFileSync('x_cookies.json', 'utf8'));
  await page.setCookie(...xCookies);

  await page.goto('https://twitter.com/compose/tweet', { waitUntil: 'networkidle2' });

  // Wait for tweet box and post
  await page.waitForSelector('div[aria-label="Tweet text"]', { timeout: 10000 });
  await page.type('div[aria-label="Tweet text"]', response);
  await page.keyboard.press('Meta'); // Meta + Enter doesn't submit; you'll need to click
  await page.click('div[data-testid="tweetButtonInline"]');

  await browser.close();
})();