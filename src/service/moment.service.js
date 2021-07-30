const {APP_HOST,APP_PORT} = require('../app/config')

const connection = require('../app/database')
const userService = require('./user.service')


class momentService {

    async create(content, user) {
        const statement = 'INSERT INTO moment (user_id,content) VALUES (?,?) ;'

        const { id } = user

        const [result] = await connection.execute(statement, [id, content])
        return result
    }

    async getMomentList(page, limit) {

        const statement = `
            SELECT
            m.id,m.content, m.createAt,m.updateAt, 
            JSON_OBJECT('id',u.id,'name',u.name, 'avatarUrl',u.avatar_url) author,
	        (SELECT COUNT(*) FROM moment_label ml WHERE ml.moment_id = m.id) labelCount,
            (SELECT COUNT(*) FROM comment c WHERE c.moment_id =m.id) commentCount,
            (SELECT JSON_ARRAYAGG(CONCAT('${APP_HOST}:${APP_PORT}/moment/image/',file.filename,'?type=large')) FROM file WHERE file.moment_id = m.id) pictureList
            FROM moment m LEFT JOIN user u 
            ON m.user_id = u.id 
            LIMIT ?, ?;
            `
        if (!page || !limit) {
            const result = '请检查参数是否填写'
            return result
        }
        const offset = (page - 1) * limit

        try {
            // 这里有坑,必须都是字符串类型
            // const [momentList] = await connection.execute(statement, [offset.toString(), limit])
            // const { totalCount } = await this.getMomentListCount()

            //可以使用promise.all
            const [[momentList], { totalCount }] = await Promise.all([
                connection.execute(statement, [offset.toString(), limit]),
                this.getMomentListCount()
            ])

            return { totalCount, momentList }
        } catch (error) {
            console.log(error);
        }
    }
    async getMomentListCount() {
        const statement = `
        SELECT
        COUNT(*) totalCount
        FROM moment m 
        LEFT JOIN user u ON m.user_id = u.id 
        `
        const [result] = await connection.execute(statement)

        return result[0]
    }
    async getPersonalMomentList(userId, page, limit) {
        const statement = `
            SELECT
            m.id,m.content, m.createAt,m.updateAt,
	        (SELECT COUNT(*) FROM moment_label ml WHERE ml.moment_id = m.id) labelCount,
            (SELECT COUNT(*) FROM comment c WHERE c.moment_id =m.id) commentCount,
            (SELECT JSON_ARRAYAGG(CONCAT('${APP_HOST}:${APP_PORT}/moment/image/',file.filename,'?type=large')) FROM file WHERE file.moment_id = m.id) pictureList
            FROM moment m 
            LEFT JOIN user u ON m.user_id = u.id 
            WHERE u.id=?
            LIMIT ?, ?;
            `
        if (!page || !limit) {
            const result = '请检查参数是否填写'
            return result
        }
        const offset = (page - 1) * limit
        try {

            // 这里有坑,必须都是字符串类型
            // const [momentList] = await connection.execute(statement, [userId, offset.toString(), limit])
            // const { totalCount } = await this.getPersonalMomentListCount(userId)

            //可以使用promise.all
            const [[momentList], { totalCount }, [user]] = await Promise.all([
                connection.execute(statement, [userId, offset.toString(), limit]),
                this.getPersonalMomentListCount(userId),
                userService.getUserById(userId)
            ])
            return { totalCount, momentList, user }

        } catch (error) {
            console.log(error);
        }
    }
    async getPersonalMomentListCount(userId) {
        const statement = `
        SELECT
        COUNT(*) totalCount
        FROM moment m LEFT JOIN user u 
        ON m.user_id = u.id
        WHERE u.id=?; 
        `
        const [result] = await connection.execute(statement, [userId])
        return result[0]
    }

    async getMomentDetail(momentId) {
        const statement = `
        SELECT
        m.id,m.content, m.createAt,m.updateAt, 
        JSON_OBJECT('id',u.id,'name',u.name,'avatarUrl',u.avatar_url) author,
        (SELECT COUNT(*) FROM moment_label ml WHERE ml.moment_id = m.id) labelCount,
        (SELECT COUNT(*) FROM comment c WHERE c.moment_id =m.id) commentCount,
        (SELECT IF (COUNT(c.id),
        JSON_ARRAYAGG(
        JSON_OBJECT('id',c.id,'content',c.content,'createAt',c.createAt,'updateAt',c.updateAt,
        'author',JSON_OBJECT('id',cu.id,'name',cu.name,'avatarUrl',cu.avatar_url)
        )
        ),NULL) FROM comment c LEFT JOIN user cu on cu.id = c.user_id  WHERE m.id =c.moment_id  ) comments,
        IF(COUNT(l.id),
        JSON_ARRAYAGG(JSON_OBJECT('id',l.id,'name',l.name)) ,
        NULL) labels, 
        (SELECT JSON_ARRAYAGG(CONCAT('${APP_HOST}:${APP_PORT}/moment/image/',file.filename,'?type=large')) FROM file WHERE file.moment_id = m.id) pictureList
        FROM moment m 
        LEFT JOIN user u ON m.user_id = u.id 
        LEFT JOIN moment_label ml ON ml.moment_id = m.id
        LEFT JOIN label l ON l.id =ml.label_id
        WHERE m.id=?;
        `
        const [result] = await connection.execute(statement, [momentId])

        return result[0]
    }
    async removeMoment(momentId) {
        const statement = `
        DELETE FROM moment WHERE id = ? ;
        `
        const [result] = await connection.execute(statement, [momentId])

        return result
    }

    async modifyMoment(momentId, content) {
        const statement = `
        UPDATE moment SET content = ? WHERE id =?
        `
        const [result] = await connection.execute(statement, [content, momentId])

        return result
    }

    async hasLabel(momentId, labelId) {
        const statement = `
        SELECT * FROM moment_label WHERE moment_id = ? && label_id =?;
        `
        const [result] = await connection.execute(statement, [momentId, labelId])
        return result.length != 0 ? true : false
    }

    async addLabel(momentId, labelId) {
        const statement = `
        INSERT INTO moment_label (moment_id,label_id) VALUES (?,?) ;
        `
        const [result] = await connection.execute(statement, [momentId, labelId])

        return result
    }

    async getFileByFilename(filename){
        const statement = `
        SELECT * FROM file WHERE filename = ?;
        `
        const [result] = await connection.execute(statement, [filename])
      
        return result[0]
    }
}

module.exports = new momentService()