const db = require("../connection")



function removeCommentByID(id){
    return validCommentID(id)
    .then(()=>{
        return db.query(`
            DELETE FROM comments
            WHERE comment_id = $1`, [id])
    })
}

function validCommentID (id){
    return db.query(`
        SELECT * FROM comments
        WHERE comment_id = $1`, [id])
        .then(({rows})=>{
            if(rows.length === 0){
                return Promise.reject({ status: 404, message: "Comment ID Not Found"})
            } else {
                return Promise.resolve()
            }

        })
}

module.exports = {removeCommentByID, validCommentID}