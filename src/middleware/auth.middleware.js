const jwt = require('jsonwebtoken')
const { PUBLIC_KEY } = require("../app/config")
const AuthService = require('../service/auth.service.js')
const errorTypes = require('../constant/error-type')
const { getUserByName } = require("../service/user.service")
const md5password = require("../utils/password-handle")

//验证登录信息是否正确
const verifyLogin = async (ctx, next) => {
    const { name, password } = ctx.request.body;
    //1.用户名密码不能为空
    if (!name || !password) {
        const error = new Error(errorTypes.NAME_OR_PASSWORD_IS_REQUIRED)
        return ctx.app.emit('error', error, ctx)
    }

    //2.判断用户是否存在
    const result = await getUserByName(name);
    // 如果result数组长度不为0,说明查询到了数据且用户不存在,发射错误
    if (!result.length) {
        const error = new Error(errorTypes.USER_DOES_NOT_EXISTS)
        return ctx.app.emit('error', error, ctx)
    }

    //3.最后判断密码是否正确
    const user = result[0]
    if (md5password(password) != user.password) {
        const error = new Error(errorTypes.PASSWORD_IS_INCORRENT)
        return ctx.app.emit('error', error, ctx)
    }

    ctx.user = user;
    await next()
}

//验证授权(是否登录)
const verifyAuth = async (ctx, next) => {
    console.log('来到验证授权中间件');
    let authorization = ctx.request.header.authorization
    if (!authorization) {
        const err = new Error(errorTypes.UNAUTHORIZATION)
        return ctx.app.emit('error', err, ctx)

    }
    const token = authorization.replace('Bearer ', '');
    try {
        const result = jwt.verify(token, PUBLIC_KEY, {
            algorithms: ['RS256']
        })
        ctx.user = result
        await next()
    } catch (error) {
        console.log(error);
        const err = new Error(errorTypes.UNAUTHORIZATION)
        return ctx.app.emit('error', err, ctx)
    }
}

// 验证是否有修改某一项的权限(使用params传入id,params为传入表的id)
const verifyPermission = (tableName) => {
    return async (ctx, next) => {
        console.log('来到验证权限中间件');
        const [resourceKey] = Object.keys(ctx.params);
        const userId = ctx.user.id
        const id = ctx.params[resourceKey]

        try {
            const isPermission = await AuthService.isPermission(tableName, userId, id)

            if (!isPermission) {
                throw new Error()
            } else {
                await next()
            }
        } catch (error) {
            const err = new Error(errorTypes.UNPERMISSION)
            return ctx.app.emit('error', err, ctx)
        }

    }
}


module.exports = {
    verifyLogin,
    verifyAuth,
    verifyPermission
}
