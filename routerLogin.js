const express = require('express');
const routerLogin = express.Router();
const objectOfApiKey = require("./objectApiKey")
const crypto = require('crypto');
let keyEncrypt = 'password';
let algorithm = 'aes256'


const mysqlConnection = require("./mysqlConnection")

const jwt = require("jsonwebtoken");

routerLogin.get("/",(req,res,next)=>{
    
    let email = req.query.email

    mysqlConnection.query("SELECT email FROM users where email = '"+email+"'", (err, rows) => {
        if (rows.length>=1){
            res.send({error:"This email already exist"});}
        else{
        res.send(rows)}
    })
})
routerLogin.post("/create-account",(req,res,next)=>{
    let cipher = crypto.createCipher(algorithm, keyEncrypt);
    let email = req.body.email
    let password = req.body.password
    let passwordEncript = cipher.update(password, 'utf8', 'hex') + cipher.final('hex');
    let name =  req.body.name
    let surname =  req.body.surname
    let country =  req.body.country
    let payment =  req.body.payment
    
   
    mysqlConnection.query("INSERT INTO users ( email, password, name, surname, country, payment  ) VALUES ('"+email+"','"+passwordEncript+"','"+name+"','"+surname+"','"+country+"','"+payment+"') ", (err, rows) => {

        if (err){
            res.send({error: err});
            return ;
        }
        mysqlConnection.query("SELECT * FROM users where email='"+email+"' and password='"+passwordEncript+"'", (err, rows) => {
            if (err){
                res.send({error: err});
                return ;
            }
           
            
            if(rows.length>=1 && rows[0].admin!=="true"){
    
                console.log(rows[0].id)
                let apiKey = jwt.sign(
                    { 
                        email: email,
                        id: rows[0].id,
                        userId: rows[0].id
    
                    },
                    "secret");
    
                objectOfApiKey.push(apiKey)
    
                res.send(
                {
                    messege:"user",
                    apiKey: apiKey,
                    name:rows[0].name,
                    userId: rows[0].id
                })
                return 
            }
            if(rows.length>=1 && rows[0].admin=="true"){
    
                console.log(rows[0].id)
                let apiKey = jwt.sign(
                    { 
                        email: email,
                        id: rows[0].id,
                        
                    },
                    "secret");
    
                objectOfApiKey.push(apiKey)
    
                res.send(
                {
                    messege:"admin",
                    apiKey: apiKey,
                    name:rows[0].name,
                    userId: rows[0].id
                })
                return
            }
            if(rows.length==0){
                res.send( { messege:"Incorrect email or password",}) 
                return
            }
    
        }
        )
    })


})


routerLogin.post("/",(req,res,next)=>{
    let email = req.body.email
    let password = req.body.password
    let cipher = crypto.createCipher(algorithm, keyEncrypt);
    let passwordEncript = cipher.update(password, 'utf8', 'hex') + cipher.final('hex');
    
    

    mysqlConnection.query("SELECT * FROM users where email='"+email+"' and password='"+passwordEncript+"'", (err, rows) => {
        if (err){
            res.send({error: err});
            return ;
        }
        else{
            console.log(rows)
        }
        if(rows.length>=1 && rows[0].admin!=="true"){

            console.log(rows[0].id)
            let apiKey = jwt.sign(
                { 
                    email: email,
                    id: rows[0].id,
                    userId: rows[0].id

                },
                "secret");

            objectOfApiKey.push(apiKey)

            res.send(
            {
                messege:"user",
                apiKey: apiKey,
                name:rows[0].name,
                userId: rows[0].id
            })
        }
        if(rows.length>=1 && rows[0].admin=="true"){

            console.log(rows[0].id)
            let apiKey = jwt.sign(
                { 
                    email: email,
                    id: rows[0].id,
                    
                },
                "secret");

            objectOfApiKey.push(apiKey)

            res.send(
            {
                messege:"admin",
                apiKey: apiKey,
                name:rows[0].name,
                userId: rows[0].id
            })
        }
        if(rows.length==0){
            res.send(
                {
                    messege:"Incorrect email or password",
                })
        }

    }
    )
})

routerLogin.post("/log-out",(req,res,next)=>{
    let apiKey=req.query.apiKey

    let index = objectOfApiKey.indexOf(apiKey)

    if (index > -1) { // only splice array when item is found
        objectOfApiKey.splice(index, 1); // 2nd parameter means remove one item only
    }

    //objectOfApiKey = objectOfApiKey.filter( e => e != apiKey)

    res.send(
        {
            messege:"done"
        }
    )

})





module.exports=routerLogin