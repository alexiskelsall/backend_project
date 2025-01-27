const app = require("../app")
const {fetchTopics} = require("../Models/get.models")


function getTopics (req, res, next){
        fetchTopics()
        .then((topics)=>{
        res.status(200).send({topics})
         })
        .catch((err)=>{
        next(err)
         })
}






module.exports = {getTopics}