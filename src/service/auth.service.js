const connection = require('../app/database')

class AuthService {
    async isPermission(tableName, userId, id) {
        const statement = `SELECT * FROM ${tableName} WHERE user_id = ? && id =?;`

        const [result] = await connection.execute(statement, [userId, id])

        return result.length != 0 ? true : false
    }
}

module.exports = new AuthService()