const
    get = require("./getters").kavi,
    cache = require("../cache");

module.exports = {
    "/orion": {
        getter: () => require("./getters").kavi(true),
        meta: {
            theater: "Orion",
            location: "https://www.google.com/maps/place/Orion/@60.1664733,24.9305374,16z/",
            link: "https://kavi.fi/fi/ohjelmisto/esityskalenteri"
        }
    }
};
