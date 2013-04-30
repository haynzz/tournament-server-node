/**
 * Author: Farhoud Cheraghi <haynzz@googlemail.com>
 * Date: 2013/03/27
 */
Helper              = require('../helpers/helpers.js');

mongoose			= require('mongoose');

ParticipantsSchema 	= require('./participant')(mongoose);
RankingSchema 		= require('./ranking')(mongoose);
RoundSchema 		= require('./round');

 //module.exports = function (mongoose) {
	//var ParticipantsSchema = require('./participant')(mongoose);

 	var Schema = mongoose.Schema;

 	var Tournament = new Schema({
        name			: { type : String, required:true },
        //participants	: [ { type : Schema.ObjectId, ref : 'Participant'} ],
        //participants	: [ require('./participant')(mongoose) ],
        participants	: [ ParticipantsSchema ],
        currentRanking	: [ RankingSchema ],
        rounds			: [ RoundSchema ]
    });

    /*
    * returns false when tournament already started
    */
    Tournament.methods.start = function(){
        if( this.rounds.length == 0 ){
            console.log('Starting Tournament: ' + this);
            //console.log('Tournament.participants: ' + Helper.shuffleArray(this.participants.slice()));
            var numberOfPlayers = this.participants.length; //min: 4
            
            var numberOfPairingsPerRound = Math.floor(numberOfPlayers / 4); //, but maximum number of Tables
            var numberOfTeamsPerRound = numberOfPairingsPerRound * 2; 

            var participantsShuffled = this.participants.slice();
            Helper.shuffleArray(participantsShuffled);
            var poolOfPlayers = participantsShuffled.slice(0, numberOfTeamsPerRound*2);

            var firstRound = new RoundSchema.model();

            firstRound.createPairings(numberOfPairingsPerRound, poolOfPlayers);
            firstRound.calculateRanking();
            console.log("firstRound: " + firstRound);
            this.rounds.addToSet(firstRound);

            return this;  
            } else {
                return false;
            }  
    };

    Tournament.methods.nextRound = function (previousRound) {
        //Extract players that MUST play in one pool
        //Extract players that have not played in other pool
        //Extract all other players in other pool

        
    }

    exports.model = mongoose.model('Tournament', Tournament);

    //return Tournament;
 //};