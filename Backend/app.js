const mongoose = require("mongoose");
const path = require("path");
const express = require("express");
const app = express();
require("dotenv").config();

mongoose.connect(`mongodb+srv://${process.env.DB_LOGIN}:${process.env.DB_PASSWORD}@cluster0.huhxfny.mongodb.net/?retryWrites=true&w=majority`);

mongoose.connection.on("error", console.error.bind(console, "connection error:"));
mongoose.connection.once("open", () => {
    console.log("Database connected");
});

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
})

const authRouter = require("./routes/user");
const sauceRouter = require("./routes/sauce")

app.use("/api/auth", authRouter);
app.use("/api/sauces", sauceRouter);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.listen(3000, () => {
    console.log("Listening on port 3000");
})