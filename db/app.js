const express = require("express")
const app = express ()
const endpoints = require("../endpoints.json");

const {getTopics, getArticles, getArticleByID, getArticleCommentsByID, getUsers, getUserByUsername} = require("./Controllers/get.controllers")
const {postComment} = require("./Controllers/post.controllers")
const {patchArticleByID} = require("./Controllers/patch.controllers")
const {deleteCommentByID} = require("./Controllers/delete.controllers")

app.use(express.json())

app.get('/api', (req, res)=>{
    res.status(200).send({endpoints})
})

app.get('/api/topics', getTopics)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id', getArticleByID)

app.get('/api/articles/:article_id/comments', getArticleCommentsByID)

app.get('/api/users', getUsers)

app.get('/api/users/:username', getUserByUsername)

app.post('/api/articles/:article_id/comments', postComment)

app.patch('/api/articles/:article_id', patchArticleByID)

app.delete('/api/comments/:comment_id', deleteCommentByID)

app.all("*",(req, res)=>{
    res.status(404).send({message:"Endpoint not found"})
})

app.use((err,req,res,next)=>{
    if(err.code === "22P02" || err.message === "Not a Valid Input" ){
        res.status(400).send({error: "Bad Request"})
    } else {
        next(err)
    }
    }
)

app.use((err,req,res,next)=>{
    if(err.status === 204){
        res.status(204).send({error: "No Content"})
    } else {
        next(err)
    }
    }
)

app.use((err,req,res,next)=>{
        if(err.message === "Article Not Found" || err.message === "Comments Not Found" || err.message === "Username Not Found" || err.message ==='Comment ID Not Found'|| err.message === "Topic Not Found" ){
            res.status(404).send({error: "Not Found"})
        } else {
            next(err)
        }
})


app.use((err,req,res,next)=>{
    console.log(err,"err")
    res.status(500).send({msg:"Server Error!"})
})

module.exports = app