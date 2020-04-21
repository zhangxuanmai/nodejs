const getPostData = (req) => {
  const promise = new Promise((resolve, reject) => {
    if (req.method !== 'POST') {
      resolve({})
      return
    }

    if (req.headers['content-type'] !== 'application/json') {
      resolve({})
      return
    }

    if (req.method === 'POST') {
      let postData = ''
      req.on('data', chunk => {
        postData += chunk.toString()
      })
      req.on('end', () => {
        if(!postData) {
          resolve({})
        } else {
          resolve(JSON.parse(postData))
        }
      })
    }
  })
  return promise
}

module.exports = getPostData
