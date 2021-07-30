const commentService = require("../service/comment.service")

class CommentController {
    async create(ctx, next) {
        const { content, momentId } = ctx.request.body
        const { id } = ctx.user;

        const result = await commentService.create(content, momentId, id);
        ctx.body = result
    }

    async reply(ctx, next) {
        const { content, momentId } = ctx.request.body
        const { id } = ctx.user;
        const { commentId } = ctx.params
        const result = await commentService.reply(content, momentId, id, commentId);
        ctx.body = result
    }

    async remove(ctx, next) {
        const { commentId } = ctx.params
        
        const result = await commentService.remove(commentId);

        ctx.body = result
    }

    async list(ctx,next) {
        const {momentId} = ctx.query

        const result = await commentService.getCommentList(momentId)
        ctx.body = result
    }
}

module.exports = new CommentController()