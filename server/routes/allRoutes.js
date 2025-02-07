const express = require('express')
const router = express.Router()

const User = require('../controllers/User')
const Category = require('../controllers/Category')
const Product = require('../controllers/Product')
const Review = require('../controllers/Review')
const ShippingFee = require('../controllers/ShippingFee')
const Order = require('../controllers/Order')
const Banner = require('../controllers/Banner')
const Address = require('../controllers/Address')



router.use('/auth', User)
router.use('/category', Category)
router.use('/product', Product)
router.use('/review', Review)
router.use('/shippingfee', ShippingFee)
router.use('/order', Order)
router.use('/banner', Banner)
router.use('/address', Address)

module.exports = router