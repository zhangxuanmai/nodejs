const router = require('koa-router')()
const {
  getList,
  getDetail,
  insertNew,
  updateNew,
  deleteNew,
} = require('../controller/news');
const {
  SuccessModel,
  ErrorModel
} = require('../model/index');
const loginCheck = require('../middleleware/login-check');

router.prefix('/api/news')

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

/* GET home page. */
router.get('/list', async (ctx, next) => {
  const keywords = ctx.query.keywords || ''
  const data = await getList(keywords)
  ctx.body = new SuccessModel(data)
});

router.get('/detail', async (ctx, next) => {
  const data = await getDetail(ctx.query.id || '')
  ctx.body = new SuccessModel(data)
});

router.post('/insert', loginCheck, async (ctx, next) => {
  ctx.request.body.author = ctx.session.username
  const data = await insertNew(ctx.request.body)
  ctx.body = new SuccessModel(data, '新建成功')
});

router.post('/update', loginCheck, async (ctx, next) => {
  const data = await updateNew(ctx.request.body)
  if (data) {
    ctx.body = new SuccessModel('更新成功')
  } else {
    ctx.body = new SuccessModel('更新失败')
  }
});

router.post('/delete', loginCheck, async (ctx, next) => {
  const id = ctx.query.id || ''
  const data = await deleteNew(id)
  if (data) {
    ctx.body = new SuccessModel('删除成功')
  } else {
    ctx.body = new SuccessModel('删除失败')
  }
});

module.exports = router;
