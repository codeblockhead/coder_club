const Router = require("koa-router")
const { verifyAuth, verifyPermission } = require('../middleware/auth.middleware')
const { create, reply, remove, list } = require('../controller/comment.controller')

const commentRouter = new Router({ prefix: '/comment' })

//发布评论
commentRouter.post('/', verifyAuth, create)

// 回复评论
commentRouter.post('/:commentId/reply', verifyAuth, reply)

// 删除评论
commentRouter.delete('/:commentId', verifyAuth, verifyPermission('comment'), remove)

//获取评论
commentRouter.get('/', list)
module.exports = commentRouter