const mongoose = require("mongoose");


const MarriageSchema =
new mongoose.Schema({

    guildId: {
        type: String,
        required: true
    },

    userId: {
        type: String,
        required: true
    },

    partnerId: {
        type: String,
        required: true
    },

    marriedAt: {
        type: Date,
        default: Date.now
    }

});


module.exports =
mongoose.model(
    "Marriage",
    MarriageSchema
);
