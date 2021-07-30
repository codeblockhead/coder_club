const errorTypes = require('../constant/error-type')

const { getUserByName } = require("../service/user.service")
const  md5password = require("../utils/password-handle")

//验证注册
const verifyUser = async (ctx, next) => {
    const { name, password } = ctx.request.body;

    if (!name || !password) {
        const error = new Error(errorTypes.NAME_OR_PASSWORD_IS_REQUIRED)
        return ctx.app.emit('error', error, ctx)
    }

    const result = await getUserByName(name);
    // 如果result数组长度不为0,说明查询到了数据
    if (result.length) {
        const error = new Error(errorTypes.USER_ALREADY_EXISTS)
        return ctx.app.emit('error', error, ctx)
    }
    await next()
}

//加密密码
const handlePassword = async (ctx, next) => {
    let { password } = ctx.request.body
    ctx.request.body.password = md5password(password)
    await next()
}

module.exports = {
    verifyUser,
    handlePassword
}