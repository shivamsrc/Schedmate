const { Router } = require("express");
const BookingsRouter = Router();
const { UserModel, MeetingModel, IntegrationModel } = require("../db");
const { google } = require("googleapis");
require("dotenv").config();

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

    res.status(200).json({
        user,
        meetings
    })
});


// cancelling the meet
BookingsRouter.patch("/meeting/:id/cancel", async function(req, res){               // store the id on FE when fetched
    const { id } = req.params;
    const email = req.user.profile.emails[0].value;
    const user = await UserModel.findOne({email});

    try{
        const meeting = await MeetingModel.findById(id);


        if(!meeting){
            res.json({message: "meeting not found"})
        }

        if(meeting.status == "cancelled"){
            res.json({message: "meeting already cancelled"})
        }

        if(user._id.toString() != meeting.requestedBy.toString() && user._id.toString() != meeting.requestedTo.toString()){
            res.json({
                message: "cancellation not possible"
            })
        }

        const requester = await IntegrationModel.findOne({
            userId: meeting.requestedBy
        });

        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRCT_URI
        );

        oauth2Client.setCredentials({
            access_token: requester.accessToken,
            refresh_token: requester.refreshToken
        });

        const calendar = google.calendar({version: 'v3', auth: oauth2Client});

        const response = await calendar.events.delete({
            calendarId: "primary",
            eventId: meeting.googleEventId
        });

        const meet = await MeetingModel.findByIdAndUpdate(
            id,
            {status: "cancelled"},
            {new: true}
        );

        res.status(200).json({
            message: "meeting cancelled",
            meet
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message: "internal server error",
            err
        })
    }
});

// creating a meet
BookingsRouter.post("/meeting/schedule", async function(req, res){
    try{
        const email = req.user.profile.emails[0].value;
        const user = await UserModel.findOne({
            email
        });
        const requestedBy = user._id;

        const currentUser = await IntegrationModel.findOne({
            userId: requestedBy
        }).populate('userId');
    
        const {title, description, requestedTo, startTime, endTime} = req.body;             // here, requstedTo is the ObjectId

        const invitee = await UserModel.findOne({
            _id: requestedTo
        });
    
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );

        oauth2Client.setCredentials({
            access_token: currentUser.accessToken,
            refresh_token: currentUser.refreshToken
        });
    
        const calendar = google.calendar({version: 'v3', auth: oauth2Client});

        const event = {
            summary: title,
            start: {dateTime: startTime, timeZone: user.timezone},
            end: {dateTime: endTime, timeZone: user.timezone},
            attendees: [{email: invitee.email}, {email:user.email}],
    
            conferenceData: {                                            // google meet link generation
                createRequest: {
                    requestId: `${Date.now()}`
                },
                conferenceSolutionKey: {type: "hangoutsMeet"}
            }
        };
    
        const response = await calendar.events.insert({
            calendarId: 'primary',
            resource: event,
            conferenceDataVersion: 1,
            sendUpdates: 'all'
        });
    
        const newMeeting = await MeetingModel.create({
            title,
            description,
            requestedBy,
            requestedTo,
            startTime,
            endTime,
            status: "scheduled",
            googlemeetId: response.data.hangoutLink,
            googleEventId: response.data.id
        });
    
        res.status(201).json({
            message: "meeting scheduled",
            meeting: newMeeting
        })
    }
    catch(err){
        console.log(err),
        res.status(500).json({error: "internal server error", err})
    }
});

module.exports = {
    BookingsRouter
}