/**
 * Author: Farhoud Cheraghi <haynzz@googlemail.com>
 * Date: 2013/03/27
 */

 //mongoose       = require('mongoose');

 //RoundSchema    = require('./round.js')(mongoose);

 module.exports = function (mongoose) {
 	var Schema = mongoose.Schema;

 	var RankSchema = new Schema({
 		rankingNumber : { type: Number, },
    	player			: { type: Schema.ObjectId, ref: 'Participant' },
    	meta : {
			 		nMatches	: { type: Number },
			 		wonMatches	: { type: Number },
			 		shotGoals	: { type: Number },
			 		counterGoals: { type: Number }
    	}
 	});
    mongoose.model('Rank', RankSchema);

 	var Ranking = new Schema({
 		//parRound	: { type: Schema.ObjectId, ref: 'Round' },
        ranks	    : { type: Schema.ObjectId, ref: 'Rank' }
    });

    RankSchema.model = mongoose.model('Ranking', Ranking);

    return RankSchema;
 };