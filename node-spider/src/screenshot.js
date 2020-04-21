const puppeteer = require('puppeteer');
const { path } = require('./config/index');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://baidu.com');
  await page.screenshot({
    path: `${path}/${Date.now()}.png`
  });

  await browser.close();
})();