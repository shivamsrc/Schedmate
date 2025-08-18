const { Router } = require("express");
const publicRouter = Router();
const { UserModel } = require("../db");

publicRouter.get("/", async function(req, res){
    const email = req.user.profile.emails[0].value;
    const user = await UserModel.findOne({
        email
    });
    const id = user._id;

    res.redirect(`http://localhost:3000/schedmate/user/${id}`);
});

publicRouter.get("/:id", async function(req, res){
    try{
        const { id } = req.params;
        const user = await UserModel.findOne({
            _id: id
        });
    
        res.status(200).json({user});
    }
    catch(err){
        console.log(err),
        res.status(500).json({message: "Internal server error", err})
    }
});

module.exports = {
    publicRouter
}