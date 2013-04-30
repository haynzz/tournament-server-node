/**
 * Author: Farhoud Cheraghi <haynzz@googlemail.com>
 * TournamentController
 */

var TournamentModel = require('../models/tournament').model;

// var saveTournamentCallback = function (err, tournament){
//     if(!err){
//         console.log("Tournament" + tournament.id + "saved.");
//         return res.json(tournament);
//     } else {
//         console.log(err);
//         return res.send("Error while saving tournament: " + req.params.id, null, 400);
//     }
// }

exports.listAllTournaments = function (req, res) {
	return TournamentModel.find({}, function (err, tournaments) {
        if (tournaments.length != 0) {
        	var page = {};
        	page.tournaments = tournaments;
            return res.json(page);
        } else {
            console.log("Cannot find any tournament with id: " + req.params.id);
            return res.send("Cannot find any tournament with id: " + req.params.id, null, 404);
        }
    });
}

exports.createTournament = function (req, res) {
	var tournament;
        console.log("POST tournament: ");
        tournament = new TournamentModel({
            name : req.body.name,
        });
        tournament.save();
        return res.json(tournament);
}

exports.loadTournament = function (req, res, next) {
	console.log("Loading tournament: " + req.params.id);
    return TournamentModel.findById(req.params.id, function (err, tournament) {
        if (tournament != null) {
        	req.tournament = tournament;
            return next();
        } else {
            console.log("Cannot find any tournament with id: " + req.params.id);
            return res.send("Cannot find any tournament with id: " + req.params.id, null, 404);
        }
    });
}

exports.viewTournament = function (req, res) {
	console.log("Preparing tournament for view: " + req.tournament.id);
	return res.json(req.tournament);
}

exports.listAllRounds = function (req, res) {
	var tournament = req.tournament;
	var page = {};
	page.rounds = tournament.rounds;
	return res.json(page);
}

exports.getCurrentRound = function (req, res) {
	var tournament = req.tournament;
	return res.json(tournament.rounds.pop());
}

exports.startTournament = function (req, res) {
    var tournament = req.tournament;
    if(!tournament.start()) {
        return res.send("Tournament already started: " + tournament.id, null, 400);
    } else 
    {
        tournament.save();
        return res.json(tournament); 
    }  
}

exports.clearRounds = function (req, res) {
    var tournament = req.tournament;
    tournament.rounds = [];
    tournament.save();
    return res.json(tournament);
}