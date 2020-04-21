const querystring = require('querystring');
const handleListRouter = require('./src/router/list');
const handleUserRouter = require('./src/router/user');
const getPostData = require('./src/util/promise');
const { getCookieExpires } = require('./src/util/time');
const { setRedis, getRedis } = require('./src/db/redis');
const { access } = require('./src/util/log');

const SESSION_DATA = {}

async function serverHandle(req, res) {
  // 记录日志
  access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)
  // 设置内容类型
  res.setHeader('Content-Type', 'application/json')
  // 解析路由路径
  req.path = req.url.split('?')[0]
  // 解析路由参数
  req.query = querystring.parse(req.url.split('?')[1])

  // 解析 cookie
  req.cookie = {}
  const cookieStr = req.headers.cookie || ''
  cookieStr.split(';').forEach(item => {
    if (!item) return
    const arr = item.split('=')
    const key = arr[0].trim()
    const val = arr[1].trim()
    req.cookie[key] = val
  })

  // 解析 session 
  // let needSetCookie = false
  // let userId = req.cookie.userid

  // if (userId) {
  //   if (!SESSION_DATA[userId]) {
  //     SESSION_DATA[userId] = {}
  //   }
  // } else {
  //   needSetCookie = true
  //   userId = `${Date.now()}_${Math.random()}`
  //   SESSION_DATA[userId] = {}
  // }
  // req.session = SESSION_DATA[userId]

  let needSetCookie = false
  let userId = req.cookie.userid

  if (userId) {
    if (!getRedis(userId)) {
      setRedis(`${userId}`, {})
    }
  } else {
    needSetCookie = true
    userId = `test_userid_${Date.now()}`
    setRedis(`${userId}`, {})
  }

  await getRedis(userId).then(res => {
    req.session = res || {}
  })

  // 获取数据
  await getPostData(req).then(postData => {
    req.body = postData

    // 设置列表路由
    const listResult = handleListRouter(req, res)
    if (listResult) {
      listResult.then(result => {
        if (needSetCookie) {
          res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
        }
        res.end(JSON.stringify(result))
      })
      return
    }

    // 设置用户路由
    const userResult = handleUserRouter(req, res)
    if (userResult) {
      userResult.then(result => {
        if (needSetCookie) {
          res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
        }
        res.end(JSON.stringify(result))
      })
      return
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.write('404 not found')
    res.end()
  })

}

module.exports = serverHandle
