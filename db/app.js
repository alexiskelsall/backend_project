const express = require("express")
const app = express ()
const endpoints = require("../endpoints.json");
const {getTopics, getArticles, getArticleByID} = require("./Controllers/get.controllers")

app.get('/api', (req, res)=>{
    res.status(200).send({endpoints})
})


app.get('/api/topics', getTopics)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id', getArticleByID)

app.all("*",(req, res)=>{
    res.status(404).send({message:"Endpoint not found"})
})

app.use((err,req,res,next)=>{
    if(err.code === "22P02"){
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
        if(err.message === "Article Not Found"){
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