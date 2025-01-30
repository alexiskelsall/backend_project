const app = require("../app")
const {fetchTopics, fetchArticles, fetchArticleByID, fetchArticleCommentsByID, fetchUsers} = require("../Models/get.models")


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
    const sort_by = req.query.sort_by
    const order = req.query.order
    fetchArticles(sort_by, order)
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

function getUsers(req, res, next){
    fetchUsers()
    .then((users)=>
    res.status(200).send({users}))
    .catch((err)=>{
        next(err)
    })
}



module.exports = {getTopics, getArticles, getArticleByID, getArticleCommentsByID, getUsers}