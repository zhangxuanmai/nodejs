var express = require('express');
var router = express.Router();
const {
  getList,
  getDetail,
  insertNew,
  updateNew,
  deleteNew,
} = require('../controller/list');
const {
  SuccessModel,
  ErrorModel
} = require('../model/index');
const loginCheck = require('../middleleware/login-check');

/* GET home page. */
router.get('/list', function (req, res, next) {
  const keywords = req.query.keywords || ''
  getList(keywords).then(data => {
    res.json(new SuccessModel(data))
  })
});

router.get('/detail', function (req, res, next) {
  const result = getDetail(req.query.id || '')
  result.then(data => {
    res.json(new SuccessModel(data))
  })
});

router.post('/insert', loginCheck, function (req, res, next) {
  req.body.author = req.session.username
  const result = insertNew(req.body)
  result.then(data => {
    res.json(new SuccessModel(data, '新增成功'))
  })
});

router.post('/update', loginCheck, function (req, res, next) {
  const result = updateNew(req.body)
  result.then((data) => {
    if (data) {
      res.json(new SuccessModel('新增成功'))
    } else {
      res.json(new ErrorModel('新增失败'))
    }
  })
});

router.post('/delete', loginCheck, function (req, res, next) {
  const id = req.query.id || ''
  const result = deleteNew(id)
  result.then((data) => {
    if (data) {
      res.json(new SuccessModel('删除成功'))
    } else {
      res.json(new ErrorModel('删除失败'))
    }
  })
});

module.exports = router;
