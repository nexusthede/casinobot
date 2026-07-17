const cache = new Map();

const DEFAULT_TTL = 10 * 60 * 1000; // 10 minutes

function makeKey(guildId, userId) {
    return `${guildId}:${userId}`;
}

function set(guildId, userId, data, ttl = DEFAULT_TTL) {
    const key = makeKey(guildId, userId);

    cache.set(key, {
        data,
        expires: Date.now() + ttl
    });

    return data;
}

function get(guildId, userId) {
    const key = makeKey(guildId, userId);

    const entry = cache.get(key);

    if (!entry) return null;

    if (Date.now() > entry.expires) {
        cache.delete(key);
        return null;
    }

    return entry.data;
}

function has(guildId, userId) {
    return get(guildId, userId) !== null;
}

function remove(guildId, userId) {
    return cache.delete(makeKey(guildId, userId));
}

function clear() {
    cache.clear();
}

function size() {
    return cache.size;
}

function refresh(guildId, userId, ttl = DEFAULT_TTL) {
    const key = makeKey(guildId, userId);

    const entry = cache.get(key);

    if (!entry) return false;

    entry.expires = Date.now() + ttl;

    cache.set(key, entry);

    return true;
}

// Remove expired entries every minute
setInterval(() => {
    const now = Date.now();

    for (const [key, value] of cache.entries()) {
        if (now > value.expires) {
            cache.delete(key);
        }
    }
}, 60 * 1000);

module.exports = {
    set,
    get,
    has,
    remove,
    clear,
    size,
    refresh
};
