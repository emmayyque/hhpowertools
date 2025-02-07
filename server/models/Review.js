const mongoose = require('mongoose')
const { Schema } = mongoose

const ReviewSchema = new Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
    review: { type: String, required: true },
    rating: { type: Number, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true }
}, { timestamps: true })

const Review = mongoose.model('review', ReviewSchema)
module.exports = Review