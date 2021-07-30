const Router = require("koa-router");
const { create, list } = require("../controller/label.controller");
const { verifyAuth } = require("../middleware/auth.middleware");
const { verifyLabelExists } = require("../middleware/label.middleware");


const labelRouter = new Router({ prefix: '/label' })

labelRouter.post('/', verifyAuth, verifyLabelExists, create)
labelRouter.get('/', list)

module.exports = labelRouter