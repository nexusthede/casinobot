const {
    Schema,
    model
} = require("mongoose");


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
        default: 1000,
        min: 0
    },


    bank: {
        type: Number,
        default: 0,
        min: 0
    },


    // =====================
    // GAMBLING STATS
    // =====================

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


    totalWagered: {
        type: Number,
        default: 0
    },


    totalWon: {
        type: Number,
        default: 0
    },


    totalLost: {
        type: Number,
        default: 0
    },


    biggestWin: {
        type: Number,
        default: 0
    },


    biggestLoss: {
        type: Number,
        default: 0
    },


    // =====================
    // STREAKS
    // =====================

    winStreak: {
        type: Number,
        default: 0
    },


    highestWinStreak: {
        type: Number,
        default: 0
    },



    // =====================
    // EARNINGS
    // =====================

    totalEarned: {
        type: Number,
        default: 0
    },


    totalSpent: {
        type: Number,
        default: 0
    },



    // =====================
    // COOLDOWNS
    // =====================

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


    gambleCooldown: {
        type: Date,
        default: null
    },



    // =====================
    // INVENTORY
    // =====================

    inventory: [

        {

            item: {
                type: String,
                required: true
            },


            amount: {
                type: Number,
                default: 1
            }

        }

    ],



    // =====================
    // TRANSACTIONS
    // =====================

    transactions: [

        {

            type: {
                type: String,
                enum: [
                    "win",
                    "loss",
                    "pay",
                    "daily",
                    "work",
                    "rob",
                    "purchase"
                ]
            },


            amount: Number,


            date: {
                type: Date,
                default: Date.now
            }

        }

    ]

}, {

    timestamps: true

});



// One account per user per server

economySchema.index(
    {
        guildId: 1,
        userId: 1
    },
    {
        unique: true
    }
);



module.exports = model(
    "Economy",
    economySchema
);
