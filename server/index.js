const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const { AuthRouter } = require("./routes/auth");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");

const app = express();
app.use(express.json());

// auth setup
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 60*60*1000
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/schedmate/auth", AuthRouter);

// DB connect
async function DbConnect(){
    await mongoose.connect(process.env.MONGO_URI);
    console.log("done")
}
DbConnect();

app.listen(3000);