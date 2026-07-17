const { Schema, model } = require("mongoose");

const economySchema = new Schema({
    guildId: {
        type: String,
        required: true,
        index: true
    },

    userId: {
        type: String,
        required: true,
        index: true
    },

    wallet: {
        type: Number,
        default: 0,
        min: 0
    },

    bank: {
        type: Number,
        default: 0,
        min: 0
    },

    totalWon: {
        type: Number,
        default: 0
    },

    totalLost: {
        type: Number,
        default: 0
    },

    totalEarned: {
        type: Number,
        default: 0
    },

    totalSpent: {
        type: Number,
        default: 0
    },

    gamesPlayed: {
        type: Number,
        default: 0
    },

    gamesWon: {
        type: Number,
        default: 0
    },

    gamesLost: {
        type: Number,
        default: 0
    },

    biggestWin: {
        type: Number,
        default: 0
    },

    streak: {
        type: Number,
        default: 0
    },

    highestStreak: {
        type: Number,
        default: 0
    },

    dailyCooldown: {
        type: Date,
        default: null
    },

    workCooldown: {
        type: Date,
        default: null
    },

    begCooldown: {
        type: Date,
        default: null
    },

    weeklyCooldown: {
        type: Date,
        default: null
    },

    inventory: {
        type: [{
            item: String,
            amount: Number
        }],
        default: []
    }

}, {
    timestamps: true
});

economySchema.index(
    {
        guildId: 1,
        userId: 1
    },
    {
        unique: true
    }
);

module.exports = model("Economy", economySchema);
