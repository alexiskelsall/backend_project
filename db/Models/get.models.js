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

function fetchArticles (){
       return db.query(`
        SELECT articles.article_id, articles.title, articles.topic, articles.author, 
        articles.created_at, articles.article_img_url, articles.votes, COUNT(comments.article_id) AS comment_count
        FROM articles
        LEFT JOIN comments 
        ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY created_at DESC`
    )
    .then(({rows})=>{
        if(rows.length === 0){
            return Promise.reject({status: 204, message: "No Content"})
        } else {
            return rows
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

function fetchArticleCommentsByID (id){
    return db.query(`
        SELECT * FROM comments
        WHERE article_id = $1 
        ORDER BY created_at DESC`, [id])
    .then(({rows})=>{
        if(rows.length === 0){
            return Promise.reject({message: "Comments Not Found"})
        }
        return rows
        })
    
}

function fetchUsers(){
    return db.query(`
        SELECT * FROM users`)
    .then(({rows})=>{
        return rows
    })
}





module.exports = {fetchTopics, fetchArticles, fetchArticleByID, fetchArticleCommentsByID, fetchUsers}