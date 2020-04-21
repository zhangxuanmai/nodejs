# Node 常用基础模块 API 介绍

## path

path 模块提供用于处理文件路径和目录路径的实用工具。

__dirname 和 __filename 总是返回文件的绝对路径
process.cwd() 总是返回执行 node 命令所在的文件夹

- path.normalize() 路径规范化处理
- path.join() 拼接路径
- path.resolve() 相对路径处理为绝对路径
- path.dirname() 文件夹名称
- path.basename() 文件名称
- path.extname() 文件拓展名
- path.parse() 路径解析为对象
- path.format() 对象还原为路径
- path.sep() 路径分隔符
- path.delimiter() path的分隔符
- path.win32()
- path.posix()

## Buffer

Buffer 类在全局作用域中，因此无需使用 require('buffer').Buffer。它主要用于处理二进制数据流， 实例类似整数数组，大小固定。

- Buffer.alloc() 创建Buffer
- Buffer.from() 创建Buffer
- Buffer.byteLength() Buffer长度
- Buffer.isBuffer() 判断是否为Buffer
- Buffer.concat() 拼接Buffer
- Buffer.fill() 填充Buffer
- Buffer.toString() Buffer转换为字符串
- Buffer.equals() 判断两个Buffer内容是否相等
- Buffer.copy() 复制Buffer
- Buffer.indexOf()

## event

大多数 Node.js 核心 API 构建于惯用的异步事件驱动架构，其中某些类型的对象（又称触发器，Emitter）会触发命名事件来调用函数（又称监听器，Listener）。

基础使用示例：

```js
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {};
const myEmitter = new MyEmitter();

function fn1() {};
function fn2() {};

// 监听事件
myEmitter.on('event', fn1);
myEmitter.on('event', fn2);

// 触发事件
myEmitter.emit('event');
// 移除某个事件
myEmitter.removeListener('event', fn1)
// 移除全部事件
myEmitter.removeAllListeners('event')
```

## fs

fs 模块提供了一个 API，用于以模仿标准 POSIX 函数的方式与文件系统进行交互。

所有文件系统操作都具有同步和异步的形式。

异步的形式总是将完成回调作为其最后一个参数。 传给完成回调的参数取决于具体方法，但第一个参数始终预留用于异常。 如果操作成功完成，则第一个参数将为 null 或 undefined 。

使用同步的操作发生的异常会立即抛出，可以使用 try…catch 处理，也可以允许冒泡。

在繁忙的进程中，强烈建议使用这些调用的异步版本。 同步的版本将阻塞整个进程，直到它们完成（停止所有连接）。

- fs.readFile() 读取文件内容
- fs.writeFile() 写入文件内容
- fs.stat() 获取文件相关信息
- fs.rename() 修改文件名
- fs.unlink() 删除文件
- fs.readdir() 读取文件夹下所有的文件名
- fs.mkdir() 创建文件夹
- fs.rmdir() 删除文件夹
- fs.watch() 监听文件变更
- fs.createReadStream() 创建读取的文件流
- fs.createWriteStream() 创建写入的文件流
