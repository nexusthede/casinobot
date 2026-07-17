const {
    getProfile,
    saveProfile,
    formatMoney
} = require("./economy");


const MAX_BET = 1000000;



function validateBet(amount) {

    amount = Number(amount);


    if (!amount || isNaN(amount)) {
        return {
            valid: false,
            message: "Invalid amount."
        };
    }


    if (amount <= 0) {

        return {
            valid: false,
            message: "Bet must be above 0."
        };

    }


    if (amount > MAX_BET) {

        return {
            valid: false,
            message:
                `Maximum bet is $${formatMoney(MAX_BET)}.`
        };

    }


    return {
        valid: true,
        amount
    };

}



async function placeBet(
    guildId,
    userId,
    amount,
    game
) {

    const profile =
        await getProfile(
            guildId,
            userId
        );


    if (profile.wallet < amount) {

        return {
            success: false,
            message: "You do not have enough money."
        };

    }


    profile.wallet -= amount;


    profile.gamesPlayed++;

    profile.totalWagered += amount;


    profile.transactions.push({

        type: "loss",

        amount,

        date: new Date()

    });


    await saveProfile(profile);



    return {
        success: true,
        profile
    };

}



async function winGame(
    guildId,
    userId,
    amount
) {

    const profile =
        await getProfile(
            guildId,
            userId
        );


    profile.wallet += amount;


    profile.gamesWon++;

    profile.totalWon += amount;



    if (
        amount >
        profile.biggestWin
    ) {

        profile.biggestWin = amount;

    }



    profile.winStreak++;


    if (
        profile.winStreak >
        profile.highestWinStreak
    ) {

        profile.highestWinStreak =
            profile.winStreak;

    }



    profile.transactions.push({

        type: "win",

        amount,

        date: new Date()

    });



    await saveProfile(profile);


    return profile;

}



async function loseGame(
    guildId,
    userId,
    amount
) {

    const profile =
        await getProfile(
            guildId,
            userId
        );


    profile.gamesLost++;


    profile.totalLost += amount;


    profile.winStreak = 0;



    if (
        amount >
        profile.biggestLoss
    ) {

        profile.biggestLoss = amount;

    }



    profile.transactions.push({

        type: "loss",

        amount,

        date: new Date()

    });



    await saveProfile(profile);


    return profile;

}



function random(min, max) {

    return Math.floor(
        Math.random() *
        (max - min + 1)
    ) + min;

}



module.exports = {

    validateBet,

    placeBet,

    winGame,

    loseGame,

    random,

    MAX_BET

};
