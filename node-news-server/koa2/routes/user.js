const router = require('koa-router')()
const { login, getList } = require('../controller/user');
const { SuccessModel, ErrorModel } = require('../model/index');

router.prefix('/api/user')

/* GET home page. */
router.get('/list', async (ctx, next) => {
  if (!ctx.session.username) {
    ctx.body = new ErrorModel('未登录')
    return
  }

  const keywords = ctx.query.keywords || ''
  const author = ctx.session.username
  const data = await getList(keywords, author)
  ctx.body = new SuccessModel(data)
})

router.get('/login-out', async (ctx, next) => {
  ctx.body = new SuccessModel({
    error: 0,
    message: '退出登录'
  })
});

router.post('/login', async (ctx, next) => {
  const { username, password } = ctx.request.body
  const data = await login(username, password)
  if (data.username) {
    ctx.session.username = data.username
    ctx.body = new SuccessModel(data, '登录成功')
    return
  }
  ctx.body = new ErrorModel(data, '登录失败, 账号密码有误请核对！')
});

module.exports = router;
