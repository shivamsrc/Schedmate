const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const User = new Schema({
    email: {type: String, unique: true, required: true},
    emailUserId: {type: String, unique: true, required: true},
    name: String,
    timezone: String,
    avtarUrl: String
});

const Meeting = new Schema({
    title: {type: String, required: true},
    description: String,
    requestedBy: {type: ObjectId, ref: "users", required: true},
    requestedTo: {type: ObjectId, ref: "users", required: true},
    startTime: Date,
    endTime: Date,
    status: {type: String, enum: ["accepted", "declined", "cancelled", "pending"], default: "pending"},
    googlemeetId: String
});

const Availability = new Schema({
    userId: {type: ObjectId, ref: "users", required: true},
    availabilities: [
        {
            date: String,
            startTime: String, 
            endTime: String
        }
    ]
});

const Integration = new Schema({
    userId: {type: ObjectId, ref: "users", required: true},
    accessToken: String,
    refreshToken: String
});

const UserModel = mongoose.model("users", User);
const MeetingModel = mongoose.model("meetings", Meeting);
const AvailabilityModel = mongoose.model("availability", Availability);
const IntegrationModel = mongoose.model("integrations", Integration);

module.exports = {
    UserModel: UserModel,
    MeetingModel: MeetingModel,
    AvailabilityModel: AvailabilityModel,
    IntegrationModel: IntegrationModel
};