const { Router } = require("express");
const { UserModel, AvailabilityModel, IntegrationModel } = require("../db");
const SetupRouter = Router();
const {v2: cloudinary} = require("cloudinary");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "SchedmateProfilePics",
        allowed_formats: ["jpeg", "png"]
    }
});

const upload = multer({storage: storage});
// Start //

SetupRouter.post("/", upload.single("profileImage"), async function(req, res){                // this "profileImage" should be the name of input tag in form and the action of that form should redirct to this route 
    
    const {name, timeZone, availabilities} = req.body;
    const profilePic = req.file?.path || req.file?.secure_url || req.user.profile.photos[0].value;
    const email = req.user.profile.emails[0].value;
    const id = req.user.profile.id;
    const accessToken = req.user.accessToken;
    const refreshToken = req.user.refreshToken;

    // USE TRANSACTIONS IN ORDER TO MAKE SURE THAT EITHER ALL THE DATA IS STORED SUCCESSFULY OR NONE.
    try{
        const userCreated = await UserModel.create({
            email: email,
            emailUserId: id,
            name: name,
            timezone: timeZone,
            avatarUrl: profilePic
        });

        await AvailabilityModel.create({
            userId: userCreated._id,
            availabilities: availabilities
        });

        await IntegrationModel.create({
            userId: userCreated._id,
            accessToken: accessToken,
            refreshToken: refreshToken
        });

        res.redirect("http://localhost:3000/schedmate/user/main");
    }
    catch(err){
        res.json(`profile setup failed: ${err}`)
    }
});

module.exports = {
    SetupRouter
}