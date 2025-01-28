const app = require("../app")
const {fetchTopics, fetchArticles, fetchArticleByID, fetchArticleCommentsByID} = require("../Models/get.models")


function getTopics (req, res, next){
        fetchTopics()
        .then((topics)=>{
        res.status(200).send({topics})
         })
        .catch((err)=>{
            next(err)
         })
}

function getArticles (req, res, next){
    fetchArticles()
    .then((articles)=>{
    res.status(200).send({articles})
     })
    .catch((err)=>{
        next(err)
     })
}

function getArticleByID (req, res, next){
     const id = req.params.article_id
     fetchArticleByID(id)
     .then((article)=>{
     res.status(200).send({article})
     })
     .catch((err)=>{
        next(err)
     })
    
}

function getArticleCommentsByID (req, res, next){
    const id = req.params.article_id
    fetchArticleCommentsByID(id)
    .then((comments)=>{
        res.status(200).send({comments})
    })
    .catch((err)=>{
        next(err)
    })
}



module.exports = {getTopics, getArticles, getArticleByID, getArticleCommentsByID}