const mysql = require('mysql')
const { MYSQL_CONFIG } = require('../config/db')

// 创建链接
const con = mysql.createConnection(MYSQL_CONFIG)

// 开始链接
con.connect()

function exec(sql) {
  const promise = new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      if (err) {
        reject(err)
      }
      resolve(result)
    })
  })

  return promise
}

module.exports = {
  exec,
}