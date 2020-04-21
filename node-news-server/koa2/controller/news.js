const { exec } = require('../db/mysql');
const dayjs = require('dayjs');

const getList = async (keywords) => {
  let sql = `select * from db_list where 1=1 `
  if (keywords) {
    sql += `and (title like '%${keywords}%' or author like '%${keywords}%')`
  }
  sql += `order by createtime desc`

  const res = await exec(sql)
  return res
}

const getDetail = async (id) => {
  const sql = `select * from db_list where id='${id}'`
  const rows = await exec(sql)
  return rows[0]
}

const insertNew = async (data = {}) => {
  const createtime = dayjs().format('YYYY-MM-DD hh:mm:ss')
  const { title = '默认标题', content = '默认内容', author = '默认作者' } = data
  const sql = `insert into db_list(title, content, author, createtime) values ('${title}','${content}','${author}','${createtime}')`

  const res = await exec(sql)
  return { id: res.insertId }
}

const updateNew = async (data = {}) => {
  const createtime = dayjs().format('YYYY-MM-DD hh:mm:ss')
  const { id, title = '默认标题', content = '默认内容' } = data
  const sql = `update db_list set title='${title}', content='${content}', createtime='${createtime}' where id='${id}'`

  const res = await exec(sql)
  return res
}

const deleteNew = async (id) => {
  const sql = `delete from db_list where id='${id}'`
  const res = await exec(sql)
  return res
}



module.exports = {
  getList,
  getDetail,
  insertNew,
  updateNew,
  deleteNew
};

