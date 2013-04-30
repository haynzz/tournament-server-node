/**
 * Author: Farhoud Cheraghi <haynzz@googlemail.com>
 * Date: 2013/03/27
 */

url = require('url');

module.exports = function (app, models) {

    var tournamentController = require('../controllers/tournamentController');

    app.get('/api/tournament', function (request, response) {

        var url_parts = url.parse(request.url, true);
        var params = url_parts.query;

        response.header('Access-Control-Allow-Origin', '*');
        var options = {
            perPage:params.size || 10,
            delta:params.delta || 0,
            page:params.page || 1
        };
        var query = models.tournament.find();
        query.paginate(options, function (err, res) {
            if (err) {
                return response.send("Cannot fetch tournaments", null, 400);
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

    app.post('/api/tournament', function (req, res) {
        var tournament;
        console.log("POST tournament: ");
        tournament = new models.tournament({
            name : req.body.name,
        });
        tournament.save(function (err) {
            if (!err) {
                console.log("tournament " + tournament.name + " created");
                return res.send(tournament);
            } else {
                console.log("Cannot post tournament with body: " + req.body);
                return res.send("Cannot post tournament with body: " + req.body, null, 400);
            }
        });

    });



    app.get('/api/tournament/:id', function (req, res) {
        return models.tournament.findById(req.params.id, function (err, tournament) {
            if (tournament != null) {
                return res.send(tournament);
            } else {
                console.log("Cannot find any tournament with id: " + req.params.id);
                return res.send("Cannot find any tournament with id: " + req.params.id, null, 404);
            }
        });
    });

    app.put('/api/tournament/:id', function (req, res) {
        console.log("PUT tournament: " + req.params.id + ": ");
        console.log(req.body);
        models.tournament.findById(req.params.id, function (err, tournament) {
            tournament.name = req.body.firstname;
            return tournament.save(function (err) {
                if (!err) {
                    console.log("tournament " + req.params.id + " updated");
                    return res.send(tournament);
                } else {
                    console.log(err);
                    return res.send("cannot update tournament: " + req.params.id, null, 400);
                }
            });
        });
    });

    app.delete('/api/tournament/:id', function (req, res) {
        return models.tournament.findById(req.params.id, 
            function (err, tournament) {
                if (tournament != null) {
                    return tournament.remove(function (err) {
                                if (!err) {
                                    console.log("tournament " + req.params.id + " removed");
                                    return res.send('');
                                } else {
                                    console.log(err);
                                    return res.send("cannot remove tournament: " + req.params.id, null, 400);
                                }
                    });
                }
                else {
                    return res.send("cannot remove tournament: " + req.params.id, null, 404);
                }
            });
    });

    app.put('/api/tournament/:id/addParticipantsById', function(req, res) {
        console.log("PUT tournament: " + req.params.id + ": ");
        console.log(req.body);

        var participant_ids = req.body.participant_ids;
        //console.log("participant_ids.isArray: " + Object.prototype.toString.call(participant_ids));
        console.log("participant_ids: " + participant_ids);
        var participants = [];

        //var query = models.participant.find({});
        

        //console.log("aParticipants: " + participants);

        models.tournament.findById(req.params.id, function (err, tournament) {

           if (err) {console.log(err); return;}; 
           
           return models.participant.where("_id").in(participant_ids).exec(function (err, participants){

                if (err) {console.log(err); return;};
                console.log("Participant query callback executed.");
                console.log("Number of Participants found: " + participants.length);
                console.log("aParticipants: " + participants);

                console.log("Adding Participants to Tournament: " + tournament);
                for (var i = participants.length - 1; i >= 0; i--) {
                    tournament.participants.addToSet(participants[i]);
                };
                //tournament.participants = []; 
                console.log("Have added Tournament: " + tournament);

                return tournament.save(function (err) {
                if (!err) {
                    console.log("tournament " + req.params.id + " updated");
                    return res.send(tournament);
                } else {
                    console.log(err);
                    return res.send("cannot update tournament: " + req.params.id, null, 400);
                }
            });
                
            });
        });
    });

    //should be a PUT or POST
    app.put('/api/tournament/:id/start', function(req, res) {
        
        console.log("START tournament: " + req.params.id + ": ");
        console.log("req.body: " + req.body);
        models.tournament.findById(req.params.id, function (err, tournament) {
            if(!err){
                if(!tournament.start()){
                    console.log("Tournament " + tournament.id + " is already started.");
                    return res.send("Tournament " + tournament.id + " is already started.");
                }
                return tournament.save(function (err, tournament){
                    if(!err){
                        console.log("Tournament" + tournament.id + " started and saved.");
                        return res.send(tournament);
                    } else {
                        console.log(err);
                        return res.send("Error while saving tournament: " + req.params.id, null, 400);
                    }

                }); 
            } else {
                console.log(err);
                return res.send("Cannot find tournament with id: " + req.params.id);
            } 
        });

    });

    app.put('/api/tournament/:id/clearRounds', function(req, res) {
        
        console.log("START tournament: " + req.params.id + ": ");
        console.log("req.body: " + req.body);
        models.tournament.findById(req.params.id, function (err, tournament) {
            
            /*
            while (tournament.rounds.length != 0)
            {
              console.log('Removing round ' + tournament.rounds[0]._id + ' from tournament');
                tournament.rounds[0].remove(function (err, round){
                    if(err) {
                        console.log('Error: ');
                        console.log(err);
                    }
                    console.log('Removed round from tournament');
                });
                //might need to save after each remove referring to internet research results  
            }
            */
            tournament.rounds = [];
            console.log('Emptied rounds from tournament');

            //asynchron call (or see above)
            tournament.save(function(err, tournament){
                if (!err) {
                    console.log("tournament " + req.params.id + " saved after emptying rounds");
                    return res.send(tournament);
                } else {
                    console.log("Erorr while saving after emptying rounds: ");
                    console.log(err);
                    return res.send("cannot update tournament: " + req.params.id, null, 400);
                }
            });
        });

    });

    app.get('/api/tournament/:id/round', function(req, res) {
        
        return models.tournament.findById(req.params.id, function (err, tournament) {
            if (tournament != null) {
                var page = {};
                page.rounds = tournament.rounds;
                return res.send(page);
            } else {
                console.log("Cannot find any tournament with id: " + req.params.id);
                return res.send("Cannot find any tournament with id: " + req.params.id, null, 404);
            }
        });
    });

    app.all('/api/tournament/:id/round/:roundid/*', function(req, res) {
        
        return models.tournament.findById(req.params.id, function (err, tournament) {
            if (tournament != null) {
                tournament.rounds.findById(req.params.roundid).require(app, models);
                return res.send(page);
            } else {
                console.log("Cannot find any tournament with id: " + req.params.id);
                return res.send("Cannot find any tournament with id: " + req.params.id, null, 404);
            }
        });
    });

    app.get('/api/tournament/:id/currentRound', function(req, res) {
        
        return models.tournament.findById(req.params.id, function (err, tournament) {
            if (tournament != null) {
                return res.send(tournament.rounds[tournament.rounds.length - 1]);
            } else {
                console.log("Cannot find any tournament with id: " + req.params.id);
                return res.send("Cannot find any tournament with id: " + req.params.id, null, 404);
            }
        });
    });

    // Don't forgets:

    //a new round can be started if there are at least so many players with less matches 
    //that a full round can be drawn
};