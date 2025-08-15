const { Router } = require("express");
const BookingsRouter = Router();
const { UserModel, MeetingModel } = require("../db");

BookingsRouter.get("/", async function(req, res){
    const email = req.user.profile.emails[0].value;

    const user = await UserModel.findOne({
        email
    });
    const userId = user._id;

    const meetings = await MeetingModel.find({
        $or:[
            {requestedBy: userId},
            {requestedTo: userId}
        ]
    })
    .populate('requestedBy', 'name email')                                        // populate replaces the referenced ObjectId with the actual document from the referenced collection, including only the fields we specify.
    .populate('requestedTo', 'name email')
    .sort({startTime: 1});                                                        // '1' for ascending order and '-1' for descending order

    res.json({
        meetings
    })
});

module.exports = {
    BookingsRouter
}