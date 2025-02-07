const express = require('express')
const router = express.Router()
const Review = require('../models/Review')
const Product = require('../models/Product')
const { body, validationResult } = require('express-validator')
const fetchUser = require('../middlewares/fetchUser')

// ROUTE 1: Get All Reviews using GET: "/api/review/getall". No Login required
router.get(
    "/getall",
    async (req, res) => {
        try {
            let reviews = await Review.find().sort({ createdAt: -1 }).populate('product name')
            return res.status(200).json({ success: true, data: reviews })
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ error: "Internal Server Error" })
        }
    }
)


// ROUTE 2: Get All Reviews By Product using GET: "/api/review/getbyproduct/:id". No Login required
router.get(
    "/getbyproduct/:id",
    async (req, res) => {
        try {
            let reviews = await Review.find({ product: req.params.id })
            return res.status(200).json({ success: true, data: reviews })
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ error: "Internal Server Error" })
        }   
    }
)

// ROUTE 3: Add new Review using POST: "/api/review/add". No Login required
router.post(
    "/add",
    [
        body('review', 'Review cannot be blank').exists(),
        body('review', 'Review cannot be shorter than 4 characters').isLength({ min: 4 }),
        body('rating', 'Rating can be only 1-5').isFloat({ min: 1, max: 5 }),
        body('product', 'Product must be selected').exists().isLength({ min: 21 }),
        body('name', 'Name cannot shorter than 3').isLength({ min: 3 }),
        body('email', 'Enter a valid email address').isEmail()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return res.status(400).json({ success: false, error: errors.array() })
            }
            const { review, rating, product, name, email } = req.body
            const prodFromDb = await Product.findById(product)
            if (!prodFromDb) {
                return res.status(404).json({ success: false, error: "Product not found" })
            }

            let newReview = await Review.create({
                product: product,
                review: review, 
                rating: rating,
                name: name,
                email: email
            })

            return res.status(201).json({ success: true, message: "Review added successfully" })
            
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ error: "Internal Server Error" })
        }
    }
)

// ROUTE 4: Delete Review using DELETE: "/api/review/delete/:id". Login is required
router.delete(
    "/delete/:id",
    fetchUser,
    async (req, res) => {
        try {
            if (req.user.role != 1) {
                return res.status(401).json({ success: false, error: "Not authorized to access" })
            }

            let review = await Review.findById(req.params.id) 
            if (!review) {
                return res.status(400).json({ success: false, error: "Review not found" })
            }

            review = await Review.findByIdAndDelete(req.params.id)
            
            return res.status(200).json({ success: true, message: "Review deleted successfully" })

        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ error: "Internal Server Error" })
        }
    }
)

// ROUTE 5: Get Reviews Count. using GET "/api/review/getcount"
router.get(
    "/getcount",
    fetchUser,
    async (req, res) => {
        try {      
            if (req.user.role != 1) {
                return res.status(401).json({ success: false, error: "Not authorized to access" })
            }

            const { filter } = req.query
            let filterCondition = {}

            if (filter) {
                let startDate = new Date()
                switch(filter) {
                    case "past7days":
                        startDate.setDate(startDate.getDate() - 7)
                        break;
                    case "past30days":
                        startDate.setDate(startDate.getDate() - 30)
                        break;
                    case "past6months":
                        startDate.setMonth(startDate.getMonth() - 6)
                        break;
                    default:
                        startDate = null
                }

                if (startDate) {
                    filterCondition.createdAt = { $gte: startDate }
                }
            }

            const reviewsCount = await Review.countDocuments(filterCondition)

            return res.status(200).json({ success: true, data: reviewsCount })
            
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ error: "Internal server error" })
        }
    }
)

module.exports = router