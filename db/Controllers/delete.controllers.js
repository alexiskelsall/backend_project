const {removeCommentByID} = require("../Models/delete.models")


function deleteCommentByID (req, res, next){
    const id = req.params.comment_id 
    removeCommentByID(id)
    .then(()=>{
        res.status(204).send({})
    })
    .catch((err)=>{
        next(err)
    })




}


module.exports = {deleteCommentByID}