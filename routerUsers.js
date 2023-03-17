
const express = require('express');
const routerUsers = express.Router();
const mysqlConnection = require("./mysqlConnection")

routerUsers.get("/profile",(req,res,next)=>{
  
    mysqlConnection.query("SELECT email, name, surname, admin, country, id, payment, points, street, entrance, floor, apartment, intercom  FROM users where id = "+req.infoInToken.id+"", (err, rows) => {

        if (err)
            res.send({error:err});
        else
            console.log(rows);

        res.send(rows)
    })
})


routerUsers.post('/comments', (req, res) => {

    let hamburgerId = req.body.hamburgerId
    let comment = req.body.comment
    const d = Date.now();
    mysqlConnection.query("INSERT INTO comments (userId, hamburgerId, comment, date) VALUES  ("+req.infoInToken.id+","+hamburgerId+",'"+comment+"', "+d+"  ) ", (err, rows) => {

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
routerUsers.put('/address', (req, res) => {

    let street = req.body.street
    let entrance = req.body.entrance
    let floor = req.body.floor
    let apartment = req.body.apartment
    let intercom = req.body.intercom
    let points=req.body.points

    

    mysqlConnection.query("UPDATE users SET street='"+street+ "', entrance='"+entrance+ "', floor='"+floor+ "', apartment='"+apartment+ "', intercom='"+intercom+ "', points="+points+ "  WHERE id="+req.infoInToken.id+"", (err, rows) => {

        if (err){
            res.send({error: err});
            return ;
        }
        else{
        res.send(
            {
                messege:"done",
                rows: rows,
              
            })
        }
    })

})
routerUsers.put('/editProfileInfo', (req, res) => {

    let colum = req.body.colum
    let value = req.body.value

    mysqlConnection.query("UPDATE users SET "+colum+" = '"+value+"' WHERE id="+req.infoInToken.id+"", (err, rows) => {

        if (err){
            res.send({error: err});
            return ;
        }
        else{
        res.send(
            {
                messege:"done",
                rows: rows,
              
            })
        }
    })

})
routerUsers.put('/', (req, res) => {

    let hamburgerId = req.body.hamburgerId
    let comment = req.body.comment
    let id = req.params.id
    mysqlConnection.query("UPDATE comments SET comment= '"+comment+"' WHERE hamburgerId= "+hamburgerId+" and userId="+req.infoInToken.id+" and id="+id, (err, rows) => {

        if (err){
            res.send({error: err});
            return ;
        }
        else{
        res.send(
            {
                messege:"done",
                rows: rows,
              
            })
        }
    })

})

routerUsers.delete('/:id/:hamburgerId', (req, res) => {
    let hamburgerId = req.params.hamburgerId
    let id = req.params.id
    mysqlConnection.query("DELETE FROM comments WHERE hamburgerId="+hamburgerId+" and userId="+req.infoInToken.id+" and id="+id,(err,rows)=>{
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



module.exports=routerUsers