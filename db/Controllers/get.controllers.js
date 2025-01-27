const app = require("../app")
const {fetchTopics, fetchArticleByID} = require("../Models/get.models")


function getTopics (req, res, next){
        fetchTopics()
        .then((topics)=>{
        res.status(200).send({topics})
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





module.exports = {getTopics, getArticleByID}