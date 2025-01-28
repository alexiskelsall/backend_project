const { response } = require("../app")
const {addComment} = require("../Models/post.models")

function postComment(req, res, next){
    const newComment = req.body
    newComment.article_id = req.params.article_id
    addComment(newComment)
    .then((newComment)=>{
        res.status(201).send({newComment: newComment})
    })
    .catch((err)=>{
        next(err)
    })
}
        
 


module.exports = {postComment}