const mongoose = require('mongoose');
require('dotenv').config()

const mongoURI = process.env.DB_CONN_STRING
// const mongoURI = "mongodb+srv://muhammadalikhalil:Yyad0y5L4IXBzHNy@cluster.iz3og.mongodb.net/hhpowertools?retryWrites=true&w=majority&appName=Cluster"


const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI)
        console.log("Connected to MongoDB Successfully !!!")
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}

module.exports = connectToMongo;