const app = require("../app")
const {updateArticleByID} = require("../Models/patch.models")

function patchArticleByID (req, res, next){
    if(!req.body || typeof req.body.inc_votes !== "number"){
        return res.status(400).send({error: "Bad Request"})
    }
    
    const votes = req.body
    votes.article_id = req.params.article_id
    updateArticleByID(votes)
    .then((updatedArticle)=>{
       res.status(200).send({article: updatedArticle})
    })
    .catch((err)=>{
        next(err)
    })

}

module.exports = {patchArticleByID}