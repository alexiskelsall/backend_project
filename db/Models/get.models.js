const db = require("../connection")


function fetchTopics (){
    return db.query("SELECT * FROM topics")
    .then((res)=>{
        return res.rows
    })
    
    
}





module.exports = {fetchTopics}