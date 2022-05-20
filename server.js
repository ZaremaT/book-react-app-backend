require("dotenv").config();
const {PORT = 3000, MONGODB_URL } = process.env;
const express = require("express");
const app = express();
const mongoose = require('mongoose');

//import middleware
const cors = require ('cors');
const morgan = require ('morgan');

//database connection
mongoose.connect(MONGODB_URL);

//connecting events
mongoose.connection
.on("open", () => console.log("Your are connected to mongoose"))
.on("close", () => console.log("Your are disconnected from mongoose"))
.on("error", (error) => console.log(error));

//models
const BooksSchema = new mongoose.Schema({
    title: String,
author: String,
category: String,
image: String,
review: String
})

const Books = mongoose.model('Books', BooksSchema);

//middleware
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

//ROUTES
app.get("/", (req,res) => {
    res.send ("hello world")
});

app.get('/books/:id', async (req,res) => {
    try {
        res.json(await Books.findById(req.params.id));
    } catch (error) {
        res.status(400).json(error)
    }
})

app.get('/books', async (req,res) => {
    try {
        res.json(await Books.find({}));
    } catch (error) {
        res.status(400).json(error)
    }
})

app.post('/books', async (req, res) => {
    try {
        res.json(await Books.create(req.body))
    } catch (error) {
        res.status(400).json(error)  
    }
})

app.put('/books/:id', async (req,res) => {
    try {
       res.json(await Books.findByIdAndUpdate(req.params.id, req.body)) 
    } catch (error) {
        res.status(400).json(error)
    }
})

app.delete('/books/:id', async (req, res) => {
    try {
        res.json(await Books.findByIdAndRemove(req.params.id))
    } catch (error) {
        res.status(400).json(error)
    }
})

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));