const fs = require('fs')

const connection = require('../app/database');
const { AVATAR_PATH } = require('../constant/file-path');
const userService = require('./user.service');

class FileService {
    async saveAvatarInfo(id, filename, mimetype, size) {
        const statement = `
        INSERT INTO avatar ( user_id ,filename, mimetype ,size) VALUES (?, ?, ?, ? );
        `
        const [result] = await connection.execute(statement, [id, filename, mimetype, size])

        const { avatarCount, firstName } = await userService.getUserAvatarCountById(id)

        //保存使用过的五张历史头像,删除历史头像中的第一张
        if (avatarCount > 5) {
            const statement = `
            DELETE FROM avatar WHERE filename = ?;
            `
            await Promise.all([
                fs.promises.unlink(`${AVATAR_PATH}/${firstName}`),//1.删除服务器文件夹中保存的图片
                connection.execute(statement, [firstName])//2.删除数据库保存的图片    
            ])

            return result
        } else {
            return result;

        }

    }

    async savePictureInfo(id, momentId, filename, mimetype, size) {
        const statement = `
        INSERT INTO file ( user_id ,moment_id,filename, mimetype ,size) VALUES (?, ?, ?, ? ,?);
        `
        const [result] = await connection.execute(statement, [id, momentId, filename, mimetype, size])

        return result
    }

}

module.exports = new FileService()