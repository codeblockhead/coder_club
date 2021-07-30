const Router = require("koa-router");
const { create, list, detail,personalList, remove, modify, addLabel ,pictureInfo} = require("../controller/moment.controller");
const { verifyAuth, verifyPermission } = require("../middleware/auth.middleware")
const { verifyLabelExists} = require("../middleware/label.middleware")


const momentRouter = new Router({ prefix: '/moment' })

// 发表动态
momentRouter.post("/", verifyAuth, create)

//获取动态列表
momentRouter.get("/", list)
// 获取某个人的动态列表
momentRouter.get("/userId/:userId", personalList)
// 获取某条动态详情
momentRouter.get("/:momentId", detail)
//动态配图地址
momentRouter.get('/image/:filename',pictureInfo)


// 删除动态
momentRouter.delete("/:momentId", verifyAuth, verifyPermission('moment'), remove)

//修改动态
momentRouter.patch("/:momentId", verifyAuth, verifyPermission('moment'), modify)

//给动态添加标签
momentRouter.post("/:momentId/label",verifyAuth, verifyPermission('moment'), verifyLabelExists, addLabel)



module.exports = momentRouter;