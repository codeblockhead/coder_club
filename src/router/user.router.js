const Router = require("koa-router")

const { create, avatarInfo, avatarList } = require('../controller/user.controller')
const { verifyAuth } = require("../middleware/auth.middleware")
const { verifyUser, handlePassword } = require('../middleware/user.middleware')

const userRouter = new Router({ prefix: "/user" })

//注册
userRouter.post("/", verifyUser, handlePassword, create)

//头像地址
userRouter.get("/:userId/avatar/:filename", avatarInfo)

// 获取历史头像
userRouter.get("/avatarList", verifyAuth, avatarList)

module.exports = userRouter;