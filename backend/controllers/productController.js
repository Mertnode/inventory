const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");

exports.createProduct = asyncHandler(async (req, res) => {
    const { name, sku, category, quantity, price, description } = req.body;

    // Validation
    if (!name || !category || !price || !quantity || !description || !sku) {
        return res.status(400).json({
            success: false,
            message: "Please fill in all fields",
        });
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
    });

    res.status(201).json(product);
});
