const
    express = require("express"),
    app = express();


// Redirect to https if not running locally.
if (!process.env.LOCAL) {
    console.log("HTTPS redirection in use.");
    app.all("*", (req, res, next) => {
        if (req.get('X-Forwarded-Proto') !== "https") {
            res.redirect("https://" + req.hostname + req.originalUrl);
        };
        return next();
    });
}

app.use(express.static("./site/"));

const apiRoute = "/api";
app.use(apiRoute, require("./src/api")(apiRoute, {
    title: "Varjo Kino"
}));

app.get("*", (req, res) => {
    res.redirect("/");
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log("Listening on port %s.", port);
});
