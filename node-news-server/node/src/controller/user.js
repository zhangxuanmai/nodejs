const { exec } = require('../db/mysql');

const login = (data) => {
  const { username, password } = data
  const sql = `select * from db_user where username='${username}' and password='${password}'`

  return exec(sql).then(rows => {
    return rows[0] || {}
  })
}

const getList = (keywords, author) => {
  let sql = `select * from db_list where 1=1 and author='${author}'`
  if (keywords) {
    sql += `and title like '%${keywords}%'`
  }
  sql += `order by createtime desc`
  return exec(sql)
}

module.exports = {
  login,
  getList,
}
