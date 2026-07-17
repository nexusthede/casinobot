const Economy = require("../models/Economy");

async function getProfile(guildId, userId) {
    let profile = await Economy.findOne({ guildId, userId });

    if (!profile) {
        profile = await Economy.create({
            guildId,
            userId
        });
    }

    return profile;
}

async function addWallet(guildId, userId, amount) {
    if (amount <= 0) return null;

    const profile = await getProfile(guildId, userId);

    profile.wallet += amount;
    profile.totalEarned += amount;

    await profile.save();

    return profile;
}

async function removeWallet(guildId, userId, amount) {
    if (amount <= 0) return null;

    const profile = await getProfile(guildId, userId);

    if (profile.wallet < amount) return false;

    profile.wallet -= amount;
    profile.totalSpent += amount;

    await profile.save();

    return profile;
}

async function addBank(guildId, userId, amount) {
    if (amount <= 0) return null;

    const profile = await getProfile(guildId, userId);

    profile.bank += amount;

    await profile.save();

    return profile;
}

async function removeBank(guildId, userId, amount) {
    if (amount <= 0) return null;

    const profile = await getProfile(guildId, userId);

    if (profile.bank < amount) return false;

    profile.bank -= amount;

    await profile.save();

    return profile;
}

async function deposit(guildId, userId, amount) {
    const profile = await getProfile(guildId, userId);

    if (profile.wallet < amount || amount <= 0) return false;

    profile.wallet -= amount;
    profile.bank += amount;

    await profile.save();

    return profile;
}

async function withdraw(guildId, userId, amount) {
    const profile = await getProfile(guildId, userId);

    if (profile.bank < amount || amount <= 0) return false;

    profile.bank -= amount;
    profile.wallet += amount;

    await profile.save();

    return profile;
}

async function transfer(guildId, fromUser, toUser, amount) {
    if (amount <= 0) return false;

    const sender = await getProfile(guildId, fromUser);

    if (sender.wallet < amount) return false;

    const receiver = await getProfile(guildId, toUser);

    sender.wallet -= amount;
    receiver.wallet += amount;

    sender.totalSpent += amount;
    receiver.totalEarned += amount;

    await sender.save();
    await receiver.save();

    return true;
}

function formatMoney(amount) {
    return Number(amount).toLocaleString("en-US");
}

module.exports = {
    getProfile,
    addWallet,
    removeWallet,
    addBank,
    removeBank,
    deposit,
    withdraw,
    transfer,
    formatMoney
};
