const { Router } = require("express");
const { UserModel, AvailabilityModel, IntegrationModel } = require("../db");
const SetupRouter = Router();

SetupRouter.post("/", async function(req, res){
    const {name, timeZone, profilePic, availabilities} = req.body;
    const email = req.user.profile.email;
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