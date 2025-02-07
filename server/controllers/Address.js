const express = require('express')
const router = express.Router()
const Address = require('../models/Address')
const fetchUser = require('../middlewares/fetchUser')

// ROUTE 1 : Get User Addresses using GET. "/api/address/getallbycustomer". Login required
router.get(
    "/getallbycustomer",
    fetchUser,
    async (req, res) => {
        try {
            if (req.user.role != 2) {
                return res.status(401).json({ success: false, error: "Not authorized to access" })
            }
            
            const addresses = await Address.find({ customer: req.user.id, isActive: 1 }).populate("customer", "firstName lastName")
            return res.status(200).json({ success: true, data: addresses })
            
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ error: "Internal server error" })
        }
    }
)

// ROUTE 2 : Delete address using DELETE. "/api/address/deleteaddress/:id". Login required
router.put(
    "/deleteaddress/:id",
    fetchUser,
    async (req, res) => {
        try {
            if (req.user.role != 2) {
                return res.status(401).json({ success: false, error: "Not authorized to access" })
            }
            
            let address = await Address.findById(req.params.id)
            if (req.user.id != address.customer) {
                return res.status(401).json({ success: false, error: "Not authorized to access" })
            }

            address.isActive = 0

            address = await Address.findByIdAndUpdate(req.params.id, {$set: address}, {new: true})
            return res.status(200).json({ success: true, message: "Address deleted successfully !!"})
            
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ error: "Internal server error" })
        }
    }
)

module.exports = router