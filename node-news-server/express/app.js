var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redisClient = require('./db/redis');


// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
const newsRouter = require('./routes/news');
const userRouter = require('./routes/user');

var app = express();

// view engine setup -- 前端页面模板相关操作
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// 日志记录处理
const ENV = process.env.NODE_ENV
if (ENV === 'development') {
  app.use(logger('dev'));
} else {
  // 线上环境
  const logFileName = path.join(__dirname, 'logs', 'access.log')
  const writeStream = fs.createWriteStream(logFileName, { flags: 'a' })
  app.use(logger('combined', {
    stream: writeStream
  }));
}

// JSON格式参数的请求处理（例如将post请求的json格式参数挂到req.body上）
app.use(express.json());
// 其他参数格式的请求处理
app.use(express.urlencoded({ extended: false }));
// 将cookie挂到req上便于后续访问及操作
app.use(cookieParser());
// 静态文件处理
// app.use(express.static(path.join(__dirname, 'public')));

const sessionStore = new RedisStore({
  client: redisClient
})
app.use(session({
  secret: 'WJiol_2020#_',
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  },
  store: sessionStore
}))

// 路由匹配
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/api/news', newsRouter);
app.use('/api/user', userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
