/**
 * Author: Farhoud Cheraghi <haynzz@googlemail.com>
 * Date: 2013/03/27
 */

url = require('url');

module.exports = function (app, models) {

    app.get('/api/round', function (request, response) {

        var url_parts = url.parse(request.url, true);
        var params = url_parts.query;

        response.header('Access-Control-Allow-Origin', '*');
        var options = {
            perPage:params.size || 10,
            delta:params.delta || 0,
            page:params.page || 1
        };
        var query = models.round.find();
        query.paginate(options, function (err, res) {
            if (err) {
                return response.send("Cannot fetch rounds", null, 400);
            }
            else {
                var page = {}
                page.content = res.results;
                page.number = res.current;
                page.numberOfElements = res.results ? res.results.length : 0;
                page.totalElements = res.count;
                page.totalPages = res.last;
                page.hasContent = res.results && res.results.length > 0;
                page.hasNextPage = res.next != null;
                page.hasPreviousPage = res.prev != null;
                page.isFirstPage = res.prev == null;
                page.isLastPage = res.next == null;

                return response.send(page);
            }
        });
    });

    app.post('/api/round', function (req, res) {
        var round;
        console.log("POST round: ");
        round = new models.round({

            //name : req.body.name,

        });
        round.save(function (err) {
            if (!err) {
                console.log("round " + round.name + " created");
                return res.send(round);
            } else {
                console.log("Cannot post round with body: " + req.body);
                return res.send("Cannot post round with body: " + req.body, null, 400);
            }
        });

    });

    app.get('/api/round/:id', function (req, res) {
        return models.round.findById(req.params.id, function (err, round) {
            if (round != null) {
                return res.send(round);
            } else {
                console.log("Cannot find any round with id: " + req.params.id);
                return res.send("Cannot find any round with id: " + req.params.id, null, 404);
            }
        });
    });

    app.put('/api/round/:id', function (req, res) {
        console.log("PUT round: " + req.params.id + ": ");
        console.log(req.body);
        models.round.findById(req.params.id, function (err, round) {

            //round.name = req.body.firstname;


            return round.save(function (err) {
                if (!err) {
                    console.log("round " + req.params.id + " updated");
                    return res.send(round);
                } else {
                    console.log(err);
                    return res.send("cannot update round: " + req.params.id, null, 400);
                }
            });
        });
    });

    app.delete('/api/round/:id', function (req, res) {
        return models.round.findById(req.params.id, 
            function (err, round) {
                if (round != null) {
                    return round.remove(function (err) {
                                if (!err) {
                                    console.log("round " + req.params.id + " removed");
                                    return res.send('');
                                } else {
                                    console.log(err);
                                    return res.send("cannot remove round: " + req.params.id, null, 400);
                                }
                    });
                }
                else {
                    return res.send("cannot remove round: " + req.params.id, null, 404);
                }
            });
    });
};