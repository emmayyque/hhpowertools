const mongoose = require("mongoose")
const { Schema } = mongoose

const ImageSchema = new Schema({
    imageUrl: { type: String, required: true }
})

const ProductSchema = new Schema({
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'category', required: true },
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    features: { type: String },
    applications: { type: String },
    quantity: { type: Number, required: true },
    costPrice: { type: Number, required: true },
    discount: { type: Number, required: true, default: 0 },
    images: [ImageSchema],
    isActive: { type: Boolean, required: true, }
}, { timestamps: true })

const Product = mongoose.model('product', ProductSchema)
module.exports = Product