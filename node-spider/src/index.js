const puppeteer = require('puppeteer');
const { path } = require('./config/index');
const srcToImg = require('./helper/srcToImg');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setViewport({
    width: 1000,
    height: 1000,
    deviceScaleFactor: 1,
  });

  await page.goto('https://pic.sogou.com/');
  await page.focus('#form_querytext');
  await page.keyboard.sendCharacter("狗");
  await page.evaluate(()=> {
    document.querySelector('.search-btn').click()
  });

  page.on('load', async ()=>{
    const srcs = await page.$$eval('img', imgs => {
      return imgs.map(img => img.src)
    })

    srcs.forEach((src) => {
      srcToImg(src, path);
    });
    await browser.close();
  })
})()
