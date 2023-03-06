const express = require('express');
const mysqlConnection = require("./mysqlConnection")

const comments = express.Router();

mysqlConnection.connect((err)=> {
    if(err){
        console.log('Error ' +err);
    } else{
        console.log('Connected to database')
    }
});

comments.get("/",(req,res,next)=>{
    

    mysqlConnection.query(`SELECT comments.userId, users.name, comments.comment,comments.hamburgerId, comments.date, comments.id
    FROM comments
    JOIN users
    ON comments.userId=users.id`, (err, rows) => {

        if (err)
            res.send({error:err});
        else
            console.log(rows);

        res.send(rows)
    })
})




module.exports=comments