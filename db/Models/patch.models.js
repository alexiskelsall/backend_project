const db = require("../connection")


function updateArticleByID (votes){
    const {inc_votes, article_id} = votes
    return db.query(`
        UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *`,
    [inc_votes, article_id])
    .then(({rows})=>{
        return rows
    })
    }




module.exports = {updateArticleByID}