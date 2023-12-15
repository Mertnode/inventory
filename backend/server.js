const express = require('express')
const connectDB = require('./config/connectDB')
const app = express()
require('dotenv').config()
const bodyParser = require('body-parser')
const userRoute = require("./routes/userRoute")
const productRoute = require("./routes/productRoute")
const errorHandler = require('./middleware/errorMiddleware')
const port = process.env.PORT || 5000
const cookieParser = require("cookie-parser")
const path = require('path');
const { connectCloud } = require('./config/cloud')

connectDB()
connectCloud()
// !important! 
// you need to install the following libraries |express|[dotenv > if required]
// or run this command >> npm i express dotenv 


// Middlewares
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(bodyParser.json())

app.use("/uploads",express.static(path.join(__dirname, "uploads")))

// Routes Middlware
app.get('/' , (req , res)=>{

   res.send('hello from simple server :)')

})
app.use(errorHandler)


app.use("/api/users",userRoute)
app.use("/api/products",productRoute)




app.listen(port , ()=> console.log('> Server is up and running on port : ' + port))