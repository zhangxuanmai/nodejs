# Node.js 从零开发 web server 新闻项目

node 新闻系统实例（包含前后端两块，以及使用框架的重构）。

前端页面分为：

* 用户登录
* 首页新闻列表
* 首页新闻详情
* 后台管理列表
* 后台新增新闻
* 后台新闻编辑

服务端部分相关内容有：

* node
* session 和 redis
* mysql
* nginx
* pm2

## 启动项目

第一步，先进入相应目录安装依赖(此处以node目录和html目录为例，下同)：

```bash
yarn install
```

第二步，在 node 和 html 目录下分别运行：

```bash
yarn dev
```

第三步，在浏览器中访问 localhost:8080 预览项目。

## 注意项

由于浏览器的同源策略限制，项目中做了 nginx 反向代理相关配置：

```bash
location / {
  proxy_pass        http://localhost:8001;
}

location /api/ {
  proxy_pass        http://localhost:8000;
  proxy_set_header  Host  $host;
}
```

具体配置可以根据自己的需求，对本地的 nginx 进行调整。