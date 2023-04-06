const express = require('express')
const app = express()
const port = 2000

// IMPORTANT create PUBLIC directory
app.use(express.static('public'));


// IMPORTANT for UPLOAD pictures
var fileUpload = require('express-fileupload');
app.use(fileUpload());


app.use(express.json())
var cors = require('cors')
app.use(cors())
const objectOfApiKey = require("./objectApiKey")
require("dotenv").config();
const jwt = require("jsonwebtoken");

const routerHamburgers = require("./routerHamburgers")
const routerOrders = require("./routerOrder")
const routerLogin = require("./routerLogin")
const routerOrderPack = require("./routerOrderPack")
const routerUsers =  require("./routerUsers")
const routerComments = require("./routerComments")

app.use(["/order","/orderPack","/users","/hamburguers/comments/" ] ,(req,res,next)=>{
    let apiKey = req.query.apiKey
  
    let obj = objectOfApiKey.find((obj)=>
      obj===apiKey
    )
    if(!obj){
        res.send({error:"error"})
        return
    }
    
    let infoInToken = jwt.verify(apiKey, "secret");
    req.infoInToken = infoInToken;

    next()
})

app.use("/hamburgers",routerHamburgers)
app.use("/order", routerOrders )
app.use("/login", routerLogin )
app.use("/orderPack", routerOrderPack)
app.use("/users", routerUsers)
app.use("/comments", routerComments)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})