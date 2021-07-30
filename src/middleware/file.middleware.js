const path = require('path')
const fs = require('fs')

const Multer = require('koa-multer')

const sharp = require('sharp')
const { AVATAR_PATH, PICTURE_PATH } = require('../constant/file-path')


const avatarUpload = Multer({
    dest: `${AVATAR_PATH}`
})

const pictureUpload = Multer({
    dest: `${PICTURE_PATH}`
})

const avatarHandle = avatarUpload.single('avatar')

const pictureHandle = pictureUpload.array('picture', 9)

const avatarResize = async (ctx, next) => {
    const file = ctx.req.file
    const imgPath = path.join(file.destination, file.filename)
    //压缩头像
    sharp(imgPath)
        .withMetadata()
        .resize({ width: 300 })
        .toBuffer((err, data, info) => {
            //使用toBuffer和fs重写同一个文件
            fs.writeFile(imgPath, data, () => { })
        })
    await next()
}

const pictureResize = async (ctx, next) => {

    try {
        let files = ctx.req.files
        for (let file of files) {
            const imgPath = path.join(file.destination, file.filename)
            sharp(imgPath)
                .resize({ width: 1280 })
                .toFile(`${imgPath}-large`, (err, info) => { })
                .resize({ width: 720 })
                .toFile(`${imgPath}-middle`, (err, info) => { })
                .resize({ width: 360 })
                .toFile(`${imgPath}-small`, (err, info) => { })
        }
    } catch (error) {
        console.log(error);
    }
    await next()
}
module.exports = {
    avatarHandle,
    pictureHandle,
    pictureResize,
    avatarResize
}