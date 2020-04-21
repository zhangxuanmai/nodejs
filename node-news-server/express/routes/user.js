var express = require('express');
var router = express.Router();
const { login, getList } = require('../controller/user');
const { SuccessModel, ErrorModel } = require('../model/index');

/* GET home page. */
router.get('/list', function (req, res, next) {
  if(!req.session.username) {
    res.json(new ErrorModel('未登录'))
    return
  }

  const keywords = req.query.keywords || ''
  const author = req.session.username
  getList(keywords, author).then(data => {
    res.json(new SuccessModel(data))
  })
})

router.get('/login-out', function (req, res, next) {
  res.json({ message: 'login-out' })
});

router.get('/login-test', function (req, res, next) {
  if (req.session.username) {
    res.json({
      error: 0,
      message: '测试登录通过（已登录）'
    })
    return
  }
  res.json({
    error: -1,
    message: '测试登录失败（未登录）'
  })
})

router.post('/login', function (req, res, next) {
  const { username, password } = req.body
  const result = login(username, password)
  return result.then(data => {
    if (data.username) {
      req.session.username = data.username
      res.json(new SuccessModel(data, '登录成功'))
      return
    }
    res.json(new ErrorModel(data, '登录失败, 账号密码有误请核对！'))

  })
});

module.exports = router;
