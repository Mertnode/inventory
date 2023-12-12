const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    name: {
        type: String,
        required: [true, "Lütfen bir isim ekleyin"],
        trim: true
    },
    sku: {
        type: String,
        required: true,
        default: "SKU",
        trim: true
    },
    category: {
        type: String,
        required: [true, "Lütfen bir kategori ekleyin"],
        trim: true
    },
    quantity: {
        type: String,
        required: [true, "Lütfen bir miktar ekleyin"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Lütfen bir açıklama ekleyin"],
        trim: true
    },
    image: {
        type: Object,
        default: {}
    },
    price: {
        type: String,
    }
}, {
    timestamps: true
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
