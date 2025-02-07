const express = require('express')
const router = express.Router()
const multer = require("multer");
const fs = require('fs');
const path = require('path');
const Category = require('../models/Category')
const Product = require('../models/Product')
const { body, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const fetchUser = require('../middlewares/fetchUser');
const Specification = require('../models/Specification');
const jwtSecret = process.env.JWT_SECRET


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb (null, "./uploads/categories")
  },
  filename: function (req, file, cb) {
    return cb (null, `${Date.now()}-${file.originalname}`)
  }
})

const upload = multer({ storage })

// ROUTE 1: Get All Categories: GET "/api/category/getall". No Login is required
router.get(
    "/getall", 
    async (req, res) => {
        let success = false
        try {
            let categories = await Category.find()
            return res.status(200).json({ success: true, data: categories })

        } catch (error) {
            console.log(error.message)
            res.status(500).json({ error: "Internal Server Error" })
        }
    }
)

// ROUTE 2: Add New Category: GET "/api/category/createcategory". Login is required
router.post(
    '/add',
    upload.single('categoryImg'),
    [
        body("name", "Category name cannot be less than 4 characters").isLength({ min: 4 })
    ],
    fetchUser, 
    async (req, res) => {
        let success = false; 
        console.log(req.body)
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success, errors: errors.array() });
            }
            
            if (req.user.role != 1) {
                return res.status(400).json({ success, error: "Not Authorized to access" });
            }

            let category = await Category.findOne({name: req.body.name})
            if (category) {
                return res.status(400).json({ success, message: "Category name already exists" });
            }

            category = await Category.create({
                name: req.body.name, 
                imageUrl: `/uploads/categories/${req.file.filename}`
            })

            return res.status(201).json({ success: true, message: "Category Added Successfully" })

        } catch (error) {
            console.log(error.message)
            res.status(500).json({ error: "Internal Server Error" })
        }
    }
)


// ROUTE 3: Get one category USING GET: "api/category/getone/:id". Login is required
router.get(
    "/getone/:id",
    fetchUser,
    async (req, res) => {
        let success = false
        try {
            if (req.user.role != 1) {
                return res.status(401).json({ success, error: "Not Authorized to access" })
            }

            const category = await Category.findById( req.params.id )
            if (!category) {
                return res.status(404).json({ success, error: "Category not found" })
            }

            return res.status(200).json({ success: true, data: category })
        } catch (error) {
            console.log(error.message)
            res.status(500).json({ error: "Internal Server Error" })
        }
    }
)

// ROUTE 4: Update Category using PUT: "api/category/update"
router.put(
    "/update/:id",
    fetchUser,
    upload.single('categoryImg'),
    [
        body("name", "Category name cannot be less than 4 characters").isLength({ min: 4 })
    ],
    async (req, res) => {
        let success = false
        try {
            
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ success, errors: errors.array() })
            }

            if (req.user.role != 1 ){
                return res.status(401).json({ success, error: "Not Authorized to access"})
            }

            let category = await Category.findById( req.params.id )
            if (!category) {
                return res.status(404).json({ success, error: "Category not found" })
            }

            const updatedCategory = {}
            if (req.body.name) { updatedCategory.name = req.body.name }
            if (req.file) { 
                updatedCategory.imageUrl = `/uploads/categories/${req.file.filename}`
                const prevImagePath = path.join(__dirname, '..', category.imageUrl)
                console.log(prevImagePath)
                fs.unlink(prevImagePath, (err) => {
                    if (err) {
                        console.log("error".err)
                    }
                })
            }

            category = await Category.findByIdAndUpdate(req.params.id, {$set: updatedCategory}, {new: true})
            return res.status(200).json({ success: true, message: "Category updated successfully" })

        } catch (error) {
            console.log(error.message)
            res.status(500).json({ error: "Internal Server Error" })
        }
    }
)

const deleteProductImages = (imagesArr) => {
    imagesArr.forEach(image => {
        let imgFullPath = path.join(__dirname, '../', image.imageUrl)
        fs.unlink(imgFullPath, (err) => {
            console.log(err)
        })
    })
}

const deleteSpecifications = async (productInCategory) => {
    await Promise.all(productInCategory.map(async (product) => {
        await Specification.deleteMany({ product: product._id });
        deleteProductImages(product.images)
        await Product.findByIdAndDelete(product._id)
    }));
}

// ROUTE 5: Delete a category using DELETE: "api/category/delete/:id"
router.delete(
    "/delete/:id",
    fetchUser,
    async (req, res) => {
        let success = false
        let isDeleted = true
        try {
            if (req.user.role != 1 ){
                return res.status(401).json({ success, error: "Not Authorized to access"})
            }

            let category = await Category.findById(req.params.id)
            if (!category) {
                return res.status(404).json({ success, error: "Category not found" })
            }

            catImageFilePath = path.join(__dirname, '..', category.imageUrl)
            fs.unlink(catImageFilePath, (err) => {
                if (err) {
                    isDeleted = false
                    console.log(err)
                }
            })

            if ( isDeleted ) {
                let productInCategory = await Product.find({ category: req.params.id })

                await deleteSpecifications(productInCategory)
                // await Product.deleteMany({ category: req.params.id })
                category = await Category.findByIdAndDelete(req.params.id)
                return res.status(200).json({ success: true, message: "Category deleted successfully" })

            } else {
                return res.status(400).json({ success, error: "Category not deleted" })
            }
        } catch (error) {
            console.log(error.message)
            res.status(500).json({ error: "Internal Server Error" })
        }
    }
)

module.exports = router