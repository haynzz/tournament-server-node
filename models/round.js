/**
 * Author: Farhoud Cheraghi <haynzz@googlemail.com>
 * Date: 2013/03/27
 */
  mongoose = require('mongoose');


  RankingSchema 	= require('./ranking')(mongoose);
  ParticipantSchema = require('./participant')(mongoose);
  TeamSchema		= require('./team')(mongoose);

 module.exports = function (mongoose) {
 	var Schema = mongoose.Schema;

 	var SetSchema = new Schema({
 		homeScore	: { type : Number },
 		awayScore	: { type : Number }
 	});
 	SetSchema.model = mongoose.model('Set', SetSchema);


 	var PairingSchema = new Schema({
 		homeTeam : [ TeamSchema ],
 		awayTeam : [ TeamSchema ],
 		result	: { 
 			homeSets : { type :Number },
 			awaySets : { type :Number },
 			sets 	 : [ SetSchema ]
 		}
 	});
 	PairingSchema.model = mongoose.model('Pairing', PairingSchema);

 	var Round = new Schema({
        //ranking		: [ RankingSchema ],
        drawnTeams	: [ TeamSchema ],
        pairings	: [ PairingSchema ]
    });

    Round.methods.createPairings = function (numberOfPairingsPerRound, poolOfPlayers){
    	var numberOfTeamsPerRound = numberOfPairingsPerRound * 2;
    	for (var i = numberOfTeamsPerRound - 1; i >= 0; i--) {
    		var team = new TeamSchema.model();
    		team.players.addToSet(poolOfPlayers.shift());
    		team.players.addToSet(poolOfPlayers.pop());
    		this.drawnTeams.addToSet(team);
    	}

    	var teamPool = this.drawnTeams.slice();

    	for (var i = numberOfPairingsPerRound - 1; i >= 0; i--) {
    		var nextPairing = new PairingSchema.model();
    		nextPairing.homeTeam.push(teamPool.shift());
    		nextPairing.awayTeam.push(teamPool.pop());
    		this.pairings.addToSet(nextPairing);
    	}
    }

    Round.methods.equals = function(otherRound){
        console.log("Round.equals");
        return (this.id == otherRound.id);
    }

    Round.model = mongoose.model('Round', Round);

    return Round;
 };