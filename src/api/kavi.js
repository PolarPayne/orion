const
    get = require("./getters").kavi,
    cache = require("../cache");

module.exports = {
    "/kavi": {
        getter: () => require("./getters").kavi(false),
        meta: {
            theater: "Kavi"
        }
    }
};
