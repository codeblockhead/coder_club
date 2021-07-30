const fs = require('fs')
const { PICTURE_PATH } = require('../constant/file-path')

const momentService = require('../service/moment.service')

class MomentController {
    async create(ctx, next) {
        const { content } = ctx.request.body
        if (!content) {
            return ctx.body = "评论不能为空"
        }
        const result = await momentService.create(content, ctx.user)

        ctx.body = result
    }

    async list(ctx, next) {
        const { page, limit } = ctx.query
    
        const result = await momentService.getMomentList(page, limit)

        ctx.body = result
    }

    async personalList(ctx, next) {
        const { userId } = ctx.params
        const { page, limit } = ctx.query

        const result = await momentService.getPersonalMomentList(userId, page, limit)
        ctx.body = result
    }

    async detail(ctx, next) {
        const { momentId } = ctx.params

        const result = await momentService.getMomentDetail(momentId)

        ctx.body = result
    }
    async remove(ctx, next) {
        const { momentId } = ctx.params;

        const result = await momentService.removeMoment(momentId)
        ctx.body = result
    }

    async modify(ctx, next) {
        const { momentId } = ctx.params;
        const { content } = ctx.request.body

        const result = await momentService.modifyMoment(momentId, content)
        ctx.body = result
    }

    async addLabel(ctx, next) {
        const { momentId } = ctx.params

        const labelArr = ctx.labelArr
        for (const label of labelArr) {
            const hasLabel = await momentService.hasLabel(momentId, label.id)
            if (!hasLabel) {
                await momentService.addLabel(momentId, label.id)
            }
        }
        ctx.body = '添加成功'
    }

    async pictureInfo(ctx, next) {
        const { filename } = ctx.params
        const { type } = ctx.query
        const result = await momentService.getFileByFilename(filename)

        const typeList = ['large', 'middle', 'small']

        if (result) {
            const { mimetype } = result
            ctx.response.set('content-type', mimetype)
            if (!typeList.some(size => size == type)) {
                ctx.body = fs.createReadStream(`${PICTURE_PATH}/${filename}`)
            } else {
                ctx.body = fs.createReadStream(`${PICTURE_PATH}/${filename}-${type}`)
            }

        }

    }
}

module.exports = new MomentController()