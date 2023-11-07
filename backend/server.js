const express = require('express')
const connectDB = require('./config/connectDB')
const app = express()
require('dotenv').config()
const bodyParser = require('body-parser')
const userRoute = require("./routes/userRoute")
const errorHandler = require('./middleware/errorMiddleware')
const port = process.env.PORT || 5000
const cookieParser = require("cookie-parser")
connectDB()
// !important! 
// you need to install the following libraries |express|[dotenv > if required]
// or run this command >> npm i express dotenv 


// Middlewares
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(bodyParser.json())



// Routes Middlware
app.get('/' , (req , res)=>{

   res.send('hello from simple server :)')

})
app.use(errorHandler)


app.use("/api/users",userRoute)




app.listen(port , ()=> console.log('> Server is up and running on port : ' + port))