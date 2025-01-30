const db = require("../connection")

function updateArticleByID (votes){
    const {inc_votes, article_id} = votes
    return validArticleID(article_id)
    .then(()=>{    
        return db.query(`
        UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *`,
        [inc_votes, article_id])
    })
    .then(({rows})=>{
            return rows[0]
    })

    }

function validArticleID (article_id){
    return db.query(`
        SELECT * FROM articles
        WHERE article_id =$1`, [article_id])
        .then(({rows})=>{
        if(rows.length === 0){
            return Promise.reject({message: "Article Not Found"})
            } else {
                return Promise.resolve(article_id)
            }
                  
        })
    }


module.exports = {updateArticleByID}