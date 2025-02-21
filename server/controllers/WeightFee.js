const express = require('express')
const router = express.Router()
const WeightFee = require('../models/WeightFee')
const fetchUser = require('../middlewares/fetchUser')
const { body, validationResult } = require('express-validator')

// ROUTE 1: Get All Shipping Fees using GET. "/api/weightfee/getall". Login Required
router.get(
    "/getall",
    fetchUser,
    async (req, res) => {
        try {
            if (req.user.role != 1) {
                return res.status(401).json({ success: false, error: "Not authorized to access" })
            }

            let weightFees = await WeightFee.find()
            return res.status(200).json({ success: true, data: weightFees })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: "Internal Server Error" })
        }
    }
)

// ROUTE 2: Get One by Id using GET. "/api/weightfee/getone/:id". Login Required
router.get(
    "/getone/:id",
    fetchUser,
    async (req, res) => {
        try {
            if (req.user.role != 1) {
                return res.status(401).json({ success: false, error: "Not authorized to access" })
            }

            let weightFee = await WeightFee.findById(req.params.id)
            if (!weightFee) {
                return res.status(404).json({ success: false, error: "Weight Fee not found" })
            }
            return res.status(200).json({ success: true, data: weightFee })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: "Internal Server Error" })
        }
    }
)

// ROUTE 3: Get One by Id using GET. "/api/weightfee/getonebyrange/:range". No Login Required
router.get(
    "/getonebyrange/:range",
    async (req, res) => {
        try {
            let weightFee = await WeightFee.findOne({ range: req.params.range })
            if (!weightFee) {
                return res.status(404).json({ success: false, error: "Weight Fee not found" })
            }
            return res.status(200).json({ success: true, data: weightFee })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: "Internal Server Error" })
        }
    }
)

// ROUTE 3: Add New Shipping Fee using POST. "/api/weightfee/add". Login required
router.post(
    "/add",
    [
        body('range', 'Weight range cannot be shorter then 5').isLength({ min: 5 }),
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


            const { range, fee } = req.body
            
            let weightFee = await WeightFee.findOne({ range })
            
            console.log(range)
            if (weightFee) {
                console.log("Weight exists")
                return res.status(400).json({ success: false, error: "Weight range already exists" })
            }

            weightFee = await WeightFee.create({
                range: range,
                fee: fee
            })

            return res.status(201).json({ success: true, message: "Weight Fee added succesfully" })
            
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: "Internal Server Error" })
        }
    }
)

// ROUTE 4: Update Shipping Fee using PUT. "/api/weightfee/update/:id". Login required
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

            let weightFee = await WeightFee.findById(req.params.id)
            if (!weightFee) {
                return res.status(404).json({ success: false, error: "Weight Fee not found" })
            }

            const { fee } = req.body
            const newWeightFee = {}
            if ( fee ) { newWeightFee.fee = fee }

            shippingFee = await WeightFee.findByIdAndUpdate(req.params.id, {$set: newWeightFee}, {new: true})
            return res.status(200).json({ success: true, message: "Weight Fee updated" })
            
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: "Internal Server Error" })
        }
    }
)

// ROUTE 5: Delete Shipping Fee using DELETE. "/api/weightfee/delete/:id". Login required
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

            let weightFee = await WeightFee.findById(req.params.id)
            if (!weightFee) {
                return res.status(404).json({ success: false, error: "Weight Fee not found" })
            }

            weightFee = await WeightFee.findByIdAndDelete(req.params.id)
            return res.status(200).json({ success: true, message: "Weight Fee deleted successfully" })
            
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: "Internal Server Error" })
        }
    }
)


module.exports = router