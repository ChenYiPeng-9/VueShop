const express = require('express');
const compression = require('compression');

// 原始的创建web服务器的系统模块
const https = require('https');
// 文件读取系统模块
const fs = require('fs');
// 配置https协议所要使用的公钥和私钥
const options = {
    cert: fs.readFileSync('./full_chain.pem'),
    key: fs.readFileSync('./private.key')
}

const app = express();

// 一定要把使用 gzip 减小文件体积的设置，写在静态资源文件托管之前
// 即先进行静态资源的压缩，再去托管我们的静态资源目录
app.use(compression())
app.use(express.static('./dist'));

app.listen(80, () => {
    console.log('server running at http://127.0.0.1')
})

// https.createServer(options, app).listen(443)