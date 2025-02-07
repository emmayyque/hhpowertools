const express = require('express')
const router = express.Router()
const Banner = require('../models/Banner')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const fetchUser = require('../middlewares/fetchUser')
const { body, validationResult } = require('express-validator')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb (null, "./uploads/banners")
  },
  filename: function (req, file, cb) {
    return cb (null, `${Date.now()}-${file.originalname}`)
  }
})

const upload = multer({ storage })

const deleteFile = (req, res) => {

    if ( req.file ) {
        const imagPath = path.join(__dirname, '../', req.file.path)
        fs.unlink(imagPath, (err) => {
            if (err) {
                console.log(err)
            }
        })
    }
}

const deleteFiles = (req, res) => {
    const { banner1, banner2, banner3 } = req.files

    if ( banner1 ) {
        const imagPath = path.join(__dirname, '../', banner1[0].path)
        fs.unlink(imagPath, (err) => {
            if (err) {
                console.log(err)
            }
        })
    }

    if ( banner2 ) {
        const imagPath = path.join(__dirname, '../', banner2[0].path)
        fs.unlink(imagPath, (err) => {
            if (err) {
                console.log(err)
            }
        })
    }

    if ( banner3 ) {
        const imagPath = path.join(__dirname, '../', banner2[0].path)
        fs.unlink(imagPath, (err) => {
            if (err) {
                console.log(err)
            }
        })
    }
}

const deletePrevImage = (banner) => {
    const imagPath = path.join(__dirname, '../', banner.imageUrl)
    fs.unlink(imagPath, (err) => {
        if (err) {
            console.log(err)
        }
    })
}


// ROUTE 1. Get All Banners using GET. "/api/banner/getall" Login Required
router.get(
    "/getall",
    fetchUser,
    async (req, res) => {
        try {
            if (req.user.role != 1) {
                return res.status(401).json({ success: false, error: "Not authorized to access" })
            }
            const banners = await Banner.find()
            return res.status(200).json({ success: true, banners })
            
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ error: "Internal server error" })
        }
    }
)

// ROUTE 2. Get All By Type using GET. "/api/banner/getByType"
router.get(
    "/getByType/:type",
    async (req, res) => {
        try {
            const banners = await Banner.find({ type: req.params.type })
            return res.status(200).json({ success: true, data: banners })
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ error: "Internal server error" })
        }
    }
)

// ROUTE 3. Add New Banner using POST. "/api/banner/add". Login required
router.post(
    "/add",
    upload.single('banner1'),
    [
        body('type', 'Type must be selected').exists().isLength({ min: 7 })
    ],
    fetchUser,
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                // Delete uploaded image first
                deleteFile(req, res)
                return res.status(400).json({ success: false, error: errors.array() })   
            }

            if (req.user.role != 1) {
                // Delete uploaded image first
                deleteFile(req, res)
                return res.status(401).json({ success: false, error: "Not authorized to access" })
            }
            const { type, version } = req.body
            const banner = await Banner.create({
                imageUrl: `/uploads/banners/${req.file.filename}`,
                type: type,
                version: version ? version : 'Desktop'
            })

            return res.status(201).json({ success: true, message: "Banner added successfully" })
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ error: "Internal server error" })
        }
    }
)

// ROUTE 4. Update Hero Banners using PUT. "/api/banner/update". Login required
router.put(
    "/update",
    upload.fields([
        { name: 'banner1', maxCount: 1 },
        { name: 'banner2', maxCount: 1 },
        { name: 'banner3', maxCount: 1 },
    ]),  
    fetchUser,
    async (req, res) => {
        let isDeleted = true
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                // Delete uploaded image first
                deleteFiles(req, res)
                return res.status(400).json({ success: false, error: errors.array() })   
            }

            if (req.user.role != 1) {
                // Delete uploaded image first
                deleteFiles(req, res)
                return res.status(401).json({ success: false, error: "Not authorized to access" })
            }

            const { banner1Id, banner2Id, banner3Id } = req.body
            const { banner1, banner2, banner3 } = req.files

            if ( banner1 ) {
                let banner = await Banner.findById(banner1Id)
                if (!banner) {
                    return res.status(404).json({ success: false, error: "Banner 1 not found" })
                }

                // Delete previous image first
                deletePrevImage(banner)
                
                banner.imageUrl = `/uploads/banners/${banner1[0].filename}`
                banner = await Banner.findByIdAndUpdate( banner1Id, {$set: banner}, {new: true})
            }

            if ( banner2 ) {
                let banner = await Banner.findById(banner2Id)
                if (!banner) {
                    return res.status(404).json({ success: false, error: "Banner 2 not found" })
                }

                // Delete previous image first
                deletePrevImage(banner)

                banner.imageUrl = `/uploads/banners/${banner2[0].filename}`
                banner = await Banner.findByIdAndUpdate( banner2Id, {$set: banner}, {new: true})
            }

            if ( banner3 ) {
                let banner = await Banner.findById(banner3Id)
                if (!banner) {
                    return res.status(404).json({ success: false, error: "Banner 3 not found" })
                }

                // Delete previous image first
                deletePrevImage(banner)

                banner.imageUrl = `/uploads/banners/${banner3[0].filename}`
                banner = await Banner.findByIdAndUpdate( banner3Id, {$set: banner}, {new: true})
            }

            return res.status(200).json({ success: true, message: "Banners updated successfully" })
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ error: "Internal server error" })
        }
    }
)

// ROUTE 5. Delete Banners using DELETE. "/api/banner/delete/:id". Login required
router.delete(
    "/delete/:id",
    fetchUser,
    async (req, res) => {
        try {
            if (req.user.role != 1) {
                return res.status(401).json({ success: false, error: "Not authorized to access" })
            }
            
            let banner = await Banner.findById(req.params.id)
            if (!banner) {
                return res.status(404).json({ success: false, error: "Banner not found" })
            }

            deletePrevImage(banner)
            banner = await Banner.findByIdAndDelete(req.params.id)
            return res.status(200).json({ success: true, message: "Banner deleted successfully" })

        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ error: "Internal server error" })
        }
    }
)


module.exports = router