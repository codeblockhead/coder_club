const Router = require('koa-router')

const { saveAvatar, savePicture } = require('../controller/file.controller')
const { verifyAuth, verifyPermission } = require('../middleware/auth.middleware')
const { avatarHandle, pictureHandle,avatarResize, pictureResize } = require('../middleware/file.middleware')

const uploadRouter = new Router({ prefix: '/upload' })

// 上传头像
uploadRouter.post('/avatar', verifyAuth, avatarHandle,avatarResize, saveAvatar)

//上传动态图片
uploadRouter.post('/picture/moment/:momentId', verifyAuth, verifyPermission('moment'), pictureHandle, pictureResize, savePicture)
module.exports = uploadRouter