const mongoose = require("mongoose");



// noinspection JSValidateTypes
const productSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"user"
    },
    name : {
        type: String,
        required: [true , "Please add a name"],
        trim:true
    },
    sku : {
        type:String,
        required:true,
        default:"SKU",
        trim: true
    },
    category : {
        type:String,
        requried:[true,"Please add a category"],
        trim: true
    },
    quantity : {
        type:String,
        requried: [true,"Please add a quantity"],
        trim : true
    },
    description : {
        type:String,
        requried:[true,"Please add a description"],
        trim : true
    },
    image : {
        type:Object,
        default: {}
    }
},{
    timestamps:true
})
const Product = mongoose.model("Product",productSchema)
module.exports = Product