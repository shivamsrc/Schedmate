const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const { AuthRouter } = require("./routes/auth");
const app = express();


app.use(express.json());

app.use("/schedmate/auth", AuthRouter);

// DB connect
async function DbConnect(){
    await mongoose.connect(process.env.MONGO_URI);
    console.log("done")
}
DbConnect();

app.listen(3000);