const express = require("express")
const router = express.Router()
const User = require("../models/User")
const { body, validationResult } = require("express-validator")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const fetchUser = require('../middlewares/fetchUser')

const jwtSecret = process.env.JWT_SECRET

// ROUTE 1: Create a User using: POST "/api/auth/createuser". No login is required
router.post("/createuser", [
    body('firstName', 'Enter a valid first name').isLength({ min: 3}),
    body('lastName', 'Enter a valid last name').isLength({ min: 3}),
    body('email', 'Enter a valid email address').isEmail(),
    body('username', 'Enter a valid username of minimum 3 length').isLength({ min: 3 }),
    body('password', 'Enter a password of minimum 5 charachters').isLength({ min: 5 })
], async (req, res) => {
    let success = false
    // If there are errors return bad request and the errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, error: errors.array() })
    }

    try {
        // Check whether the user with this email exists already
        let user = await User.findOne({ email: req.body.email })

        if (user) {
            return res.status(400).json({ success, error: "Email already exists" })
        }

        // Check whether the user with this username already exists
        user = await User.findOne({ username: req.body.username })
        if (user) {
            return res.status(400).json({ success, error: "Username already existsa"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(req.body.password, salt)
        // console.log(process.env.JWT_SECRET)
    
        // Creating a new User if there are no errors
        user = await User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            username: req.body.username,
            password: hashedPass,
            role: 2
        })

        // Returning the user in response that is newly created
        res.status(201).json({ success: true, message: 'User registered successfully !!' })

    } catch (err) {
        console.log(err.message)
        res.status(500).json({ error: "Internal Server Error" })
    }    
})


// ROUTE 2: Authenticate a user using: POST "/api/auth/login". No Login required
router.post('/login', [
    body('username', 'Enter a valid username').isLength({ min: 5 }),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {
    let success = false
    // If there are errors return bad request and the errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, error: errors.array() })
    }

    const { username, password } = req.body

    try {
        let user = await User.findOne({ username })
        
        // If user doesn't exist with that username
        if (!user) {
            return res.status(400).json({ success, error: "Username or password is incorrect" })
        }
        
        // If Password doesn't match 
        const passwordCompare = await bcrypt.compare(password, user.password)
        if (!passwordCompare) {
            return res.status(400).json({ success, error: "Username or password is incorrect" })
        }

        const data = {
            user: {
                id: user.id,
                role: user.role
            }
        }

        // Creating an authToken
        const authToken = jwt.sign(data, jwtSecret)

        // Returning the authToken in respone
        return res.status(200).json({ success: true, authToken, role: user.role })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
})


// ROUTE 3: Get loggedIn User Details using: POST "/api/auth/getuser". Login is required
router.post('/getuser', fetchUser, async (req, res) => {
    try {
        let userId = req.user.id
        const user = await User.findById(userId).select("-password")
        return res.status(200).json({ success: true, data: user })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
})

// ROUTE 4: Update User Details: PUT "/api/auth/updateuser/:id". Login is required
router.put('/updateuser/:id', fetchUser, async (req, res) => {
    let success = false

    try {
        let user = await User.findById(req.params.id)
        // If user doesn't exists
        if (!user) {
            return res.status(400).json({ success, message: "Not a valid User" })
        }

        // If the user isn't same as the one who is requesting update
        if (user._id.toString() !== req.user.id) {
            return res.status(401).json({ success, message: "Not Authorized to Access" })
        }

        const updatedUser = {}
        const { firstName, lastName, email, username, password, phone } = req.body

        if (firstName) { updatedUser.firstName = firstName }
        if (lastName) { updatedUser.lastName = lastName }
        if (email) { updatedUser.email = email }
        if (username) { updatedUser.username = username }
        if (password) { 
            const salt = await bcrypt.genSalt(10)
            const hashedPass = await bcrypt.hash(req.body.password, salt)
            updatedUser.password = hashedPass
         }
        if (phone) { updatedUser.phone = phone }

        user = await User.findByIdAndUpdate( req.params.id, {$set: updatedUser}, {new: true} )
        res.status(201).json({ success: true, message: "User Updated Successfully" })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
})

// ROUTE 5: Get All Users: PUT "/api/auth/getcustomers". Login is required
router.get('/getcustomers', fetchUser, async (req, res) => {
    let success = false
    try {
        if ( req.user.role != 1)  {
            return res.status(401).json({ success, message: "Not Authorized to access" })
        }
        
        const users = await User.find({ role: 2 }).select("-password")

        if (!users) {
            return res.status(200).json({ success, message: "No Users found" })
        }

        return res.status(200).json({ success: true, data: users })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
})

// ROUTE 5: Search Users: GET "/api/auth/searchcustomer/:searchTerm". Login is required
router.get('/searchcustomers/:searchTerm', fetchUser, async (req, res) => {
    let success = false
    try {
        if ( req.user.role != 1)  {
            return res.status(401).json({ success, message: "Not Authorized to access" })
        }

        let searchTerm = req.params.searchTerm
        if (!searchTerm) {
            return res.status(400).json({ success: false, message: "Search term is required" });
        }
        
        const users = await User.find({
            "$or": [
                { firstName: { "$regex": searchTerm, "$options": "i" } },
                { lastName: { "$regex": searchTerm, "$options": "i" } }
            ],
            role: 2
        }).select("-password")

        if (!users) {
            return res.status(200).json({ success, message: "No Users found" })
        }

        return res.status(200).json({ success: true, data: users })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
})


// ROUTE 6: Delete User using "DELETE" "/api/user/deleteuser/:id". Login is required
router.delete('/deletecustomer/:id', fetchUser, async (req, res) => {
    let success = false
    try {
        let deletedUser = await User.findById(req.params.id)
        
        // If user doesn't exists
        if (!deletedUser) {
            return res.status(400).json({ success, message: "Not a valid User" })
        }

        if (req.user.role == 2) {
            return res.status(401).json({ success, message: "Not authorized" })
        }

        deletedUser = await User.findByIdAndDelete(req.params.id)
        return res.status(200).json({ success: true, messsage: "User Deleted Successfully"})

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
})

// ROUTE 7: Get Customers Count. using GET "/api/auth/getcustomerscount"
router.get(
    "/getcustomerscount",
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

            const customersCount = await User.countDocuments(filterCondition)

            return res.status(200).json({ success: true, data: customersCount })
            
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ error: "Internal server error" })
        }
    }
)

module.exports = router;