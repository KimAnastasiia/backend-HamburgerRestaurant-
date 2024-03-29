const express = require('express');
const jwt = require("jsonwebtoken");
const order = express.Router();
const mysql = require('mysql');

const mysqlConnection = require("./mysqlConnection")

order.get("/",(req,res,next)=>{
    

    mysqlConnection.query(`SELECT * FROM orders`, (err, rows) => {

        if (err){
            res.send({error:err});
            return
        } else
            console.log(rows);

        res.send(rows)
    })
})
order.get("/basket",(req,res,next)=>{
    

    mysqlConnection.query(`SELECT SUM(number) as number 
    FROM orders
    WHERE idUser = `+req.infoInToken.id+" AND finish IS null ", (err, rows) => {

        if (err)
            res.send({error:err});
        else
            console.log(rows);

        res.send(rows)
    })
})


order.get("/hamburgers",(req,res,next)=>{

    mysqlConnection.query(`
    SELECT *
    FROM orders
    JOIN hamburgers
    ON orders.hamburgerId=hamburgers.Id
    WHERE idUser=`+req.infoInToken.id+" and finish is null ", (err, rows) => {

        if (err)
            res.send({error:err});
        else
            console.log(rows);

        res.send(rows)
    })
})
order.get("/details/:doneOrdersDetailsId",(req,res,next)=>{
    
    let doneOrdersDetailsId= req.params.doneOrdersDetailsId

    mysqlConnection.query(`
    SELECT *, orders.id AS "key"
    FROM  orders
    JOIN hamburgers
    JOIN orderpack
    ON orders.hamburgerId=hamburgers.Id AND orders.orderPackId = orderpack.id
    WHERE orderPackId=`+doneOrdersDetailsId, (errOrderpack, rowsOrderpack) => {

        if (errOrderpack)
            res.send({error:errOrderpack});
        else{
            //res.send(rowsOne)

            mysqlConnection.query(`SELECT users.id, users.name, users.payment, users.email, users.surname, users.country, users.street, users.floor, users.entrance, users.apartment
                from orderpack
                JOIN users
                ON orderpack.userId=users.id
                WHERE orderpack.id=`+doneOrdersDetailsId+" and users.id="+req.infoInToken.id , (errUser, rowsUser) => {
                if (errUser){
                    res.send({error: errUser});
                    return ;
                }
                res.send(
                    {
                        messege:"done",
                        orderpack:rowsOrderpack,
                        user: rowsUser
                    }
                )
            })
        }
          

        
    })
})
order.get("/:id",(req,res,next)=>{
    let id = req.params.id

    mysqlConnection.query(`SELECT * FROM orders WHERE hamburgerId=`+id+" and idUser="+req.infoInToken.id+" and finish is null ", (err, rows) => {

        if (err)
            res.send({error:err});
        else
            console.log(rows);

        res.send(rows)
    })
})



order.post('/', (req, res) => {

    let hamburgerId  = req.body.id
    let number  = req.body.number

    mysqlConnection.query("INSERT INTO orders ( hamburgerId, number, idUser ) VALUES ("+hamburgerId+","+number+","+req.infoInToken.id+" ) ", (err, rows) => {

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
order.put("/complete", (req,res,next)=>{
    let orderPackId= req.body.orderPackId

    mysqlConnection.query("UPDATE orders SET finish='done' , orderPackId="+orderPackId+ "  WHERE idUser="+req.infoInToken.id+" and orderPackId is null" , (err, rows) => {
        if (err){
            res.send({error: err});
            return ;
        }
        else{
            console.log(rows)
        }
        res.send({messege:"done"})
    })
})

order.put("/:id", (req,res,next)=>{
    let id  = req.params.id
    let number = req.body.number
    
    mysqlConnection.query("UPDATE orders SET number='"+number+"' WHERE hamburgerId="+id+" and finish is null and idUser="+ req.infoInToken.id , (err, rows) => {
        if (err){
            res.send({error: err});
            return ;
        }
        else{
            console.log(rows)
        }
        res.send({messege:"done"})
    })
})

order.delete("/all",(req,res)=>{
    mysqlConnection.query("DELETE FROM orders WHERE finish is null and idUser="+ req.infoInToken.id,(err,rows)=>{
        if (err){
            res.send({error: err});
            return ;
        }
        else{
            console.log(rows)
        }
        res.send({messege:"done"})
    }
)})

order.delete("/:id",(req,res)=>{
    let id = req.params.id

    mysqlConnection.query("DELETE FROM orders WHERE hamburgerId="+id+" and finish is null and idUser="+ req.infoInToken.id,(err,rows)=>{
        if (err){
            res.send({error: err});
            return ;
        }
        else{
            console.log(rows)
        }
        res.send({messege:"done"})
    }
)})



module.exports=order