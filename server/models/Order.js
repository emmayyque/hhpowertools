const mongoose = require('mongoose')
const { Schema } = mongoose

const OrderItemSchema = new Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
    quantity: { type: Number, required: true }
})

const OrderSchema = new Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    orderItems: [OrderItemSchema],
    shippingFee: { type: Number, required: true },
    totalBill: { type: Number, required: true },
    status: { type: Number, required: true, default: 1 },
    address: { type: mongoose.Schema.Types.ObjectId, ref: 'address', required: true },
    orderNo: { type: String, required: true }
}, { timestamps: true })

const Order = mongoose.model('order', OrderSchema)
module.exports = Order

// Statuses
// 0 - Declined
// 1 - Pending
// 2 - Approved
// 3 - Delivered