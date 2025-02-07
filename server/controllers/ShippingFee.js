const express = require('express')
const router = express.Router()
const ShippingFee = require('../models/ShippingFee')
const fetchUser = require('../middlewares/fetchUser')
const { body, validationResult } = require('express-validator')

// ROUTE 1: Get All Shipping Fees using GET. "/api/shippingfee/getall". No Login Required
router.get(
    "/getall",
    async (req, res) => {
        try {
            let shippingFees = await ShippingFee.find()
            return res.status(200).json({ success: true, data: shippingFees })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: "Internal Server Error" })
        }
    }
)

// ROUTE 2: Get One by Id using GET. "/api/shippingfee/getone/:id". No Login Required
router.get(
    "/getone/:id",
    async (req, res) => {
        try {
            let shippingFee = await ShippingFee.findById(req.params.id)
            if (!shippingFee) {
                return res.status(404).json({ success: false, error: "Shipping Fee not found" })
            }
            return res.status(200).json({ success: true, data: shippingFee })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: "Internal Server Error" })
        }
    }
)

// ROUTE 2: Get One by Id using GET. "/api/shippingfee/getone/:id". No Login Required
router.get(
    "/getonebyregion/:region",
    async (req, res) => {
        try {
            let shippingFee = await ShippingFee.findOne({ region: req.params.region })
            if (!shippingFee) {
                return res.status(404).json({ success: false, error: "Shipping Fee not found" })
            }
            return res.status(200).json({ success: true, data: shippingFee })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: "Internal Server Error" })
        }
    }
)

// ROUTE 2: Get One by Name sing GET. "/api/shippingfee/getonebyname/:name". No Login Required
router.get(
    "/getonebyregion/:region",
    async (req, res) => {
        try {
            let shippingFee = await ShippingFee.findOne({ region: req.params.region })
            if (!shippingFee) {
                return res.status(404).json({ success: false, error: "Shipping Fee not found" })
            }
            return res.status(200).json({ success: true, data: shippingFee })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: "Internal Server Error" })
        }
    }
)

// ROUTE 3: Add New Shipping Fee using POST. "/api/shippingfee/add". Login required
router.post(
    "/add",
    [
        body('region', 'Region cannot be shorter then 4').isLength({ min: 4 }),
        body('fee', 'Fee cannot be blank').exists(),
        body('fee', 'Fee can only be numeric 0 to onwards').isFloat({ min: 0 })
    ],
    fetchUser,
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, error: errors.array() })
            }

            if (req.user.role != 1) {
                return res.status(401).json({ success: false, error: "Not authorized to access" })
            }


            const { region, fee } = req.body
            
            let shippingFee = await ShippingFee.findOne({ region })
            if (shippingFee) {
                return res.status(400).json({ success: false, error: "Shipping region already exists" })
            }

            shippingFee = await ShippingFee.create({
                region: region,
                fee: fee
            })

            return res.status(201).json({ success: true, message: "Shipping Cost added succesfully" })

            
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: "Internal Server Error" })
        }
    }
)

// ROUTE 4: Update Shipping Fee using PUT. "/api/shippingfee/update/:id". Login required
router.put(
    "/update/:id",
    [
        body('fee', 'Fee cannot be blank').exists(),
        body('fee', 'Fee can only be numeric 0 to onwards').isFloat({ min: 0 })
    ],
    fetchUser,
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, error: errors.array() })
            }
            
            if (req.user.role != 1) {
                return res.status(401).json({ success: false, error: "Not authorized to access" })
            }

            let shippingFee = await ShippingFee.findById(req.params.id)
            if (!shippingFee) {
                return res.status(404).json({ success: false, error: "Shipping Fee not found" })
            }

            const { fee } = req.body
            const newShippingFee = {}
            if ( fee ) { newShippingFee.fee = fee }

            shippingFee = await ShippingFee.findByIdAndUpdate(req.params.id, {$set: newShippingFee}, {new: true})
            return res.status(200).json({ success: true, message: "Shipping Fee updated" })
            
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: "Internal Server Error" })
        }
    }
)

// ROUTE 5: Delete Shipping Fee using DELETE. "/api/shippingfee/delete/:id". Login required
router.delete(
    "/delete/:id",
    fetchUser,
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, error: errors.array() })
            }
            
            if (req.user.role != 1) {
                return res.status(401).json({ success: false, error: "Not authorized to access" })
            }

            let shippingFee = await ShippingFee.findById(req.params.id)
            if (!shippingFee) {
                return res.status(404).json({ success: false, error: "Shipping Fee not found" })
            }

            shippingFee = await ShippingFee.findByIdAndDelete(req.params.id)
            return res.status(200).json({ success: true, message: "Shipping Fee deleted successfully" })
            
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: "Internal Server Error" })
        }
    }
)


module.exports = router