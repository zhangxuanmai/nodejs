const { exec } = require('../db/mysql');

const login = async (username, password) => {
  const sql = `select * from db_user where username='${username}' and password='${password}'`
  const rows = await exec(sql)
  return rows[0] || {}
}

const getList = async (keywords, author) => {
  let sql = `select * from db_list where 1=1 and author='${author}'`
  if (keywords) {
    sql += `and title like '%${keywords}%'`
  }
  sql += `order by createtime desc`
  const res = await exec(sql)
  return res
}

module.exports = {
  login,
  getList,
}
