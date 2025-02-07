const mongoose = require('mongoose')
const { Schema } = mongoose

const AddressSchema = new Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    street: { type: String, required: true },
    area: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: Number },
    isActive: { type: Boolean, default: 1 }
}, { timestamps: true })

const Address = mongoose.model('address', AddressSchema)
module.exports = Address