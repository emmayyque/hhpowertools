const express = require('express')
const router = express.Router()
const Product = require('../models/Product')
const Category = require('../models/Category')
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const { body, validationResult } = require('express-validator')
const fetchUser = require('../middlewares/fetchUser')
const Specification = require('../models/Specification')


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb (null, `./uploads/products`)
  },
  filename: function (req, file, cb) {
    return cb (null, `${Date.now()}-${file.originalname}`)
  }
})

const upload = multer({ storage })

const uploadMiddleware = (req, res) => {
    return new Promise((resolve, reject) => {
        upload.fields([
            { name: "image1", maxCount: 1 },
            { name: "image2", maxCount: 1 },
            { name: "image3", maxCount: 1 },
            { name: "image4", maxCount: 1 },
            { name: "image5", maxCount: 1 },
            { name: "image6", maxCount: 1 },        
        ])(req, res, (err) => {
            if (err) reject(err);
            else resolve();
        })
    })
}

const deleteFiles = (req, res) => {
    const { image1, image2, image3, image4, image5, image6 } = req.files

    if ( image1 ) {
        const imagPath = path.join(__dirname, '../', image1[0].path)
        fs.unlink(imagPath, (err) => {
            if (err) {
                console.log(err)
            }
        })
    }

    if ( image2 ) {
        const imagPath = path.join(__dirname, '../', image2[0].path)
        fs.unlink(imagPath, (err) => {
            if (err) {
                console.log(err)
            }
        })
    }

    if ( image3 ) {
        const imagPath = path.join(__dirname, '../', image3[0].path)
        fs.unlink(imagPath, (err) => {
            if (err) {
                console.log(err)
            }
        })
    }

    if ( image4 ) {
        const imagPath = path.join(__dirname, '../', image4[0].path)
        fs.unlink(imagPath, (err) => {
            if (err) {
                console.log(err)
            }
        })
    }

    if ( image5 ) {
        const imagPath = path.join(__dirname, '../', image5[0].path)
        fs.unlink(imagPath, (err) => {
            if (err) {
                console.log(err)
            }
        })
    }

    if ( image6 ) {
        const imagPath = path.join(__dirname, '../', image6[0].path)
        fs.unlink(imagPath, (err) => {
            if (err) {
                console.log(err)
            }
        })
    }
}

const deletePrevImage = ( imgPath ) => {
    const imgFullPath = path.join(__dirname, '..', imgPath)
    fs.unlink( imgFullPath, (err) => {
        if (err) {
            console.log(err)
            return false
        }
    })
    return true
}

const prepareImagesPaths = (req, res) => {
    const { image1, image2, image3, image4, image5, image6 } = req.files
            
    const imagesArr = []
    if (image1) { imagesArr.push({ imageUrl: '/'+image1[0].path.replace(/\\/g, '/') }) } 
    if (image2) { imagesArr.push({ imageUrl: '/'+image2[0].path.replace(/\\/g, '/') }) }
    if (image3) { imagesArr.push({ imageUrl: '/'+image3[0].path.replace(/\\/g, '/') }) }
    if (image4) { imagesArr.push({ imageUrl: '/'+image4[0].path.replace(/\\/g, '/') }) }
    if (image5) { imagesArr.push({ imageUrl: '/'+image5[0].path.replace(/\\/g, '/') }) }
    if (image6) { imagesArr.push({ imageUrl: '/'+image6[0].path.replace(/\\/g, '/') }) }

    return imagesArr
}

const loadPrevImages = (product) => {
    let newImages = []
    if (product.images[0]) {
        newImages[0] = product.images[0]
    }
    if (product.images[1]) {
        newImages[1] = product.images[1]
    }
    if (product.images[2]) {
        newImages[2] = product.images[2]
    }
    if (product.images[3]) {
        newImages[3] = product.images[3]
    }
    if (product.images[4]) {
        newImages[4] = product.images[4]
    }
    if (product.images[5]) {
        newImages[5] = product.images[5]
    }

    return newImages
}

const prepareUpdateImagesPaths = (newImagesArr, req, res, product) => {
    const { image1, image2, image3, image4, image5, image6 } = req.files
    let isDeleted = true
    if ( image1 ) {
        if ( product.images[0] ) {
            isDeleted = deletePrevImage(product.images[0].imageUrl)
            newImagesArr[0].imageUrl = '/'+image1[0].path.split('\\').join('/') 
        } else {
            newImagesArr.push({ imageUrl: '/'+image1[0].path.split('\\').join('/') }); 
        }
    }
    if ( image2 ) {
        if ( product.images[1] ) {
            isDeleted = deletePrevImage(product.images[1].imageUrl)
            newImagesArr[1].imageUrl = '/'+image2[0].path.split('\\').join('/') 
        } else {
            newImagesArr.push({ imageUrl: '/'+image2[0].path.split('\\').join('/') }); 
        }
    }
    if ( image3 ) {
        if ( product.images[2] ) {
            isDeleted = deletePrevImage(product.images[2].imageUrl)
            newImagesArr[2].imageUrl = '/'+image3[0].path.split('\\').join('/') 
        } else {
            newImagesArr.push({ imageUrl: '/'+image3[0].path.split('\\').join('/') }); 
        }
    }
    if ( image4 ) {
        if ( product.images[3] ) {
            isDeleted = deletePrevImage(product.images[3].imageUrl)
            newImagesArr[3].imageUrl = '/'+image4[0].path.split('\\').join('/') 
        } else {
            newImagesArr.push({ imageUrl: '/'+image4[0].path.split('\\').join('/') }); 
        }
    }
    if ( image5 ) {
        if ( product.images[4] ) {
            isDeleted = deletePrevImage(product.images[4].imageUrl)
            newImagesArr[4].imageUrl = '/'+image5[0].path.split('\\').join('/') 
        } else {
            newImagesArr.push({ imageUrl: '/'+image5[0].path.split('\\').join('/') }); 
        }
    }
    if ( image6 ) {
        if ( product.images[5] ) {
            isDeleted = deletePrevImage(product.images[5].imageUrl)
            newImagesArr[5].imageUrl = '/'+image6[0].path.split('\\').join('/') 
        } else {
            newImagesArr.push({ imageUrl: '/'+image6[0].path.split('\\').join('/') }); 
        }
    }

    return newImagesArr
}

// Route 1: Get All Products using GET: "/api/product/getall". No Login required
router.get(
    "/getall",
    async (req, res) => {
        let success = false
        try {
            const products = await Product.find({ isActive: true })
            return res.status(200).json({ success: true, data: products })

        } catch (error) {
            console.log(error.message)
            res.status(500).json({ error: "Internal Server Error" })
        }
    }
)

// Route 1A: Get All Products (For Admin) using GET: "/api/product/getall". Login required
router.get(
    "/getallproducts",
    fetchUser,
    async (req, res) => {
        let success = false
        try {
            if (req.user.role != 1) {
                return res.status(404).json({ success: false, error: "Not authorized to access" })
            }
            const products = await Product.find().populate("category", "name")
            return res.status(200).json({ success: true, data: products })

        } catch (error) {
            console.log(error.message)
            res.status(500).json({ error: "Internal Server Error" })
        }
    }
)

router.get(
    "/searchproduct/:searchTerm",
    async (req, res) => {
        try {
            const searchTerm = req.params.searchTerm
            if (!searchTerm) {
                return res.status(400).json({ success: false, message: "Search term is required" });
            }
            
            const products = await Product.find({
                "$or": [
                    { name: { "$regex": searchTerm, "$options": "i" } }
                ],
                isActive: 1
            }).populate("category name")

            return res.status(200).json({ success: true, data: products })
        } catch (error) {
            console.log(error.message)
            res.status(500).json({ error: "Internal Server Error" })
        }
    }
)

router.get(
    "/searchproductbycategory/:searchTerm/category/:category",
    async (req, res) => {
        try {
            const searchTerm = req.params.searchTerm
            if (!searchTerm) {
                return res.status(400).json({ success: false, message: "Search term is required" });
            }
            
            const products = await Product.find({
                "$or": [
                    { name: { "$regex": searchTerm, "$options": "i" } }
                ],
                isActive: 1,
                category: req.params.category
            }).populate("category name")

            return res.status(200).json({ success: true, data: products })
        } catch (error) {
            console.log(error.message)
            res.status(500).json({ error: "Internal Server Error" })
        }
    }
)

// Route 2: Add new Product using POST: "/api/product/add". Login required
router.post(
    "/add",
    fetchUser,
    upload.fields([
        { name: "image1", maxCount: 1 },
        { name: "image2", maxCount: 1 },
        { name: "image3", maxCount: 1 },
        { name: "image4", maxCount: 1 },
        { name: "image5", maxCount: 1 },
        { name: "image6", maxCount: 1 },        
    ]),
    [
        body('name', 'Name cannot be less than 5 characters').isLength({ min: 5 }),
        body('quantity', 'Quantity must be a numeric value').isNumeric(),
        body('costPrice', 'Cost Price must be a numeric value').isNumeric(),
        body('discount', 'Discount value can be in between (0-100)').isFloat({ min: 0, max: 100 }),
        body('category', 'Category must be selected').exists()
    ],
    async ( req, res ) => {
        let success = false
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                // Delete the uploaded files first
                deleteFiles(req, res)
                return res.status(400).json({ success, errors: errors.array() })
            } 

            if (req.user.role != 1) {
                // Delete the uploaded files first
                deleteFiles(req, res)
                return res.status(401).json({ success, error: "Not authorized to access"})
            }

            let product = await Product.findOne({ name: req.body.name }) 
            if (product) {
                // Delete the uploaded files first
                deleteFiles(req, res)
                return res.status(400).json({ success: false, error: "Product with this name already exists"})
            }

            const { name, description, features, applications, quantity, costPrice, discount, category, specLabels, specValues } = req.body
            
            let imagesArr = []
            if ( req.files ) {
                imagesArr = prepareImagesPaths(req, res)
            }

            product = await Product.create({
                category: category,
                name: name,
                description: description,
                features: features,
                applications: applications,
                quantity: quantity,
                costPrice: costPrice, 
                discount: discount,
                images: imagesArr,
                isActive: 1
            })

            if (specLabels[0] == '') {
                specLabels.length = 0
                specValues.length = 0
            }

            if (specLabels.length > 0) {
                const specifications = specLabels.map((label, index) => ({
                    product: product._id,
                    name: label,
                    value: specValues[index]
                }))

                await Specification.insertMany(specifications)
            }

            return res.status(200).json({ success: true, message: "Product Added Sucessfully" })
        } catch (error) {
            console.log(error.message)
            res.status(500).json({ error: "Internal Server Error" })
        }
    }
)

router.get(
    "/getone/:id",
    async (req, res) => {
        try {
            const product = await Product.findById( req.params.id )
            return res.status(200).json({ success: true, data: product })
        } catch (error) {
            console.log(error.message)
            res.status(500).json({ error: "Internal Server Error" })
        }
    }
)

router.get(
    "/getonebyname/:name",
    async (req, res) => {
        try {
            const product = await Product.findOne({ name: req.params.name, isActive: 1 })
            const specifications = await Specification.find({ product: product._id })
            return res.status(200).json({ success: true, data: { product, specifications } })
        } catch (error) {
            console.log(error.message)
            res.status(500).json({ error: "Internal Server Error" })
        }
    }
)

router.get(
    "/getonewithspecs/:id",
    async (req, res) => {
        try {
            const product = await Product.findById( req.params.id )
            const specifications = await Specification.find({ product: product._id })
            return res.status(200).json({ success: true, data: { product, specifications } })
        } catch (error) {
            console.log(error.message)
            res.status(500).json({ error: "Internal Server Error" })
        }
    }
)

// ROUTE 4: To Update Product using PUT "/api/product/update" . Login is required
router.put(
    "/update/:id",
    upload.fields([
        { name: "image1", maxCount: 1 },
        { name: "image2", maxCount: 1 },
        { name: "image3", maxCount: 1 },
        { name: "image4", maxCount: 1 },
        { name: "image5", maxCount: 1 },
        { name: "image6", maxCount: 1 }
    ]),
    [
        body('name', 'Name cannot be less than 5 characters').isLength({ min: 5 }),
        body('quantity', 'Quantity must be a numeric value').isNumeric(),
        body('quantity', 'Quantity must be a numeric value').isFloat({ min: 1 }),
        body('costPrice', 'Cost Price must be a numeric value').isNumeric(),
        body('discount', 'Discount value can be in between (0-100)').isFloat({ min: 0, max: 100 }),
        body('category', 'Category must be selected').exists()
    ],
    fetchUser,
    async (req, res) => {
        let success = false
        let isDeleted = true

        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                // Delete the uploaded files first
                deleteFiles(req, res)
                return res.status(400).json({ success, errors: errors.array() })
            } 

            if (req.user.role != 1) {
                // Delete the uploaded files first
                deleteFiles(req, res)
                return res.status(401).json({ success, error: "Not authorized to access"})
            }

            let product = await Product.findById(req.params.id)

            if (!product) {
                deleteFiles(req, res)
                return res.status(404).json({ success, error: "Product not found"})
            }

            const updatedProduct = {}
            const { name, description, features, applications, quantity, costPrice, discount, category, specLabels, specValues } = req.body
            
            // let newImages = product.images
            let newImages = loadPrevImages(product)

            if ( name ) { updatedProduct.name = name }
            if ( description ) { updatedProduct.description = description }
            if ( features ) { updatedProduct.features = features }
            if ( applications ) { updatedProduct.applications = applications }
            if ( quantity ) { updatedProduct.quantity = quantity }
            if ( costPrice ) { updatedProduct.costPrice = costPrice }
            if ( discount ) { updatedProduct.discount = discount }
            if ( category ) { updatedProduct.category = category }
            
            newImages = prepareUpdateImagesPaths(newImages, req, res, product)
            
            updatedProduct.images = newImages

            product = await Product.findByIdAndUpdate( req.params.id, {$set: updatedProduct}, {new: true} )

            if (specLabels.length == 1 && specLabels[0] == '' ) {
                specLabels.length = 0
                specValues.length = 0
                
                await Specification.deleteMany({ product })
            }

            if (specLabels.length > 0) {
                await Specification.deleteMany({ product })
                
                if (specLabels.length > 0) {
                    const specifications = specLabels.map((label, index) => {
                        const value = specValues[index]
                        if (label && value) {  // Only add the object if both label and value are not null or empty
                            return {
                                product: req.params.id,
                                name: label,
                                value: value
                            };
                        }
                    }).filter(Boolean)

                    await Specification.insertMany(specifications)
                }
            }
            return res.status(200).json({ success: true, message: "Product Updated Sucessfully" })
            
        } catch (error) {
            console.log(error.message)
            res.status(500).json({ error: "Internal Server Error" })
        }
    }
)

// ROUTE 5: Restock the Product using PUT "/api/product/restock/:id"
router.put(
    "/restock/:id",
    [
        body('quantity', 'Quantity must be a numeric value').isNumeric(),
        body('quantity', 'Quantity must be a numeric value').isFloat({ min: 1 }),
    ],
    fetchUser,
    async (req, res) => {
        let success = false
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ success, errors: errors.array() })
            } 

            if (req.user.role != 1) {
                return res.status(401).json({ success, error: "Not authorized to access"})
            }

            let product = await Product.findById(req.params.id)
            if (!product) {
                return res.status(401).json({ success, error: "Product not found"})
            }

            product.quantity = req.body.quantity

            product = await Product.findByIdAndUpdate(req.params.id, {$set: product}, {new: true})
            
            return res.status(200).json({ success: true, message: "Product Quantity Updated Sucessfully" })

        } catch (error) {
            console.log(error.message)
            res.status(500).json({ error: "Internal Server Error" })
        }
    }
)

// ROUTE 6: Get Product by Category using GET "/api/product/getbycategory/:id"
router.get(
    "/getbycategory/:category",
    async (req, res) => {
        try {
            let products = await Product.find({ category: req.params.category, isActive: true })
            return res.status(200).json({ success: true, data: products })

        } catch (error) {
            console.log(error.message)
            res.status(500).json({ error: "Internal Server Error" })
        }
    }
)

// ROUTE 6: Get Product by Category using GET "/api/product/getbycategory/:id"
router.get(
    "/getbycategoryname/:name",
    async (req, res) => {
        try {
            let products = await Product.aggregate([
                {
                    $match: { isActive: true }
                },
                {
                    $lookup: {
                        from: "categories",
                        localField: "category",
                        foreignField: "_id",
                        as: "category"
                    }
                },
                {
                    $unwind: "$category"
                },
                {
                    $match: {
                        "category.name": `${req.params.name}`,  // Replace with the desired category name
                    }
                }
            ])
            return res.status(200).json({ success: true, data: products })

        } catch (error) {
            console.log(error.message)
            res.status(500).json({ error: "Internal Server Error" })
        }
    }
)

// ROUTE 7: Sort by Low to High using GET "/api/product/sortByLowToHigh"
router.get(
    "/sortByLowToHigh",
    async (req, res) => {
        try {
            let matchCriteria = { isActive: true }
            const category = req.query.category
            
            if (category) {
                const catFromDb = await Category.findOne({ name: category })
                matchCriteria.category = catFromDb._id
            }

            let products = await Product.find( matchCriteria ).sort({ costPrice: 1 })
            return res.status(200).json({ success: true, data: products })
        } catch (error) {
            console.log(error.message)
            res.status(500).json({ error: "Internal Server Error" })
        }
    }
)

// ROUTE 8: Sort by High to Low using GET "/api/product/sortByHighToLow"
router.get(
    "/sortByHighToLow",
    async (req, res) => {
        try {
            let matchCriteria = { isActive: true }
            const category = req.query.category
            
            if (category) {
                const catFromDb = await Category.findOne({ name: category })
                matchCriteria.category = catFromDb._id
            }

            let products = await Product.find( matchCriteria ).sort({ costPrice: -1 })
            return res.status(200).json({ success: true, data: products })
        } catch (error) {
            console.log(error.message)
            res.status(500).json({ error: "Internal Server Error" })
        }
    }
)


// ROUTE 8: Sort by High to Low using GET "/api/product/sortByLatest"
router.get(
    "/sortByLatest",
    async (req, res) => {
        try {
            let matchCriteria = { isActive: true }
            const category = req.query.category
            
            if (category) {
                const catFromDb = await Category.findOne({ name: category })
                matchCriteria.category = catFromDb._id
            }
            
            let products = await Product.find( matchCriteria ).sort({ createdAt: -1 })
            return res.status(200).json({ success: true, data: products })
        } catch (error) {
            console.log(error.message)
            res.status(500).json({ error: "Internal Server Error" })
        }
    }
)

// ROUTE 9: Sort by Popularity using GET "/api/product/sortByPopularity"
router.get(
    "/sortByPopularity",
    async (req, res) => {
        try {
            let matchCriteria = { isActive: true }
            const category = req.query.category
            
            if (category) {
                const catFromDb = await Category.findOne({ name: category })
                matchCriteria.category = catFromDb._id
            }

            let products = await Product.aggregate([
                {
                    $match: matchCriteria
                },
                {
                    $lookup: {
                        from: "orders",
                        localField: "_id",
                        foreignField: "orderItems.product",
                        as: "orderData",
                    },
                },
                {
                    $addFields: {
                        salesCount: { $size: "$orderData" },
                    },
                },
                {
                    $sort: { salesCount: -1 },
                },
                {
                    $project: { orderData: 0 },
                }
            ])

            return res.status(200).json({ success: true, data: products })
        } catch (error) {
            console.log(error.message)
            res.status(500).json({ error: "Internal Server Error" })
        }
    }
)

// ROUTE 10: Sort by Average Rating using GET "/api/product/sortByAverageRating"
router.get(
    "/sortByAverageRating",
    async (req, res) => {
        try {
            let matchCriteria = { isActive: true }
            const category = req.query.category
            
            if (category) {
                const catFromDb = await Category.findOne({ name: category })
                matchCriteria.category = catFromDb._id
            }

            let products = await Product.aggregate([
                {
                    $match: matchCriteria
                },
                {
                    $lookup: {
                        from: "reviews",
                        localField: "_id",
                        foreignField: "product",
                        as: "reviews",
                    },
                },
                {
                    $addFields: {
                        averageRating: { $avg: "$reviews.rating" },
                    },
                },
                {
                    $sort: { averageRating: -1 },
                },
                {
                    $project: { reviews: 0 },
                }
            ])

            return res.status(200).json({ success: true, data: products })
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

// ROUTE 11: Delete Product using DELETE "/api/product/delete"
router.delete(
    "/delete/:id",
    fetchUser,
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, errors: errors.array() })
            } 

            if (req.user.role != 1) {
                return res.status(401).json({ success: false, error: "Not authorized to access"})
            }

            let product = await Product.findById(req.params.id)
            if (!product) {
                return res.status(404).json({ success: false, error: "Product not found" })
            }

            // Delete Product Images 
            deleteProductImages(product.images)

            // Delete Specifications of Products
            await Specification.deleteMany({ product: req.params.id })

            // Delete the Product in last
            product = await Product.findByIdAndDelete(req.params.id)        
            return res.status(404).json({ success: true, message: "Product Deleted Successfully" })
        } catch (error) {
            console.log(error.message)
            res.status(500).json({ error: "Internal Server Error" })
        }
    }
)

// ROUTE 12: Active Product using PUT "/api/product/active/:id"
router.put(
    "/active/:id",
    fetchUser,
    async (req, res) => {
        try {
            if (req.user.role != 1) {
                return res.status(401).json({ success: false, error: "Not authorized to access"})
            }
    
            let product = await Product.findById(req.params.id)
            if (!product) {
                return res.status(404).json({ succes: false, error: "Product not found" })
            }
    
            product.isActive = 1
    
            // Update the Product to active
            product = await Product.findByIdAndUpdate(req.params.id, {$set: product}, {new: true})        
            return res.status(200).json({ success: true, message: "Product Activated Successfully" })
        } catch (error) {
            console.log(error.message)
            res.status(500).json({ error: "Internal Server Error" })
        }
    }
)

// ROUTE 12: Active Product using PUT "/api/product/inactive/:id"
router.put(
    "/inactive/:id",
    fetchUser,
    async (req, res) => {
        try {
            if (req.user.role != 1) {
                return res.status(401).json({ success: false, error: "Not authorized to access"})
            }
    
            let product = await Product.findById(req.params.id)
            if (!product) {
                return res.status(404).json({ succes: false, error: "Product not found" })
            }
    
            product.isActive = 0
    
            // Update the Product to active
            product = await Product.findByIdAndUpdate(req.params.id, {$set: product}, {new: true})        
            return res.status(200).json({ success: true, message: "Product Deactivated Successfully" })
        } catch (error) {
            console.log(error.message)
            res.status(500).json({ error: "Internal Server Error" })
        }
    }
)

router.get(
    "/getTopRatedProducts",
    async (req, res) => {
        try {
            let products = await Product.aggregate([
                {
                    $match: { isActive: true }
                },
                {
                    $lookup: {
                        from: "reviews",
                        localField: "_id",
                        foreignField: "product",
                        as: "reviews",
                    },
                },
                {
                    $unwind: {
                        path: "$reviews",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $group: {
                      _id: "$_id",
                      name: { $first: "$name" }, // Keep product name
                      costPrice: { $first: "$costPrice" }, // Keep product price
                      images: { $first: "$images" }, // Keep product price
                      discount: { $first: "$discount" }, // Keep discount
                      category: { $first: "$category" }, // Keep category
                      quantity: { $first: "$quantity" }, // Keep quantity
                      isActive: { $first: "$isActive" }, // Keep isActive status
                      averageRating: { $avg: "$reviews.rating" } // Calculate average rating
                    }
                  },
                {
                    $match: {
                        averageRating: { $gte: 4 }
                    }
                },
                {
                    $sort: { averageRating: -1 } // Sort in descending order
                },
                {
                    $limit: 5
                },
                {
                    $project: {
                      name: 1,
                      costPrice: 1,
                      images: 1,
                      discount: 1,
                      category: 1,
                      quantity: 1,
                      isActive: 1,
                      averageRating: 1
                    }
                }
            ])

            return res.status(200).json({ success: true, data: products })
        } catch (error) {
            console.log(error.message)
            res.status(500).json({ error: "Internal Server Error" })
        }
    }
)

// ROUTE 10: Get Product Count. using GET "/api/product/getcount"
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

            const productsCount = await Product.countDocuments(filterCondition)

            return res.status(200).json({ success: true, data: productsCount })
            
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ error: "Internal server error" })
        }
    }
)

module.exports = router