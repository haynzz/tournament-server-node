/**
 * Author: Farhoud Cheraghi <haynzz@googlemail.com>
 * RoundController
 */
var TournamentModel = require('../models/tournament').model;
var RoundModel = require('../models/round').model;
//console.log("RoundModel: " + RoundModel);

exports.listAllRounds = function (req, res) {
	return RoundModel.find({}, function (err, rounds) {
        if (rounds.length != 0) {
        	var page = {};
        	page.rounds = rounds;
            return res.send(page);
        } else {
            console.log("Cannot find any round with id: " + req.params.id);
            return res.send("Cannot find any round with id: " + req.params.id, null, 404);
        }
    });
}

exports.createRound = function (req, res) {
	var round;
        console.log("POST round: ");
        round = new RoundModel({
            name : req.body.name,
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
}

exports.loadRound = function (req, res, next) {
    var tournament = req.tournament;
    console.log("tournament: " + tournament);
    var round = tournament.rounds.id(req.params.id);
    if (round != null) {
    	req.round = round;
        return next();
    } else {
        console.log("Cannot find any round with id: " + req.params.id);
        return res.send("Cannot find any round with id: " + req.params.id, null, 404);
    }
}

exports.viewRound = function (req, res) {
	return res.json(req.round);
}
