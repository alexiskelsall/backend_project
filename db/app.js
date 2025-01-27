const express = require("express")
const app = express ()
const endpoints = require("../endpoints.json");
const {getTopics} = require("./Controllers/get.controllers")

app.use(express.json())

app.get('/api', (req, res)=>{
    res.status(200).send({endpoints})
})


app.get('/api/topics', getTopics)

app.all("*",(req, res)=>{
    res.status(404).send({error:"Endpoint not found"})
})

app.use((err,req,res,next)=>{
    console.log(err)
    res.status(500).send({msg:"Server Error!"})
})

module.exports = app

