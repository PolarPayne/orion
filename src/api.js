const
    cache = require("./cache"),
    router = require("express").Router(),
    routes = [
        require("./api/orion")
    ]

function setup(apiRoute, meta) {
    const data = [];

    for (let api of routes) {
        for (let route in api) {
            const fullRoute = apiRoute + route;

            console.log("Registering route \"%s\"", fullRoute);

            data.push(fullRoute);
            router.get(route, (req, res) => {
                cache(route, api[route].getter).then((data) => {
                    res.json({
                        route: fullRoute,
                        meta: api[route].meta,
                        data: data
                    });
                }).catch(() => {
                    res.sendStatus(500);
                });
            });
        }
    }

    router.get("/", (req, res) => {
        res.json({
            meta: meta,
            data: data
        });
    });

    return router;
}

module.exports = setup;
