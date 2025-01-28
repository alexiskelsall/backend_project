const db = require("../connection")

function addComment(newComment){
    console.log(newComment)
    //if(typeof newComment.username === "string" && typeof newComment.body === "string")
    return validUsername(newComment.username)
    .then(()=>{
        return db.query(`
        INSERT INTO comments (body, author, article_id, votes)
        VALUES ($1,$2,$3,$4)
        RETURNING *`,
    [body, username, article_id, votes = 0])
    })
    .then(({rows})=>{
        return rows
    })
}



function validUsername (username){
    return db.query(`
        SELECT * FROM users
        WHERE username = $1`, [username])
    .then(({rows})=>{
        if(rows.length === 0){
            return Promise.reject({ status: 404, message: "Username Not Found"})
        } else {
            return
        }
})
}




module.exports = {addComment}