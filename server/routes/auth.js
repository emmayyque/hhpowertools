const express = require('express')
const router = express.Router()

// Create a user using: POST "/api/auth/" . Doesn't requires auth
router.get('/', (req, res) => {
    console.log(req.body)
    res.send(req.body)
})

module.exports = router