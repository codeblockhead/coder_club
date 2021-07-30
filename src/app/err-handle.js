const errorTypes = require('../constant/error-type')

const handleErr = (err, ctx) => {
    let message = ''
    let status = ''
    switch (err.message) {
        case errorTypes.NAME_OR_PASSWORD_IS_REQUIRED:
            message = '用户名或密码不能为空'
            status = 400
            break;
        case errorTypes.USER_ALREADY_EXISTS:
            message = '用户已经存在'
            status = 402
            break;
        case errorTypes.USER_DOES_NOT_EXISTS:
            message = '用户不存在'
            status = 402
            break;
        case errorTypes.PASSWORD_IS_INCORRENT:
            message = '密码错误'
            status = 402
            break;
        case errorTypes.UNAUTHORIZATION:
            message = '没有获得授权'
            status = 402
            break;
        case errorTypes.UNPERMISSION:
            message = '没有权限操作'
            status = 402
            break;
        default:
            message = 'NOT FOUND'
            status = 404
            break;
    }
    ctx.status = status;
    ctx.body = message


}

module.exports = handleErr