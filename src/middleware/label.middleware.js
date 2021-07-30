const labelService = require('../service/label.service');
const LabelService = require('../service/label.service')

const verifyLabelExists = async (ctx, next) => {
    const  labels  = ctx.request.body.labels||[]
    if (labels.length==0) {
        return ctx.body="参数不得为空"
    }
    //1.先验证标签表里是否有这个标签,如果没有,就创建标签
    const labelArr = []   

    // 错误写法,forEach中不能使用异步操作
    // await labels.forEach(async (label) => {
    //     const result = await LabelService.exists(label)
    //     if (!result.exists) {
    //         const result = await labelService.create(label)
    //         labelArr.push({ id: result.insertId, name: label })
    //     } else {
    //         labelArr.push({ id: result.id, name: label })
    //     }

    // });
    for (const label of labels) {
        const result = await LabelService.exists(label)
        if (!result.exists) {
            const result = await labelService.create(label)
            labelArr.push({ id: result.insertId, name: label })
        } else {
            labelArr.push({ id: result.id, name: label })
        }
    }
    ctx.labelArr = labelArr

    await next()
}

module.exports = {
    verifyLabelExists
}