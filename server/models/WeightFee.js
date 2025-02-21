const mongoose = require('mongoose')
const { Schema } = mongoose

const WeightFeeSchema = new Schema({
    range: { type: String, required: true, unique: true },
    fee: { type: Number, required: true }
}, { timestamps: true })

const WeightFee = mongoose.model('weightfee', WeightFeeSchema)
module.exports = WeightFee