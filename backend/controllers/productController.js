const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const cloudinary = require('cloudinary').v2;
exports.createProduct = asyncHandler(async (req, res) => {
    const { name, sku, category, quantity, price, description } = req.body;

    // Validation
    if (!name || !category || !price || !quantity || !description || !sku) {
        return res.status(400).json({
            success: false,
            message: "Please fill in all fields",
        });
    }
    //Handle Image Upload
    let fileData = {}
    if (req.file) {
        //save image to cloudinary
        let uploadedFile
        try {
            uploadedFile = await cloudinary.uploader.upload(req.file.path,{folder:"Pinvent App",resource_type:"image"})
        } catch (error) {
            res.status(500).json({error})
        }
        fileData = {
            fileName: req.file.originalname,
            fileName: uploadedFile.secure_url,
            fileName: req.file.mimetype,
            fileName: req.file.size,
        }
    }

    // Create Product
    const product = await Product.create({
        user: req.user.id,
        name,
        sku,
        category,
        quantity,
        price,
        description,
        image:fileData
    });

    res.status(201).json(product);
});
// get all products
exports.getProducts = asyncHandler(async(req,res)=> {
    const products = await Product.find({user: req.user.id})
    res.status(200).json(products)
})

//get single product

exports.getProduct = asyncHandler(async(req,res) => {
    const getPrdouct = await Product.findById(req.params.id)
    if (!getPrdouct) {
        res.status(404).json({success:false , message:"Product Not Found"})
    }

    if (getPrdouct.user.toString() !== req.user.id) {
        res.status(404).json({success:false , message:"User Not Authorized"})
    }
    res.status(200).json(getPrdouct)
})

//delete product

exports.deleteProduct = asyncHandler(async(req,res) => {
    const product = await Product.findByIdAndDelete(req.params.id)

    if (product.user.toString() !== req.user.id) {
        res.status(404).json({success:false , message:"User Not Authorized"})
    }
    res.status(200).json({success:true, message:"Product Delete Success"})

})