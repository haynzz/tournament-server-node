/**
 * Author: Farhoud Cheraghi <haynzz@googlemail.com>
 * Date: 2013/03/27
 */

 //mongoose       = require('mongoose');

 //RoundSchema    = require('./round.js')(mongoose);
 ParticipantSchema = require('./participant')(mongoose);

 module.exports = function (mongoose) {
 	var Schema = mongoose.Schema;

 	var RankSchema = new Schema({
 		rankingNumber : { type: Number, },
    	player			: [ ParticipantSchema ],
    	meta : {
			 		nMatches	: { type: Number },
			 		wonMatches	: { type: Number },
			 		shotGoals	: { type: Number },
			 		counterGoals: { type: Number }
    	}
 	});
    RankSchema.model = mongoose.model('Rank', RankSchema);

    RankSchema.methods.clone = function(){
        var cloneRank = new RankSchema.model();
        cloneRank.player = this.player;
        cloneRank.meta.nMatches = this.meta.nMatches;
        cloneRank.meta.wonMatches = this.meta.wonMatches;
        cloneRank.meta.shotGoals = this.meta.shotGoals;
        cloneRank.meta.counterGoals = this.meta.counterGoals;
        return cloneRank;
    }

    RankSchema.methods.equals = function(otherRank){
        console.log("Comparing ranks via player.")
        return this.player.equals(otherRank.player);
    }

 	var Ranking = new Schema({
 		//parRound	: { type: Schema.ObjectId, ref: 'Round' },
        ranks	    : [ RankSchema ]
    });
    
    Ranking.model = mongoose.model('Ranking', Ranking);

    Ranking.methods.findRankByPlayer = function(player){
        console.log("findRankByPlayer using Player: " + player);
        for (var i = this.ranks.length - 1; i >= 0; i--) {
            if(this.ranks[i].player.equals(player)){
                return this.ranks[i];
            }
        };
        return null;
    }

    Ranking.methods.addResultsToPlayers = function(players, sets, shotGoals, counterGoals){
        //find each player
        for (var i = players.length - 1; i >= 0; i--) {
            var rank = this.findRankByPlayer(players[i]);
            if(rank != null)
            {
                rank.meta.nMatches += 1;
                rank.meta.wonMatches += sets;
                rank.meta.shotGoals += shotGoals;
                rank.meta.counterGoals += counterGoals;  
            } 
        };
    }

    Ranking.methods.clone = function() {
        var cloneRanking = new Ranking.model();

        for (var i = this.ranks.length - 1; i >= 0; i--) {
            cloneRanking.ranks.addToSet(this.ranks[i].clone());
        };
        return cloneRank;
    }

    return Ranking;
 };