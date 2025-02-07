const mongoose = require("mongoose")
const { Schema } = mongoose

const CategorySchema = new Schema({
    name: { type: String, required: true, unique: true },
    imageUrl: { type: String, required: true }
}, { timestamps: true })

const Category = mongoose.model('category', CategorySchema)
module.exports = Category