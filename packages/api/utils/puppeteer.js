const puppeteer = require('puppeteer');

module.exports = puppeteer.launch({
  ...(process.env.PUPPETEER_BROWSER_PATH && {
    executablePath: process.env.PUPPETEER_BROWSER_PATH,
  }),
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-web-security',
  ],
  ...(process.env.DEBUG && { headless: false, devtools: true }),
});
