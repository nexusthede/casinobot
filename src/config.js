module.exports = {
    token: process.env.TOKEN,

    prefix: ",",

    embedColor: "#2b2d31",

    mongoURI: process.env.MONGO_URI,

    economy: {
        dailyMin: 500,
        dailyMax: 1500,

        workMin: 250,
        workMax: 1000,

        begMin: 50,
        begMax: 300,

        maxBet: 1000000,

        startingWallet: 0,
        startingBank: 0
    }
};
