const fileService = require("../service/file.service")
const userService = require("../service/user.service")
const { APP_HOST, APP_PORT } = require('../app/config')

class FileController {
    async saveAvatar(ctx, next) {
        // 1.获取图像相关的信息
        const { filename, mimetype, size } = ctx.req.file
        const { id } = ctx.user

        // 2.将图像信息数据保存到数据库中
        await fileService.saveAvatarInfo(id, filename, mimetype, size)


        // 3.将图片地址保存到user表中
        const avatarUrl = `${APP_HOST}:${APP_PORT}/user/${id}/avatar/${filename}`
        await userService.updateAvatarUrlById(avatarUrl, id)

        ctx.body = `更新头像成功`
    }

    async savePicture(ctx, next) {
        const files = ctx.req.files
        const { id } = ctx.user
        const { momentId } = ctx.params
        for (const file of files) {
            const { filename, mimetype, size } = file
            await fileService.savePictureInfo(id, momentId, filename, mimetype, size)
        }
        ctx.body = '上传图片成功'
    }
}

module.exports = new FileController()

