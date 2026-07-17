const Economy = require("../models/Economy");

const cache = require("../recovery/cache");


async function getProfile(guildId, userId) {

    let profile = cache.get(
        guildId,
        userId
    );


    if (profile) {
        return profile;
    }


    profile = await Economy.findOne({
        guildId,
        userId
    });


    if (!profile) {

        profile = await Economy.create({
            guildId,
            userId
        });

    }


    cache.set(
        guildId,
        userId,
        profile
    );


    return profile;

}



async function saveProfile(profile) {

    await profile.save();


    cache.set(
        profile.guildId,
        profile.userId,
        profile
    );


    return profile;

}



async function addWallet(
    guildId,
    userId,
    amount
) {

    if (amount <= 0) return false;


    const profile = await getProfile(
        guildId,
        userId
    );


    profile.wallet += amount;
    profile.totalEarned += amount;


    await saveProfile(profile);


    return profile;

}



async function removeWallet(
    guildId,
    userId,
    amount
) {

    if (amount <= 0) return false;


    const profile = await getProfile(
        guildId,
        userId
    );


    if (profile.wallet < amount) {
        return false;
    }


    profile.wallet -= amount;
    profile.totalSpent += amount;


    await saveProfile(profile);


    return profile;

}



async function addBank(
    guildId,
    userId,
    amount
) {

    const profile = await getProfile(
        guildId,
        userId
    );


    profile.bank += amount;


    await saveProfile(profile);


    return profile;

}



async function removeBank(
    guildId,
    userId,
    amount
) {

    const profile = await getProfile(
        guildId,
        userId
    );


    if (profile.bank < amount) {
        return false;
    }


    profile.bank -= amount;


    await saveProfile(profile);


    return profile;

}



async function deposit(
    guildId,
    userId,
    amount
) {

    const profile = await getProfile(
        guildId,
        userId
    );


    if (
        amount <= 0 ||
        profile.wallet < amount
    ) {
        return false;
    }


    profile.wallet -= amount;
    profile.bank += amount;


    await saveProfile(profile);


    return profile;

}



async function withdraw(
    guildId,
    userId,
    amount
) {

    const profile = await getProfile(
        guildId,
        userId
    );


    if (
        amount <= 0 ||
        profile.bank < amount
    ) {
        return false;
    }


    profile.bank -= amount;
    profile.wallet += amount;


    await saveProfile(profile);


    return profile;

}



async function transfer(
    guildId,
    senderId,
    receiverId,
    amount
) {

    if (amount <= 0) {
        return false;
    }


    const sender = await getProfile(
        guildId,
        senderId
    );


    if (sender.wallet < amount) {
        return false;
    }


    const receiver = await getProfile(
        guildId,
        receiverId
    );


    sender.wallet -= amount;
    receiver.wallet += amount;


    sender.totalSpent += amount;
    receiver.totalEarned += amount;


    await saveProfile(sender);
    await saveProfile(receiver);


    return true;

}



function formatMoney(amount) {

    return Number(amount)
        .toLocaleString("en-US");

}



module.exports = {

    getProfile,
    saveProfile,

    addWallet,
    removeWallet,

    addBank,
    removeBank,

    deposit,
    withdraw,

    transfer,

    formatMoney

};
