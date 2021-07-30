const labelService = require("../service/label.service");

class LabelController {
    async create(ctx, next) {
        ctx.body = '创建标签成功'
    }

    async list(ctx, next) {
        const { page, limit } = ctx.query;
        const result = await labelService.getList(page, limit)
        ctx.body = result

    }
}

module.exports = new LabelController()