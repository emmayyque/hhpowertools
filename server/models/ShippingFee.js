const mongoose = require('mongoose')
const { Schema } = mongoose

const ShippingFeeSchema = new Schema({
    region: { type: String, required: true, unique: true },
    fee: { type: Number, required: true }
}, { timestamps: true })

const ShippingFee = mongoose.model('shippingfee', ShippingFeeSchema)
module.exports = ShippingFee