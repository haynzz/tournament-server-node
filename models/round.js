/**
 * Author: Farhoud Cheraghi <haynzz@googlemail.com>
 * Date: 2013/03/27
 */
  mongoose = require('mongoose');


  RankingSchema 	= require('./ranking')(mongoose);
  ParticipantSchema = require('./participant')(mongoose);
  TeamSchema		= require('./team')(mongoose);

 //module.exports = function (mongoose) {
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
 			isFinal	 : { type : Boolean },
 			homeSets : { type : Number },
 			awaySets : { type : Number },
 			sets 	 : [ SetSchema ]
 		}
 	});
 	PairingSchema.model = mongoose.model('Pairing', PairingSchema);

 	ParticipantSchema.methods.homeShotGoals = function(){
 		var shotGoals = 0;
 		for (var i = result.sets.length - 1; i >= 0; i--) {
 			shotGoal += result.sets[i].homeScore;
 		};
 		return shotGoals;
 	}

 	ParticipantSchema.methods.awayShotGoals = function(){
 		var shotGoals = 0;
 		for (var i = result.sets.length - 1; i >= 0; i--) {
 			shotGoal += result.sets[i].awayScore;
 		};
 		return shotGoals;
 	}

 	var Round = new Schema({
        ranking		: [ RankingSchema ],
        drawnTeams	: [ TeamSchema ],
        pairings	: [ PairingSchema ]
    });

    Round.methods.createPairings = function (numberOfPairingsPerRound, poolOfPlayers){
        //Find out which players are in the "should-play-pool"
        // #####################################################
                //filter all participants except the ones that (have just played) -> havePlayedPool
                //filter by players with most matches -> more matches
                    //filter by players with second most matches
                        //usw
                            //filter by players with least matches -> shouldPlayPool (playerPools.pop())
        // #####################################################
        //When there are enough players (ranks) in the shouldPlayPool to create all pairings,
        //then essamble team by rank-rules
        //############## RANK RULES ############################
            //Create a sub-ranking from the pool of players
            //Sub-ranking is not aware of any other pool-ranks when there are enough players in the pool for the pairings
            //Now Assign highest to lowest rank and so on
            //When the number of ranks > the number of players needed
            //validate pairing
            //Step A: when invalid decrease to uptable (as long as there are enough teams)
            //then validate pairing
                //when invalid go back to Step A: (OR go to downtable)
                //when still no valid pairing repeat procedure from step a with downtable.
        //############## RANK RULES ############################
        //else create the UPtable 
        //and take other eligible players into account
        //---> players that have played in last round are not eligible
        //then assemble team by rank-rules
            //when there are several players on one rank
            //then take player that hasn't played longer rounds ago
                //When same rank players have same amount of rounds not played 
                //then random (EXTRA: take less occuring Team)
        //teams must play
        //When there is not enough players for all pairings
        //then create uptable A when in uptable is eligbible player (only one game more)
        //else create downtable when in downtable is eiligible player (only one game more)
        //repeat the last two steps until enough eligible players have been found
        //when this does not start over to find players with changed eligibilty parameter (Alt A: two games more; ALT B: has played last round)
        //Now definetly enough players should be found
        //assembale teams by rank rule with respect to MUST-PLAY-POOL
            //when there .... (s. above)
        //Now validate possible teams as we have taken players from outside the pool there could be fairer pairings and teams
            //Team is invalid when average point-per-game strength is too low or too high (<=25% or >=75%)
        //When possible Team is invalid
        //Then extend table by Uptable rule and reset eligibility parameters




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

    Round.methods.calculateRanking = function(previousRanking){
    	//get previous Ranking and fork it
    	//go through all Pairings
    	var newRanking = new RankingSchema.model();
    	if(previousRanking)
    	{
    		var newRanking = previousRanking.clone();
    	}

    	for (var i = this.pairings.length - 1; i >= 0; i--) {
    		var currentPairing = this.pairings[i];
    		if(currentPairing.result.isFinal){
    			//add sets to teams rankings
    			//add for HomePlayers
    			newRanking.addResultsToPlayers(currentPairing.homeTeam.players, currentPairing.result.homeSets, currentPairing.result.homeShotGoals, currentPairing.result.awayShotGoals);
    			newRanking.addResultsToPlayers(currentPairing.awayTeam.players, currentPairing.result.awaySets, currentPairing.result.awayShotGoals, currentPairing.result.homeShotGoals);
    			//add for AwayPlayers
    		};
    	};
    	console.log("NEW RANKING:" + newRanking);
    	//fetch results
    	//and add to ranking
    	//set ranking
    	//return ranking
    }

    Round.methods.equals = function(otherRound){

        console.log("Round.equals: " + this._id.equals(otherRound._id) + 
        				" - " + this._id + " == " + otherRound._id);
        return (this._id.equals(otherRound._id));
    }

    Round.model = mongoose.model('Round', Round);

    module.exports = Round;

   // return Round;
 //};