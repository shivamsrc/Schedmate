const { Router } = require("express");
const AuthRouter = Router();
require("dotenv").config();
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const { UserModel } = require("../db");

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/schedmate/auth/verify"
    },
    function(accessToken, refreshToken, profile, done){
        const user = {
            accessToken,
            refreshToken,
            profile
        }

        return done(null, user)
    }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

//FE: CLICK ON SINGIN IN FE AND YOU'LL BE HERE
AuthRouter.get("/signin", passport.authenticate('google', {
    scope: [
        'profile',
        'email',
        'https://www.googleapis.com/auth/calendar'
    ],
    prompt: 'consent login'
}));


// after authentication we'll be redirected to this page
AuthRouter.get("/verify", passport.authenticate('google', {failureRedirect: "/"}),

    async function(req, res){                                                                // here this 'req' have access to the profile and email and for calendar you have to call through the api.
        const email = req.user.profile.email;
        const id = req.user.profile.id;

        const user = await UserModel.findOne({
            email,
            id
        });

        if(user == undefined){
            // CHANGE IT TO FE PAGE ROUTE THAT WILL SEND POST REQUEST ON THIS ROUTE
            res.redirect("http://localhost:3000/schedmate/profile/setup")                   // if no profile has been setup already by the user
        }
        else{
            res.redirect("http://localhost:3000/schedmate/user/main")                // if there exists a profile of the user
        }
    }
);

module.exports = {
    AuthRouter: AuthRouter
}