const app = require("../app")
const {updateArticleByID} = require("../Models/patch.models")

function patchArticleByID (req, res, next){
    const {inc_votes} = req.body
    const{article_id} = req.params
    if(!req.body || typeof inc_votes !== "number"){
        return res.status(400).send({error: "Bad Request"})
    }
    updateArticleByID({inc_votes, article_id})
    .then((updatedArticle)=>{
       res.status(200).send({article: updatedArticle})
    })
    .catch((err)=>{
        next(err)
    })

}

module.exports = {patchArticleByID}