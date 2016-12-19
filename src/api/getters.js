const
    _ = require("lodash"),
    $ = require("cheerio"),
    request = require("request"),
    cache = require("../cache");

function kavi(isOrion) {
    if (!_.isBoolean(isOrion))
        isOrion = false;

    function URL() {
        return "https://kauppa.kavi.fi/fi/" +
            "events/widget/event_list_with_search/widget_results/" +
            "52b19ea8770884a1168b4568/search/connect?search[dateFrom]=" +
            new Date().toISOString();
    }

    return cache("getters.kavi", () => {
        return new Promise((resolve, reject) => {
            request(URL(), (error, response, body) => {
                if (error || response.statusCode !== 200)
                    return reject();
                const out = [];

                $("td", body).each((i, v) => {
                    const item = $(v);

                    const theater = item.find("[class=nobr]").last().text();

                    const name = item.find("[itemprop=summary]").text();
                    if (_.isEmpty(name))
                        return;

                    const date = item.find("[itemprop=startDate]").text();
                    if (_.isEmpty(date))
                        return;

                    const link = item.find("a").attr("href");
                    if (_.isEmpty(link))
                        return;

                    out.push({
                        date: date,
                        theater: theater,
                        name: name,
                        link: link
                    });
                });
                return resolve(out);
            });
        });
    }).then((data) => {
        const out = [];
        for (let i in data) {
            if (isOrion && data.theater === "Elokuvateatteri Orion")
                break;
            else if (!isOrion && data.theater !== "Elokuvateatteri Orion")
                break;
            delete data.theater;
            out.push(data);
        }
        return out;
    });
}

module.exports = {
    kavi: kavi
}
