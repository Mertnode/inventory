const mongoose = require('mongoose')    
const userSchema = mongoose.Schema({
    name : {
        type : String,
        required: [true, "Please add a name"]
    },
    email : {
        type : String,
        required: [true, "Please add a email"],
        uniqe:true,
        trim:true,
        match: [
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,"Please enter a valid email"
        ]
    },
    password : {
        type : String,
        required: [true, "Please add a password"],
        minLenght:[6,"Password must be up to 6 characters"],
        maxLength:[23,"Password must be more than 23 characters "]
    },
    photo : {
        type : String,
        required: [true, "Please add a photo"],
        default: "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
    },
    phone : {
        type : String,
        default:"0"
    },
    bio : {
        type : String,
        default:"0"
    },
    
},{timestamps:true})
module.exports =  mongoose.model( 'User' , userSchema)