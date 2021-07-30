const fs = require('fs')

const userService = require('../service/user.service')
const { APP_HOST, APP_PORT } = require('../app/config')
const {AVATAR_PATH, PICTURE_PATH} =require('../constant/file-path')

class UserController {
    async create(ctx, next) {
        const user = ctx.request.body

        const result = await userService.create(user)
        ctx.body = result;
    }

    async avatarInfo(ctx, next) {
        let { userId, filename } = ctx.params;

        const result = await userService.getUserAvatarById(userId)

        const avatarInfo = result.find(avatar => filename == avatar.filename)

        ctx.response.set('content-type', avatarInfo.mimetype)
        ctx.body = fs.createReadStream(`${AVATAR_PATH}/${avatarInfo.filename}`)
    }

    async avatarList(ctx, next) {
        const userId = ctx.user.id
        let result = await userService.getUserAvatarById(userId)
        
        //处理返回图片地址
        result = result.map(avatar => {
            return `${APP_HOST}:${APP_PORT}/user/${userId}/avatar/${avatar.filename}`
        })

        ctx.body = result
    }
}

module.exports = new UserController()