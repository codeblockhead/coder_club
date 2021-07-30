const jwt = require('jsonwebtoken')
const { PRIVATE_KEY } = require('../app/config')


class AuthController {
    async login(ctx, next) {
        const { id, name } = ctx.user
        const token = jwt.sign({ id, name }, PRIVATE_KEY, {
            expiresIn: 60 * 60 * 24,
            algorithm: 'RS256' //必须使用rs256非对称加密
        });

        ctx.body = { id, name, token }
    }
    async success(ctx, next) {
        ctx.body = "授权成功"
    }
}

module.exports = new AuthController()