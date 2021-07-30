const Koa = require("koa")

const useRoutes = require('../router/index')
const bodyParser = require("koa-bodyparser")
const handleErr = require('./err-handle')

const app = new Koa()

app.useRoutes =useRoutes

app.use(bodyParser())
app.useRoutes()

// 接收错误
app.on("error", handleErr)


module.exports = app