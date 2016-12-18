const
    express = require("express"),
    router = express.Router(),
    routes = [
        require("./api/orion")
    ]


function setup(route) {
    const data = [];

    for (let api of routes) {
        for (let j in api) {
            data.push(route + j);
            router.use(j, api[j]);
        }
    }

    router.get("/", (req, res) => {
        res.json({
            data: data
        });
    });

    return router;
}

module.exports = setup;
