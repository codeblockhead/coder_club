const connection = require('../app/database')

class UserService {
    async create(user) {
        const statement = 'INSERT INTO user (name,password) VALUES (?,?) ;'
        const { name, password } = user

        const result = await connection.execute(statement, [name, password])

        return result
    }

    // 查询是否有这个用户名
    async getUserByName(name) {
        const statement = 'SELECT * FROM user WHERE name = ?;'
        const result = await connection.execute(statement, [name])
        return result[0]
    }

    async getUserById(id) {
        const statement = 'SELECT id,name ,avatar_url avatarUrl FROM user WHERE id = ?;'
        const result = await connection.execute(statement, [id])
        return result[0]
    }

    async getUserAvatarById(userId) {
        const statement = `
        SELECT * FROM avatar WHERE user_id = ? ;
        `

        const [result] = await connection.execute(statement, [userId])

        return result;
    }

    async getUserAvatarCountById(userId) {
        const statement = `
        SELECT COUNT(*) avatarCount ,filename firstName FROM avatar WHERE user_id = ? ;
        `
        const [result] = await connection.execute(statement, [userId])

        return result[0]
    }

    async updateAvatarUrlById(avatarUrl, id) {
        const statement = `
        UPDATE user SET avatar_url = ? WHERE id = ?;
        `
        const [result] = await connection.execute(statement,[avatarUrl, id])
        return result
    }

  
 
}


module.exports = new UserService()