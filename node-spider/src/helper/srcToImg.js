const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const {promisify} = require('util');
const writeFile = promisify(fs.writeFile);

module.exports = async ( src , dir) => {
  if(/\.(jpg|png|git)$/.test(src)){
    await urlToImg(src, dir);
  }
  else{
    await base64ToImg(src, dir);
  }
}

/* url => image */
const urlToImg = promisify((url, dir, callback) => {
  const mod = /^https/.test(url) ? https : http;
  const ext = path.extname(url);
  const file = path.join(dir,`url${Date.now() - parseInt(Math.random() * 100)}${ext}`);

  mod.get(url, res => {
    res.pipe(fs.createWriteStream(file))
      .on('finish', ()=>{
        callback();
        console.log(file);
      })
  })
})

/* base64 => image */
const base64ToImg =async function (base64Str, dir) {
  //data:image/jpeg:base64,/sssss
  const matches = base64Str.match(/^data:(.+?);base64,(.+)$/);
  try {
    const ext = matches[1].split('/')[1].replace('jpeg', 'jpg');
    const file = path.join(dir, `base64${Date.now() - parseInt(Math.random() * 100)}.${ext}`);
    await writeFile(file, matches[2], 'base64');
  } catch (error) {
    console.log('非法 base64字符串')
  }
}