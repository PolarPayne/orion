const
    _ = require("lodash"),
    $ = require("cheerio"),
    request = require("request"),
    cache = require("../cache"),
    emptyish = require("../utils").emptyish;

function URL() {
    return "https://kauppa.kavi.fi/fi/" +
           "events/widget/event_list_with_search/widget_results/" +
           "52b19ea8770884a1168b4568/search/connect?search[dateFrom]=" +
           new Date().toISOString();
}

function getData() {
    return new Promise((resolve, reject) => {
        request(URL(), (error, response, body) => {
            if (error || response.statusCode !== 200)
                return reject();
            const out = [];

            $("td", body).each((i, v) => {
                const item = $(v);

                const name = item.find("[itemprop=summary]").text();
                if (_.isEmpty(name))
                    return;

                const date = item.find("[itemprop=startDate]").text();
                if (_.isEmpty(date))
                    return;

                const theater = item.find("[class=nobr]").last().text();

                const link = item.find("a").attr("href");
                if (_.isEmpty(link))
                    return;

                out.push({
                    date: date,
                    name: name,
                    link: link
                });
            });
            return resolve(out);
        })
    });
}

function router(req, res) {
    cache("orion", getData).then((data) => {
        res.json({
            theater: "Orion",
            location: "https://www.google.com/maps/place/Orion/@60.1664733,24.9305374,16z/",
            link: "https://kavi.fi/fi/ohjelmisto/esityskalenteri",
            data: data
        })
    }).catch(() => {
        res.sendStatus(500);
    });
}

module.exports = {
    "/orion": router
};
