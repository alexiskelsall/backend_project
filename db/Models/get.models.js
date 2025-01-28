const db = require("../connection")


function fetchTopics (){
    return db.query("SELECT * FROM topics")
    .then((res)=>{
        if(res.rows.length === 0){
            return Promise.reject({status: 204, message: "No Content"})
        } else {
            return res.rows
        }
    })
}

function fetchArticleByID (id){
    return db.query(`
        SELECT * FROM articles
        WHERE article_id =$1`, [id])
    .then(({rows})=>{
        if(rows.length === 0){
            return Promise.reject({message: "Article Not Found"})
        } else {
            return rows
        }
              
    })
}





module.exports = {fetchTopics, fetchArticleByID}