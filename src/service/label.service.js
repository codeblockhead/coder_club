const connection = require('../app/database')

class LabelService {
    //验证标签是否存在
    async exists(label) {
        const statement = `SELECT * FROM label WHERE name= ?;`

        let [result] = await connection.execute(statement, [label])

        return result = { exists: result.length != 0 ? true : false, id: result.length != 0 ? result[0].id : '' }
    }

    //创建一个新的标签
    async create(label) {
        const statement = `INSERT INTO label (name) VALUES (?);`

        let [result] = await connection.execute(statement, [label])

        return result
    }

    async getList(page, limit) {
        const statement = `
        SELECT * FROM label LIMIT ? , ? ;
        `
        if (!page || !limit) {
            const result = '请检查参数是否填写'
            return result
        }
        const offset = (page - 1) * limit
        try {
            // 这里有坑,必须都是字符串类型
            const [result] = await connection.execute(statement, [ offset.toString(), limit])
            return result
        } catch (error) {
            console.log(error);
        }
    }

}

module.exports = new LabelService()