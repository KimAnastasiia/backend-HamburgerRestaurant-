const express = require('express');
const orderPack = express.Router();

const mysqlConnection = require("./mysqlConnection")

orderPack.get("/",(req,res,next)=>{

    let p = req.query.p 
    p=(p-1)*4
    // p=2 your system 1 and you need 2
    // p=3 your system 2 and you need 4
    // p=4 your system 3 and you need 6
    //number of page 1,2,3,4,
    mysqlConnection.query('SELECT *, orders.id AS "key" FROM  orderpack JOIN orders ON orderpack.id=orders.orderPackId WHERE userId = '+req.infoInToken.id+ ' GROUP BY orders.orderPackId ORDER BY orderpack.id DESC LIMIT 4 OFFSET '+p, (err, rows) => {

        if (err){
            res.send({error:err});
            return
        }
        else{
            res.send(rows)
        }
    })
})

orderPack.get("/status",(req,res,next)=>{

    mysqlConnection.query('SELECT * FROM  orderpack JOIN orders ON orderpack.id=orders.orderPackId WHERE orderpack.status != "Cancel" AND orderpack.status != "Finished" GROUP BY orders.orderPackId ORDER BY orderpack.id DESC', (err, rows) => {

        if (err){
            res.send({error:err});
            return
        }
        else
            console.log(rows);

        res.send(rows)
    })
})
orderPack.get("/count",(req,res,next)=>{

    mysqlConnection.query('SELECT COUNT(*) AS number FROM  orderpack WHERE userId = ' +req.infoInToken.id, (err, rows) => {

        if (err){
            res.send({error:err});
            return
        }
        else{
            res.send(rows)
        }
    })
})

orderPack.post('/', (req, res) => {
    const d = Date.now();
    let total = req.body.total 
    let points = req.body.total * 0.05 
    mysqlConnection.query("INSERT INTO orderPack ( date, userId, total, status, points) VALUES ('"+d+"', "+req.infoInToken.id+", "+total+", 'Pending',"+points+" ) ", (err, rows) => {

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

orderPack.put('/', (req, res) => {

    let status = req.body.status
    let id = req.body.id

    mysqlConnection.query("UPDATE orderpack SET status= '"+status+"' WHERE id="+id, (err, rows) => {

        if (err){
            res.send({error: err});
            return ;
        }
        else{

           if(status=="Finished"){
                mysqlConnection.query("SELECT * from orderpack WHERE id="+id, (err2, rows2) => {
                    if (err2){
                        res.send({error: err2});
                        return ;
                    }

                    mysqlConnection.query("UPDATE users set points= points + "+rows2[0].points+" where id="+rows2[0].userId, (err3, rows3) => {
                        if (err3){
                            res.send({error: err3});
                            return ;
                        }
                        res.send(
                            {
                                messege:"done",
                                rows: rows3,
                              
                            }
                        )
                    })

                })
           }else{
                res.send(
                    {
                        messege:"done",
                        rows: rows,
                    
                    }
                )
           }


        }
    })

})

orderPack.put("/orderDetails", (req,res,next)=>{
    let call= req.body.call
    let deliveryDate= req.body.deliveryDate
    let deliveryTime= req.body.deliveryTime
    let commentForAdress= req.body.commentForAdress
    let commentForOrder= req.body.commentForOrder
    let id= req.body.id
    mysqlConnection.query("UPDATE orderpack SET telephoneCall="+call+" , deliveryDate='"+deliveryDate+"' , deliveryTime='"+deliveryTime+"' , commentForAdress= '"+commentForAdress+"' , commentForOrder= '"+commentForOrder+"'  WHERE userId="+req.infoInToken.id+" and id ="+id , (err, rows) => {
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

module.exports=orderPack