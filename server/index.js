const connectToMongo = require('./db')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require("cors");
const allRoutes = require('./routes/allRoutes.js');
const path = require('path');
require('dotenv').config();

connectToMongo();

const app = express()
const port = process.env.PORT

const corsOrigin = process.env.REACT_URL

const corsOptions = {
    origin: corsOrigin,
    methods: ["GET", "POST", "PUT", "PATCH", "OPTIONS", "DELETE"],
    credentials: true
}

// Middlewares
app.use(cors(corsOptions))
// console.log("CORS Origin:", process.env.REACT_URL);
// Serve static files (images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json())
// Middleware to parse form-data requests
app.use(bodyParser.urlencoded({ extended: true }));

// Available Routes
app.use('/api', allRoutes)

app.listen(port, "0.0.0.0", () => {
  console.log(`App listening at ${process.env.BASE_URL}:${port}`)
})