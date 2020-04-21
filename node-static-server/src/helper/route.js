const HandleBars = require('handlebars')
const path       = require('path')
const fs         = require('fs')
const promisify  = require('util').promisify
const stat       = promisify(fs.stat)
const readdir    = promisify(fs.readdir)
const mime       = require('./mime')
const compress   = require('./compress')
const range      = require('./range')
const isFresh    = require('./cache');

const tplPath = path.join(__dirname, '../template/dir.tpl')
const source = fs.readFileSync(tplPath)
const template = HandleBars.compile(source.toString())

module.exports = async function (req, res, filePath, config) {
	try {
		const stats = await stat(filePath)
		if (stats.isFile()) {
			// 设置返回文件格式 Content-Type
			const contentType = mime(filePath)
			res.setHeader('Content-Type', contentType)

			// 判断是否需要走缓存
			if (isFresh(stats, req, res)) {
				res.statusCode = 304
				res.end()
				return
			}

			// 判断是否需要部分返回
			let rs
			const { code, start, end } = range(stats.size, req, res)
			if (code === 200) {
				res.statusCode = 200
				rs = fs.createReadStream(filePath)
			} else {
				res.statusCode = 216
				rs = fs.createReadStream(filePath, { start, end })
			}

			// 判断文件是否需要压缩
			if (filePath.match(config.compress)) {
				rs = compress(rs, req, res)
			}

			rs.pipe(res)
		}
		else if (stats.isDirectory()) {
			const files = await readdir(filePath)

			res.statusCode = 200
			res.setHeader('Content-Type', 'text/html')

			const dir = path.relative(config.root, filePath)
			const data = {
				title: path.basename(filePath),
				dir: dir ? `/${dir}` : '',
				files: files.map(file => {
					return {
						file,
						icon: mime(file)
					}
				})
			}
			res.end(template(data))
		}
	} catch (error) {
		res.statusCode = 400
		res.setHeader('Content-Type', 'text/plain')
		res.end(`${filePath} is not found!`)
	}
} 