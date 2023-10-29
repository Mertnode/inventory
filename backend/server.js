const express = require('express')
const connectDB = require('./config/connectDB')
const app = express()
require('dotenv').config()
const bodyParser = require('body-parser')
const userRoute = require("./routes/userRoute")
const port = process.env.PORT || 5000
connectDB()
// !important! 
// you need to install the following libraries |express|[dotenv > if required]
// or run this command >> npm i express dotenv 


// Middlewares
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(bodyParser.json())



// Routes Middlware
app.use("/api/users",userRoute)

app.get('/' , (req , res)=>{

   res.send('hello from simple server :)')

})


app.listen(port , ()=> console.log('> Server is up and running on port : ' + port))