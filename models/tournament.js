/**
 * Author: Farhoud Cheraghi <haynzz@googlemail.com>
 * Date: 2013/03/27
 */
Helper              = require('../helpers/helpers.js');

mongoose			= require('mongoose');

ParticipantsSchema 	= require('./participant')(mongoose);
RankingSchema 		= require('./ranking')(mongoose);
RoundSchema 		= require('./round')(mongoose);

 module.exports = function (mongoose) {
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

    Tournament.methods.start = function(){

        console.log('Starting Tournament: ' + this);
        //console.log('Tournament.participants: ' + Helper.shuffleArray(this.participants.slice()));
        var numberOfPlayers = this.participants.length;
        var numberOfPairingsPerRound = Math.floor(numberOfPlayers / 4);
        var numberOfTeamsPerRound = numberOfPairingsPerRound * 2; 

        Helper.shuffleArray(this.participants.slice());
        var poolOfPlayers = this.participants.slice(0, numberOfTeamsPerRound*2);

        var firstRound = new RoundSchema.model();
        firstRound.createPairings(numberOfPairingsPerRound, poolOfPlayers);
        console.log("firstRound: " + firstRound);
        this.rounds.addToSet(firstRound);
    };

    Tournament.model = mongoose.model('Tournament', Tournament);

    return Tournament;
 };