const connection = require('../app/database')

class CommentService {
    async create(content, moment_id, user_id) {
        const statement = `
        INSERT INTO comment ( content ,moment_id,user_id) VALUES (?, ?, ?);
        `
        const [result] = await connection.execute(statement, [content, moment_id, user_id])

        return result;
    }

    async reply(content, moment_id, user_id, comment_id) {
        const statement = `
        INSERT INTO comment ( content ,moment_id,user_id ,comment_id) VALUES (?, ?, ?, ?);
        `
        const [result] = await connection.execute(statement, [content, moment_id, user_id, comment_id])

        return result;
    }

    async remove(commentId) {
        const statement = `
        DELETE FROM comment WHERE id = ?;
        `
        const [result] = await connection.execute(statement, [commentId])

        return result;
    }

    async getCommentList(momentId){
        const statement = `		
        SELECT c.id,c.content,c.comment_id commentId ,c.createAt,c.updateAt,
		JSON_OBJECT('id',u.id,'name',u.name) ahthor 
		FROM comment c LEFT JOIN user u 
		ON u.id = c.user_id 
		WHERE c.moment_id = ?;
        `

        const [result] = await connection.execute(statement, [momentId])

        return result;
    }
}

module.exports = new CommentService()