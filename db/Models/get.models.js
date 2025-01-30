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
function fetchArticles(sort_by = "created_at", order = "desc", topic = null) {
    return validTopic(topic)
        .then(() => {
            let SQLString = `
                SELECT articles.article_id, articles.title, articles.topic, articles.author, 
                       articles.created_at, articles.article_img_url, articles.votes, 
                       COUNT(comments.article_id) AS comment_count
                FROM articles
                LEFT JOIN comments 
                ON articles.article_id = comments.article_id`;

            const queryValues = [];
            const validColumnNamesToSortBy = [
                "article_id",
                "title",
                "topic",
                "author",
                "body",
                "created_at",
                "votes",
                "article_img_url",
            ];

            if (topic) {
                SQLString += ` WHERE articles.topic = $1`;
                queryValues.push(topic);
            }

            SQLString += ` GROUP BY articles.article_id`;

            if (validColumnNamesToSortBy.includes(sort_by)) {
                SQLString += ` ORDER BY ${sort_by}`;
            } else {
                return Promise.reject({ status: 400, message: "Not a Valid Input" });
            }

            if (order === "asc" || order === "desc") {
                SQLString += ` ${order}`;
            } else {
                return Promise.reject({ status: 400, message: "Not a Valid Input" });
            }
            return db.query(SQLString, queryValues);
        })
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 204, message: "No Content" });
            }

            return rows.map((article) => ({
                ...article,
                comment_count: Number(article.comment_count),
            }));
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
        if(rows.length === 0){
            return Promise.reject({message: "Comments Not Found"})
        }
        return rows
        })
}


function validTopic(topic){
    if(!topic){
        return Promise.resolve()
    }
    return db.query(`
        SELECT * FROM topics
        WHERE slug = $1`, 
        [topic])
        .then((res)=>{
            if(res.rows.length === 0){
                return Promise.reject({status: 404, message: "Topic Not Found"})
            } else {
                return Promise.resolve(topic)
            } 
        })
}


module.exports = {fetchTopics, fetchArticles, fetchArticleByID, fetchArticleCommentsByID, fetchUsers, validTopic}


