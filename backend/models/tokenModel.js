const mongoose = require("mongoose")
const {mongo} = require("mongoose");

const tokenSchema = mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        requried:true,
        ref: "user"
    },
    token: {
        type: String,
        requried: true
    },
    createdAt : {
        type: String,
        required:true
    },
    expiresAt : {
        type: Date,
        required: true
    }
})
const Token = mongoose.model("Token",tokenSchema)
module.exports = Token