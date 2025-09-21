const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { AuthRouter } = require("./routes/auth");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const { SetupRouter } = require("./routes/profileSetup");
const { BookingsRouter } = require("./routes/bookings");
const { AvailabilityRouter } = require("./routes/availability");
const { publicRouter } = require("./routes/publicPage");


const app = express();
app.use(cors({
    origin: ["http://localhost:5173", "https://schedmate.vercel.app"],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

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

// middleware to check whether the session is valid or not
function isAuthenticated(req, res, next){
    if(req.isAuthenticated()){                                                     // isAuthenticated checks the validity by deserealizing the user data from session. if session unvalid then no data over there.
        return next()
    }
    res.status(401).send("not authenticated")
}
app.use(isAuthenticated);

app.use("/schedmate/profile/setup", SetupRouter);

app.use("/schedmate/user/main", BookingsRouter);

app.use("/schedmate/user/availability", AvailabilityRouter);

app.use("/schedmate/user", publicRouter);

// DB connect
async function DbConnect(){
    await mongoose.connect(process.env.MONGO_URI);
    console.log("done")
}
DbConnect();

app.listen(3000);