const _ = require("lodash");

const
    cache = {},
    cacheTime = 1000*60*15,
    cacheRetryTime = 500;

function get(key, f) {
    const data = cache[key];
    if (!_.isNil(data))
        return Promise.resolve(data);
    return add(key, f);
}

function add(key, f) {
    console.log("Updating cache key=\"%s\"", key);
    return f().then((data) => {
        console.log("Updated cached key=\"%s\"", key);
        cache[key] = data;
        setTimeout(() => add(key, f), cacheTime);
        return data;
    }).catch(() => {
        console.log("Failed to update cached key=\"%s\"", key);
        setTimeout(() => add(key, f), cacheRetryTime);
    });
}

module.exports = get;
