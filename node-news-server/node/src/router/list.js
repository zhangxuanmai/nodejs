const {
  getList,
  getDetail,
  insertNew,
  updateNew,
  deleteNew,
} = require('../controller/list');
const { SuccessModel, ErrorModel } = require('../model/index');


// 统一登录验证
const loginCheck = (req) => {
  if (!req.session.username) {
    return Promise.resolve(new ErrorModel('尚未登录'))
  }
}


const handleListRouter = (req, res) => {
  const method = req.method
  const path = req.path

  if (method === 'GET' && path === '/api/list/all') {
    const keywords = req.query.keywords || ''
    const result = getList(keywords)
    return result.then(data => {
      return new SuccessModel(data)
    })
  }

  if (method === 'GET' && path === '/api/list/detail') {
    const result = getDetail(req.query.id || '')
    return result.then(data => {
      return new SuccessModel(data)
    })
  }

  if (method === 'POST' && path === '/api/list/insert') {
    // 登录验证
    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) {
      return loginCheckResult
    }

    req.body.author = req.session.username
    const result = insertNew(req.body)
    return result.then(data => {
      return new SuccessModel(data, '新增成功')
    })
  }

  if (method === 'POST' && path === '/api/list/update') {
    // 登录验证
    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) {
      return loginCheckResult
    }

    const result = updateNew(req.body)
    return result.then((data) => {
      return data ? new SuccessModel(data) : new ErrorModel(data)
    })
  }

  if (method === 'POST' && path === '/api/list/delete') {
    // 登录验证
    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) {
      return loginCheckResult
    }

    const id = req.query.id || ''
    const result = deleteNew(id)
    return result.then((data) => {
      return data ? new SuccessModel(data, '删除成功') : new ErrorModel(data, '删除失败')
    })
  }
}

module.exports = handleListRouter

