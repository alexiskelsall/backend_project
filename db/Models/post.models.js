const db = require("../connection")

function addComment(newComment){
    const { body, username, article_id } = newComment;
    return isString(newComment)
    .then((newComment)=>{
        return checkUsername(newComment.username)})
    .then((res)=>{ 
        return db.query(`
        INSERT INTO comments (body, author, article_id, votes)
        VALUES ($1,$2,$3,$4)
        RETURNING *`,
    [body, username, article_id, votes = 0])})
    .then(({rows})=>{
        return rows
    })
}

function checkUsername (username){
    return db.query(`
        SELECT * FROM users
        WHERE username = $1`, [username])
    .then(({rows})=>{
        if(rows.length === 0){
            return Promise.reject({ status: 404, message: "Username Not Found"})
        } else {
            return Promise.resolve()
        }
  })
  }
  
  function isString(newComment) {
    for (let key in newComment) {
        if (typeof newComment[key] !== "string") {
            return Promise.reject({ status: 400, message: "Not a Valid Input" });
        }
    }
    return Promise.resolve(newComment); 
}


module.exports = {addComment, checkUsername, isString}