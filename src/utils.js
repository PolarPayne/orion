const
    _ = require("lodash");

function emptyish(v) {
    if (_.isNil(v) || (_.isString(v) && _.isem))
    return v === null || v === undefined || v === "";
};

module.exports = {
    emptyish: emptyish
};
