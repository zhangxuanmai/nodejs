const { createDeflate, createGzip } = require('zlib');
module.exports = (rs, req, res) => {
    const acceptEncoding = req.headers['accept-encoding']
    if(!acceptEncoding || !acceptEncoding.match(/(gzip|deflate)/)) {
        return rs
    }
    else if(acceptEncoding.match(/(gzip)/)) {
        res.setHeader('Content-Encoding', 'gzip')
        return rs.pipe(createGzip())
    }
    else if(acceptEncoding.match(/(deflate)/)) {
        res.setHeader(acceptEncoding, 'Content-Encoding', 'deflate')
        return rs.pipe(createDeflate())
    }
}

