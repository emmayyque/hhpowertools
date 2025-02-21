const express = require('express')
const router = express.Router()
const fetchUser = require('../middlewares/fetchUser')
const Order = require('../models/Order')
const User = require('../models/User')
const Address = require('../models/Address')
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const sendMail = require('../middlewares/mailSender')
const Product = require('../models/Product')
require('dotenv').config()


const createCustomer = async (firstName, lastName, email, phone) => {
    try {
        let randNum = Math.random() * 100001
        const user = await User.findOne({ email: email })
        
        if (user) {
            console.log(user)
            email = "_$"+email
        }

        const username = firstName.split(' ').join('.') + randNum
        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(username, salt)

        const newUser = await User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            username: username,
            password: hashedPass,
            role: 2
        })

        if ( newUser ) {
            return newUser._id
        }

        return null

    } catch (error) {        
        console.log(error.message)
        return null
    }
}

const createAddress = async (customer, street, area, city, state) => {
    try {
        const address = await Address.create({
            customer: customer,
            street: street, 
            area: area,
            city: city,
            state: state
        })

        if (address) { return address._id }
        return null

    } catch (error) {        
        console.log(error.message)        
        return null
    }
}

const genOrderNumber = async () => {
    let num = Math.floor(Math.random() * 9999999999) + 1; // Generate between 1 and 9999999999
    let orderNo = "HHPT"+num.toString().padStart(10, '0')

    try {
        const order = await Order.findOne({ orderNo: orderNo })
        if (order) {
            orderNo = genOrderNumber()
        } else {
            return orderNo
        }
    } catch (err) {
        console.log(err)
        return null
    }
    
    return orderNo
}

const sendMailToCustomer = (name, email, subject, msg1, msg2, orderNo) => {
    let page = `
        <table style="width: 90%; margin: auto; font-family: 'Jost', sans-serif; border-collapse: collapse;">
            <thead style="background-color: #26ad20; height: 30px; box-sizing: border-box; padding: 10px;">
                <tr>
                    <td style="text-align: center; padding: 15px;">
                        <img src="https://hhpowertools.vercel.app/logo3-white.png" alt="HH PowerTools Logo" style="height: 30px; width: auto; margin: auto;">
                    </td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="color: #c6c6c6; text-align: right; font-size: 0.65rem; margin-top: 2px;">
                        Order-${orderNo}
                    </td>
                </tr>
                <tr>
                    <td style="font-size: 0.9rem; font-weight: 600;">
                        Hello <span style="color: #26ad20">${name}</span>,
                    </td>
                </tr>
                <tr>
                    <td style="font-weight: 400; font-size: 0.7rem; padding: 20px 0px; ">
                        ${msg1}
                    </td>
                </tr>
                <tr>
                    <td style="font-size: 0.7rem;">
                        ${msg2} Track your status at: <a href="https://hhpowertools.vercel.app/tracking">https://hhpowertools.vercel.app/tracking</a>
                    </td>
                </tr>
                <tr>
                    <td style="font-size: 0.65rem; text-align: center; padding-top: 30px; padding-bottom: 40px;">
                        In case of any queries, please call us at 03489024121
                    </td>
                </tr>
                <tr>
                    <td style="padding: 20px 0px;">
                        <a href="https://hhpowertools.vercel.app/tracking" style="padding: 8px 10px; background-color: #000000; color: #FFFFFF; font-size: 0.7rem; border-radius: 5px; font-weight: 600; text-decoration: none;">Track Order</a> <span style="font-size: 0.8rem; margin: 0px 7px;">or</span>
                        <a href="https://hhpowertools.vercel.app/store" style="font-size: 0.75rem; margin: 0;">Visit our Store</a>
                    </td>
                </tr>
            </tbody>
            <tfoot style="background-color: #26ad20; text-align: center;">
                <tr>
                    <td style="font-size: 0.70rem; color: #ffffff; padding-top: 15px; padding-bottom: 5px;">Follow us at !!</td>
                </tr>
                <tr>
                    <td style="padding-bottom: 20px;">
                        <a href="https://hhpowertools.vercel.app" style=" text-decoration: none;">
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="14" height="14" viewBox="0 0 50 50" style="fill:#FFFFFF;">
                                <path d="M25,2C12.318,2,2,12.318,2,25c0,3.96,1.023,7.854,2.963,11.29L2.037,46.73c-0.096,0.343-0.003,0.711,0.245,0.966 C2.473,47.893,2.733,48,3,48c0.08,0,0.161-0.01,0.24-0.029l10.896-2.699C17.463,47.058,21.21,48,25,48c12.682,0,23-10.318,23-23 S37.682,2,25,2z M36.57,33.116c-0.492,1.362-2.852,2.605-3.986,2.772c-1.018,0.149-2.306,0.213-3.72-0.231 c-0.857-0.27-1.957-0.628-3.366-1.229c-5.923-2.526-9.791-8.415-10.087-8.804C15.116,25.235,13,22.463,13,19.594 s1.525-4.28,2.067-4.864c0.542-0.584,1.181-0.73,1.575-0.73s0.787,0.005,1.132,0.021c0.363,0.018,0.85-0.137,1.329,1.001 c0.492,1.168,1.673,4.037,1.819,4.33c0.148,0.292,0.246,0.633,0.05,1.022c-0.196,0.389-0.294,0.632-0.59,0.973 s-0.62,0.76-0.886,1.022c-0.296,0.291-0.603,0.606-0.259,1.19c0.344,0.584,1.529,2.493,3.285,4.039 c2.255,1.986,4.158,2.602,4.748,2.894c0.59,0.292,0.935,0.243,1.279-0.146c0.344-0.39,1.476-1.703,1.869-2.286 s0.787-0.487,1.329-0.292c0.542,0.194,3.445,1.604,4.035,1.896c0.59,0.292,0.984,0.438,1.132,0.681 C37.062,30.587,37.062,31.755,36.57,33.116z"></path>
                            </svg>
                        </a>
                        
                        <a href="https://hhpowertools.vercel.app" style=" text-decoration: none;">
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="14" height="14" viewBox="0 0 64 64" style="fill:#FFFFFF;">
                                <path d="M32,6C17.642,6,6,17.642,6,32c0,13.035,9.603,23.799,22.113,25.679V38.89H21.68v-6.834h6.433v-4.548	c0-7.529,3.668-10.833,9.926-10.833c2.996,0,4.583,0.223,5.332,0.323v5.965h-4.268c-2.656,0-3.584,2.52-3.584,5.358v3.735h7.785	l-1.055,6.834h-6.73v18.843C48.209,56.013,58,45.163,58,32C58,17.642,46.359,6,32,6z"></path>
                            </svg>
                        </a>
                    </td>
                </tr>
                <tr>
                    <td style="font-size: 0.55rem; padding-bottom: 15px; color: #ffffff;">
                        If you have any questions, contact us at contact@hhpowertools.pk
                    </td>
                </tr>
            </tfoot>
        </table>`

    sendMail(email, subject, page)
}

// ROUTE 1: Get all Orders using GET. "/api/orders/getall" .Login required
router.get(
    "/getall",
    fetchUser,
    async (req, res) => {
        try {
            if (req.user.role != 1) {
                return res.status(401).json({ success: false, error: "Not authorized to access" })
            }
            
            const orders = await Order.find().sort({ createdAt: -1 }).populate('customer', 'firstName lastName phone').populate('orderItems.product', 'name costPrice discount').populate('address', 'street area city')
            return res.status(200).json({ success: true, data: orders })
            
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ error: "Internal server error" })
        }
    }
)

router.get(
    "/getorderitems/:id",
    fetchUser,
    async (req, res) => {
        try {
            if (req.user.role != 1) {
                return res.status(401).json({ success: false, error: "Not authorized to access" })
            }
            
            const orderItems = await Order.findById(req.params.id).select("orderItems").populate("orderItems.product", "name costPrice discount")
            return res.status(200).json({ success: true, data: orderItems })
            
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ error: "Internal server error" })
        }
    }
)

// ROUTE 1B: Get all Orders using GET. "/api/orders/getall" .Login required
router.get(
    "/getDeliveredOrdersInPastMonth",
    fetchUser,
    async (req, res) => {
        try {
            if (req.user.role != 1) {
                return res.status(401).json({ success: false, error: "Not authorized to access" })
            }

            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
            
            const orders = await Order.find({status: 2, createdAt: { $gte: thirtyDaysAgo }}).populate('customer', 'firstName lastName')
            return res.status(200).json({ success: true, data: orders })
            
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ error: "Internal server error" })
        }
    }
)

// ROUTE 1C: Get Sales Overview GET. "/api/orders/getSalesOverviewInPastYear" .Login required
router.get(
    "/getSalesOverviewInPastYear",
    fetchUser,
    async (req, res) => {
        try {
            if (req.user.role != 1) {
                return res.status(401).json({ success: false, error: "Not authorized to access" })
            }
            
            const orders = await Order.aggregate([
                {
                    "$match": {
                      "createdAt": {
                        "$gte": new Date(new Date().setFullYear(new Date().getFullYear() - 1))
                      }
                    }
                },
                {
                    "$group": {
                        "_id": {
                            "year": { "$year": "$createdAt" },
                            "month": { "$month": "$createdAt" }
                        },
                        "total_orders": { "$sum": 1 },
                        "total_sales": { "$sum": "$totalBill" }
                    }
                },
                {
                    "$sort": { "_id.year": 1, "_id.month": 1 }
                }
            ])

            return res.status(200).json({ success: true, data: orders })
            
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ error: "Internal server error" })
        }
    }
)


// ROUTE 2: Get all Orders by customer using GET. "/api/orders/getallbycustomer/:id" .Login required
router.get(
    "/getallbycustomer",
    fetchUser,
    async (req, res) => {
        try {
            if (req.user.role != 2) {
                return res.status(401).json({ success: false, error: "Not authorized to access" })
            }
            
            const orders = await Order.find({ customer: req.user.id }).populate('orderItems.product', 'name costPrice discount')
            return res.status(200).json({ success: true, data: orders })
            
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ error: "Internal server error" })
        }
    }
)

// ROUTE 3: Add New Order by customer using POST
router.post(
    "/orderAsCustomer",
    fetchUser,
    [
        body('address', 'Address must be selected').exists().isLength({ min: 21 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, error: errors.array() })
            }

            if ( req.user.role != 2 ) {
                return res.status(401).json({ success: false, error: "Not authorized to access" })
            }

            const { address, orderItems, shippingCost, totalBill } = req.body

            // Generate an orderNo and check if it exists generate the other one 
            const orderNo = await genOrderNumber()
            if ( orderNo == null ) {
                return res.status(500).json({ error: "Internal server error" })
            }

            const order = await Order.create({
                customer: req.user.id,
                orderItems: orderItems,
                shippingFee: shippingCost,
                totalBill: totalBill,
                status: 1,
                address: address,
                orderNo: orderNo
            })
            
            // Your order is placed with <strong>Order No: HHPT123456789</strong>. You will receive confirmation shortly.
            // Send confirmation mail to the customer
            // Prepare the subject:
            const customer = await User.findById(req.user.id).select("email firstName lastName")
            if ( customer ) {
                const name = customer.firstName + ' ' + customer.lastName
                const subject = `Order ${orderNo} Placed at HHPowerTools`
                const message1 = "Thank you for purchasing at HH Power Tools!"
                const message2 = `Your order is placed with <strong>Order No: ${orderNo}</strong>. You will receive confirmation shortly`
                sendMailToCustomer(name, customer.email, subject, message1, message2, orderNo)
            }
            
            return res.status(200).json({ success: true, orderNo })

            
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ error: "Internal server error" })
        }
    }
)

router.post(
    "/orderAsCustomerWithNewAddress",
    [
        body('street', 'Street address cannot be shorter then the 7 characters').isLength({ min: 7 }),
        body('area', 'Area cannot be shorter than 5 characters').isLength({ min: 5 }),
        body('city', 'City cannot be shorter than 3 characters').isLength({ min: 3 }),
        body('state', 'State must be selected').exists().isLength({ min: 4 })
    ],
    fetchUser,
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, error: errors.array() })
            }

            if ( req.user.role != 2 ) {
                console.log(req.user.role)
                return res.status(401).json({ success: false, error: "Not authorized to access" })
            }

            const { street, area, city, state, orderItems, shippingCost, totalBill } = req.body

            let address = await createAddress(req.user.id, street, area, city, state)
            if ( address == null ) {
                return res.status(500).json({ error: "Internal server error" })
            }

            // Generate an orderNo and check if it exists generate the other one 
            const orderNo = await genOrderNumber()
            if ( orderNo == null ) {
                return res.status(500).json({ error: "Internal server error" })
            }

            const order = await Order.create({
                customer: req.user.id,
                orderItems: orderItems,
                shippingFee: shippingCost,
                totalBill: totalBill,
                status: 1,
                address: address,
                orderNo: orderNo
            })

            // Your order is placed with <strong>Order No: HHPT123456789</strong>. You will receive confirmation shortly.
            // Send confirmation mail to the customer
            // Prepare the subject:
            const customer = await User.findById(req.user.id).select("email firstName lastName")
            if ( customer ) {
                const name = customer.firstName + ' ' + customer.lastName
                const subject = `Order ${orderNo} Placed at HHPowerTools`
                const message1 = "Thank you for purchasing at HH Power Tools!"
                const message2 = `Your order is placed with <strong>Order No: ${orderNo}</strong>. You will receive confirmation shortly`
                sendMailToCustomer(name, customer.email, subject, message1, message2, orderNo)
            }
            
            return res.status(200).json({ success: true, orderNo })

            
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ error: "Internal server error" })
        }
    }
)


// ROUTE 4: Add New Order by guest customer using POST. No Login required
router.post(
    "/orderAsGuest",
    [
        body('firstName', 'First name cannot be shorter than 3 characters').isLength({ min: 3 }),
        body('lastName', 'Last name cannot be shorter than 3 characters').isLength({ min: 3 }),
        body('phone', 'Phone No is required').exists(),
        body('street', 'Street address cannot be shorter then the 7 characters').isLength({ min: 7 }),
        body('area', 'Area cannot be shorter than 5 characters').isLength({ min: 5 }),
        body('city', 'City cannot be shorter than 3 characters').isLength({ min: 3 }),
        body('state', 'State must be selected').exists().isLength({ min: 4 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, error: errors.array() })
            }

            const { firstName, lastName, email, phone, street, area, city, state, orderItems, shippingCost, totalBill } = req.body

            customEmail = email
            if ( !email ) {
                customEmail = '+$' + firstName + lastName + '@gmail.com'
            }

            let customer = await createCustomer(firstName, lastName, customEmail, phone )
            if ( customer == null ) {
                return res.status(500).json({ error: "Internal server error" })
            }

            // console.log("User Created Success", customer)

            let address = await createAddress(customer, street, area, city, state)
            if ( address == null ) {
                return res.status(500).json({ error: "Internal server error" })
            }

            // Generate an orderNo and check if it exists generate the other one 
            const orderNo = await genOrderNumber()
            if ( orderNo == null ) {
                return res.status(500).json({ error: "Internal server error" })
            }
            
            const order = await Order.create({
                customer: customer,
                orderItems: orderItems,
                shippingFee: shippingCost,
                totalBill: totalBill,
                status: 1,
                address: address,
                orderNo: orderNo
            })
 
            const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

            if (emailRegex.test(email)) {
                // Your order is placed with <strong>Order No: HHPT123456789</strong>. You will receive confirmation shortly.
                // Send confirmation mail to the customer
                // Prepare the subject:           
                const name = firstName + ' ' + lastName
                const subject = `Order ${orderNo} Placed at HHPowerTools`
                const message1 = "Thank you for purchasing at HH Power Tools!"
                const message2 = `Your order is placed with <strong>Order No: ${orderNo}</strong>. You will receive confirmation shortly`
                sendMailToCustomer(name, email, subject, message1, message2, orderNo)
            }
            
            return res.status(200).json({ success: true, orderNo })
            
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ error: "Internal server error" })
        }
    }
)

// ROUTE 5: Approve Order using PUT. Login required
router.put(
    "/approveOrder/:id",
    fetchUser,
    async (req, res) => {
        try {
            if (req.user.role != 1) {
                return res.status(401).json({ success: false, error: "Not authorized to access" })
            }

            let order = await Order.findById(req.params.id).populate("customer", "firstName lastName email")
            if (!order) {
                return res.status(404).json({ success: false, error: "Order not found" })
            }
            const approvedOrder = {}
            approvedOrder.status = 2

            for (const item of order.orderItems) {
                const { product, quantity } = item
                let prod = await Product.findById(product)
                if (!prod) {
                    return res.status(404).json({ success: false, error: "Product not found" })
                }

                if (prod.quantity < quantity) {
                    return res.status(400).json({ success: false, error: "Not enough in stock" })
                }
                
                prod.quantity = prod.quantity - quantity
                prod = await Product.findByIdAndUpdate(product, {$set: prod}, {new: true})
            }

            // Your order is placed with <strong>Order No: HHPT123456789</strong>. You will receive confirmation shortly.
            // Send confirmation mail to the customer
            // Prepare the subject:
            const name = order.customer.firstName + ' ' + order.customer.lastName
            const subject = `Order ${order.orderNo} Confirmed`
            const message1 = "Thank you for purchasing at HH Power Tools!"
            const message2 = `Your Order-<strong>${order.orderNo}</strong> is approved. You will receive it within 4-5 days.`
            sendMailToCustomer(name, order.customer.email, subject, message1, message2, order.orderNo)


            order = await Order.findByIdAndUpdate(req.params.id, {$set: approvedOrder}, {new: true})

            return res.status(200).json({ success: true, message: "Order approved successfully" })
            
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ error: "Internal server error" })
        }
    }
)

// ROUTE 5: Decline Order using PUT. Login required
router.put(
    "/declineOrder/:id",
    fetchUser,
    async (req, res) => {
        try {
            if (req.user.role != 1) {
                return res.status(401).json({ success: false, error: "Not authorized to access" })
            }

            let order = await Order.findById(req.params.id).populate("customer", "firstName lastName email")
            if (!order) {
                return res.status(404).json({ success: false, error })
            }
            const declinedOrder = {}
            declinedOrder.status = 0

            // Your order is placed with <strong>Order No: HHPT123456789</strong>. You will receive confirmation shortly.
            // Send confirmation mail to the customer
            const name = order.customer.firstName + ' ' + order.customer.lastName
            const subject = `Order ${order.orderNo} Declined`
            const message1 = "Sorry for the inconvenience!"
            const message2 = `Your Order-<strong>${order.orderNo}</strong> at HHPowerTools is declined.`
            sendMailToCustomer(name, order.customer.email, subject, message1, message2, order.orderNo)
            
            order = await Order.findByIdAndUpdate(req.params.id, {$set: declinedOrder}, {new: true})

            return res.status(200).json({ success: true, message: "Order declined successfully" })
            
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ error: "Internal server error" })
        }
    }
)

// ROUTE 5A: Deliver Order using PUT. Login required
router.put(
    "/deliverOrder/:id",
    fetchUser,
    async (req, res) => {
        try {
            if (req.user.role != 1) {
                return res.status(401).json({ success: false, error: "Not authorized to access" })
            }

            let order = await Order.findById(req.params.id).populate("customer", "email firstName lastName")
            if (!order) {
                return res.status(404).json({ success: false, error })
            }
            const deliveredOrder = {}
            deliveredOrder.status = 3

            // Your order is placed with <strong>Order No: HHPT123456789</strong>. You will receive confirmation shortly.
            // Send confirmation mail to the customer
            // Prepare the subject:
            const name = order.customer.firstName + ' ' + order.customer.lastName
            const subject = `Order ${order.orderNo} Delivered`
            const message1 = "Thank you for purchasing at HH Power Tools!"
            const message2 = `Your Order-<strong>${order.orderNo}</strong> at HHPowerTools is delivered at your address.`
            sendMailToCustomer(name, order.customer.email, subject, message1, message2, order.orderNo)

            order = await Order.findByIdAndUpdate(req.params.id, {$set: deliveredOrder}, {new: true})

            return res.status(200).json({ success: true, message: "Order delivered successfully" })
            
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ error: "Internal server error" })
        }
    }
)

// ROUTE 6: Track Order. using POST "/api/order/trackOrder"
router.post(
    "/trackOrder",
    [
        body("orderNo", "Enter a valid order number of length 14").exists().isLength({ min: 14, max: 14 })
    ],
    async (req, res) => {
        try {            
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, error: errors.array() })
            }

            let order = await Order.findOne({ orderNo: req.body.orderNo }).populate("customer", "firstName lastName email phone").populate("orderItems.product", "name costPrice discount images").populate("address", "street area city state")
            if (!order) {
                return res.status(404).json({ success: false, error: "No Order found" })
            }

            return res.status(200).json({ success: true, data: order })
            
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ error: "Internal server error" })
        }
    }
)

// ROUTE 7: Get Pending Orders Count. using GET "/api/order/getpendingcount"
router.get(
    "/getpendingcount",
    fetchUser,
    async (req, res) => {
        try {      
            if (req.user.role != 1) {
                return res.status(401).json({ success: false, error: "Not authorized to access" })
            }

            const ordersCount = await Order.countDocuments({ status: 1 })

            return res.status(200).json({ success: true, data: ordersCount })
            
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ error: "Internal server error" })
        }
    }
)

// ROUTE 8: Get Orders Count. using GET "/api/order/getcount"
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

            const ordersCount = await Order.countDocuments(filterCondition)

            return res.status(200).json({ success: true, data: ordersCount })
            
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ error: "Internal server error" })
        }
    }
)


module.exports = router