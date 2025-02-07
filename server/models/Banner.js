const mongoose = require('mongoose')
const { Schema } = mongoose

const BannerSchema = new Schema({
    imageUrl: { type: String, required: true },
    type: { type: String, required: true },
    version: { type: String, required: true }
}, { timestamps: true })

const Banner = mongoose.model('banner', BannerSchema)
module.exports = Banner
