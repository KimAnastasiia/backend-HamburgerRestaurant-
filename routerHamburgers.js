const express = require('express');
const mysqlConnection = require("./mysqlConnection")

const hamburgers = express.Router();

hamburgers.get("/",(req,res,next)=>{

    mysqlConnection.query(`SELECT * FROM hamburgers`, (err, rows) => {

        if (err)
            res.send({error:err});
        else
            console.log(rows);

        res.send(rows)
    })
})

hamburgers.get("/:id",(req,res,next)=>{

    let id = req.params.id

    mysqlConnection.query(`SELECT * FROM hamburgers WHERE id=`+id, (err, rows) => {

        if (err){
            res.send({error:err});
            return
        }
        else
            console.log(rows);

        res.send(rows)
    })
})

hamburgers.post('/', (req, res) => {
    let type = req.body.name
    let price = req.body.price
    let description = req.body.description
    let img = req.files.myImage
    

    if (img != null) {

        img.mv('public/images/' + type + '.png', 
            function(err) {
                if (err) {
                    res.send("Error in upload picture");
                } 
            }
        )
    }

    mysqlConnection.query("INSERT INTO hamburgers ( type, price, description ) VALUES ('"+type+"',"+price+",'"+description+"') ", (err, rows) => {

        if (err){
            res.send({error: err});
            return ;
        }
        else{
        res.send(
            {
                messege:"done",
                rows: rows
            })
        }
    })

})

module.exports=hamburgers