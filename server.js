let express = require("express"),
    request = require("request"),
    $ = require("cheerio"),
    app = express();

let emptyish = (v) => {
    return v === null || v === undefined || v === "";
};

let html = null,
    json = null,
    cache_time = null,
    cache_age = 1000 * 60 * 15;  // 15 minutes

let get_data = (type, res) => {
    console.log("cache age: %s", Math.abs(cache_time - new Date()));
    if (cache_time === null || Math.abs(cache_time - new Date()) > cache_age) {
        cache_time = new Date();

        url = "https://kauppa.kavi.fi/fi/" +
              "events/widget/event_list_with_search/widget_results/" +
              "52b19ea8770884a1168b4568/search/connect?search[dateFrom]=" +
              new Date().toISOString();

        request(url, (error, response, body) => {
            if (error || response.statusCode !== 200) {
                if (type === "html")
                    res.status(500).send("<p style='text-align: center;'>Virhe hakiessa dataa.</p>");
                else
                    res.status(500).json({msg: "Virhe hakiessa dataa."})
            }

            let out = [];
            $("td", body).each((i, v) => {
                let item = $(v);

                let name = item.find("[itemprop=summary]").text();
                if (emptyish(name)) {
                    return;
                }

                let date = item.find("[itemprop=startDate]").text();
                if (emptyish(date)) {
                    return;
                }
                let theater = item.find("[class=nobr]").last().text();
                let link = item.find("a").attr("href");
                if (emptyish(link)) {
                    return;
                }
                out.push({
                    date: date,
                    theater: theater,
                    name: name,
                    link: link
                });
            });
            if (type === "html") {
                html = "";
                for (let i = 0; i < out.length; i++) {
                    html += "<div class='item'>"
                    html += "<p class='date'>" + out[i].date + "</p>\n";
                    html += "<h2><a href='" + out[i].link + "'>" + out[i].name + "</a></h2>\n";
                    html += "</div>"
                }

                res.send(html);
            } else {
                json = out;
                res.json(json);
            }
        });
    } else {
        if (type === "html")
            res.send(html);
        else
            res.json(json);
    }
};

/**
 * Redirect to https if not running locally.
 */
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

app.get("/api/html", (req, res) => {
    get_data("html", res);
});

app.get("/api/json", (req, res) => {
    get_data("json", res);
});

app.get("/api/health", (req, res) => {
    res.sendStatus(200);
});

app.get("*", (req, res) => {
    res.redirect("/");
});

let port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log("Listening on port %s.", port);
});
