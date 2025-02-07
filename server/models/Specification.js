const mongoose = require("mongoose")
const { Schema } = mongoose

const SpecificationSchema = new Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
    name: { type: String, required: true },
    value: { type: String, required: true },
}, { timestamps: true })

const Specification = mongoose.model('specification', SpecificationSchema)
module.exports = Specification