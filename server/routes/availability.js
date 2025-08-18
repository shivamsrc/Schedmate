const { Router } = require("express");
const AvailabilityRouter = Router();
const { UserModel, AvailabilityModel } = require("../db");

AvailabilityRouter.get("/", async function(req, res){
    try{
        const email = req.user.profile.emails[0].value;
        const user = await UserModel.findOne({
            email
        });
        const userId = user._id;
    
        const availabilty = await AvailabilityModel.findOne({
            userId
        });

        res.status(200).json({
            availabilty
        });
    }
    catch(err){
        console.log(err)
        res.json({message: "Internal server error", err})
    }
});

// update endpoint
AvailabilityRouter.put("/update", async function(req, res){
    try{
        const email = req.user.profile.emails[0].value;
        const { availabilities } = req.body;
    
        const user = await UserModel.findOne({
            email
        });

        const userId = user._id;
    
        const availability = await AvailabilityModel.findOneAndUpdate(
            {userId: userId},                                                 // find by
            {availabilities: availabilities},                                 // content to update
            {new: true}                                                       // return updated document
        );

        res.status(200).json({
            message: "Availability updated",
            availability
        });
    }
    catch(err){
        console.log(err),
        res.status(500).json({message: "Internal server error", err})
    }
});

module.exports = {
    AvailabilityRouter
}