const { login, getList } = require('../controller/user');
const { setRedis, getRedis, delRedis } = require('../db/redis');
const { SuccessModel, ErrorModel } = require('../model/index');

// 统一登录验证
const loginCheck = (req) => {
  if (!req.session.username) {
    return Promise.resolve(new ErrorModel('尚未登录'))
  }
}

const handleUserRouter = (req, res) => {
  const method = req.method
  const path = req.path

  if (method === 'GET' && path === '/api/user/list') {
    // 登录验证
    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) {
      return loginCheckResult
    }

    const keywords = req.query.keywords || ''
    const author = req.session.username || ''
    const result = getList(keywords, author)
    return result.then(data => {
      return new SuccessModel(data)
    })
  }

  if (method === 'POST' && path === '/api/user/login') {
    const result = login(req.body)
    return result.then(data => {
      if (data.username) {
        // 设置 session
        const userId = req.cookie.userid
        setRedis(userId, data)

        return new SuccessModel(data, '登录成功')
      } else {
        return new ErrorModel(data, '登录失败, 账号密码有误请核对！')
      }
    })
  }

  if (method === 'GET' && path === '/api/user/login-out') {
    let userId = req.cookie.userid
    delRedis(userId)
    return Promise.resolve(new ErrorModel('退出登录'))
  }

  if (method === 'GET' && req.path === '/api/user/login-check') {
    if (req.session.username) {
      return Promise.resolve(new SuccessModel({
        session: req.session
      }, '登录成功'))
    }
    return Promise.resolve(new ErrorModel('尚未登录'))
  }
}

module.exports = handleUserRouter

