const { exec } = require('../db/mysql');
const dayjs = require('dayjs');

const getList = (keywords, author) => {
  let sql = `select * from db_list where 1=1 `
  if (keywords) {
    sql += `and (title like '%${keywords}%' or author like '%${keywords}%')`
  }
  sql += `order by createtime desc`

  return exec(sql)
}

const getDetail = (id) => {
  const sql = `select * from db_list where id='${id}'`
  return exec(sql).then(row => {
    return row[0]
  })
}

const insertNew = (data = {}) => {
  const createtime = dayjs().format('YYYY-MM-DD hh:mm:ss')
  const { title = '默认标题', content = '默认内容', author = '默认作者' } = data
  const sql = `insert into db_list(title, content, author, createtime) values ('${title}','${content}','${author}','${createtime}')`

  return exec(sql).then(res => {
    return { id: res.insertId }
  })
}

const updateNew = (data = {}) => {
  const createtime = dayjs().format('YYYY-MM-DD hh:mm:ss')

  const { id, title = '默认标题', content = '默认内容' } = data
  const sql = `update db_list set title='${title}', content='${content}', createtime='${createtime}' where id='${id}'`
  return exec(sql)
}

const deleteNew = (id) => {
  const sql = `delete from db_list where id='${id}'`
  return exec(sql)
}



module.exports = {
  getList,
  getDetail,
  insertNew,
  updateNew,
  deleteNew
};

